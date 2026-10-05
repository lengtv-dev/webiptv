import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';

const app = express();
const isDev = process.env.NODE_ENV === 'development' && !process.env.K_SERVICE?.startsWith('ais-pre');
const PORT = Number(process.env.DEFAULT_APP_PORT) || 3000;

app.use(express.json());

// Enable CORS for all API routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Image Proxy to avoid Mixed Content (HTTP images on HTTPS site)
app.get('/api/proxy/image', async (req: Request, res: Response) => {
  try {
    const rawUrl = req.query.url;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).send('Missing url parameter');
    }
    const targetUrl = decodeURIComponent(rawUrl);
    
    // Quick validation
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      return res.status(400).send('Invalid url protocol');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const upstream = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return res.status(upstream.status).send('Failed to fetch image');
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (upstream.body) {
      const reader = upstream.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } else {
      res.end();
    }
  } catch (err: any) {
    res.status(502).send('Image proxy error');
  }
});

// Helper: Normalize Xtream server URL
function cleanUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }
  return url.replace(/\/+$/, '');
}

// 1. Xtream Codes player_api.php Proxy
app.get('/api/xtream', async (req: Request, res: Response) => {
  try {
    const { serverUrl, username, password, action, category_id, series_id, vod_id } = req.query;

    if (!serverUrl || !username || !password) {
      return res.status(400).json({ error: 'Missing serverUrl, username, or password' });
    }

    const base = cleanUrl(String(serverUrl));
    let target = `${base}/player_api.php?username=${encodeURIComponent(String(username))}&password=${encodeURIComponent(String(password))}`;

    if (action) target += `&action=${encodeURIComponent(String(action))}`;
    if (category_id) target += `&category_id=${encodeURIComponent(String(category_id))}`;
    if (series_id) target += `&series_id=${encodeURIComponent(String(series_id))}`;
    if (vod_id) target += `&vod_id=${encodeURIComponent(String(vod_id))}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(target, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'IPTVSmartersPro/1.0.0 (Linux;Android 11) Mobile',
        'Accept': 'application/json, text/plain, */*',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Upstream error: ${response.status} ${response.statusText}`,
      });
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        return res.json(json);
      } catch {
        return res.send(text);
      }
    }
  } catch (err: any) {
    console.error('Xtream API Proxy error:', err?.message);
    res.status(502).json({
      error: 'Failed to connect to Xtream Codes server',
      details: err?.message || String(err),
    });
  }
});

// 2. Intelligent Stream Proxy (Solves Mixed Content HTTPS->HTTP & CORS)
app.get('/api/proxy/stream', async (req: Request, res: Response) => {
  try {
    const rawTargetUrl = req.query.url;
    if (!rawTargetUrl || typeof rawTargetUrl !== 'string') {
      return res.status(400).send('Missing url parameter');
    }

    const targetUrl = decodeURIComponent(rawTargetUrl);
    const headers: Record<string, string> = {
      'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
    };

    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const upstreamRes = await fetch(targetUrl, {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Forward status code
    res.status(upstreamRes.status);

    // Forward critical stream headers
    const forwardHeaders = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control'];
    forwardHeaders.forEach((h) => {
      const val = upstreamRes.headers.get(h);
      if (val) res.setHeader(h, val);
    });

    res.setHeader('Access-Control-Allow-Origin', '*');

    const contentType = upstreamRes.headers.get('content-type') || '';
    const isM3U8 = contentType.includes('mpegurl') || 
                   contentType.includes('application/vnd.apple.mpegurl') || 
                   targetUrl.includes('.m3u8');

    if (isM3U8) {
      // Manifest file: Rewrite chunk and nested playlist URLs to pass through proxy
      const manifestText = await upstreamRes.text();
      const baseUrlObj = new URL(targetUrl);
      const basePath = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

      const lines = manifestText.split(/\r?\n/);
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        // Rewrite Key URI if present: #EXT-X-KEY:METHOD=AES-128,URI="http://..."
        if (trimmed.startsWith('#EXT-X-KEY')) {
          return trimmed.replace(/URI="([^"]+)"/, (match, uriVal) => {
            try {
              const absUri = new URL(uriVal, targetUrl).toString();
              return `URI="/api/proxy/stream?url=${encodeURIComponent(absUri)}"`;
            } catch {
              return match;
            }
          });
        }

        // Comments/Tags
        if (trimmed.startsWith('#')) {
          return line;
        }

        // URL / Segment path
        try {
          let absUrl = '';
          if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            absUrl = trimmed;
          } else if (trimmed.startsWith('/')) {
            absUrl = `${baseUrlObj.origin}${trimmed}`;
          } else {
            absUrl = `${basePath}${trimmed}`;
          }
          return `/api/proxy/stream?url=${encodeURIComponent(absUrl)}`;
        } catch {
          return line;
        }
      });

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      return res.send(rewrittenLines.join('\n'));
    }

    // Binary stream (TS, MP4, etc.) -> stream response directly
    if (upstreamRes.body) {
      // Convert web stream to Node readable or buffer
      const reader = upstreamRes.body.getReader();
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!res.write(value)) {
              await new Promise((resolve) => res.once('drain', resolve));
            }
          }
        } catch (err) {
          // Client disconnected
        } finally {
          res.end();
        }
      };
      await pump();
    } else {
      res.end();
    }
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(502).send(`Stream proxy error: ${err?.message || 'Unknown error'}`);
    }
  }
});

// 3. M3U Plus Playlist Exporter
app.get('/api/playlist/m3u', async (req: Request, res: Response) => {
  try {
    const { serverUrl, username, password } = req.query;
    if (!serverUrl || !username || !password) {
      return res.status(400).send('Missing serverUrl, username, or password');
    }

    const base = cleanUrl(String(serverUrl));
    const target = `${base}/get.php?username=${encodeURIComponent(String(username))}&password=${encodeURIComponent(String(password))}&type=m3u_plus&output=ts`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const upstream = await fetch(target, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
      },
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return res.status(upstream.status).send('Failed to fetch M3U playlist from server');
    }

    const m3uContent = await upstream.text();
    res.setHeader('Content-Type', 'application/x-mpegurl');
    res.setHeader('Content-Disposition', 'attachment; filename="playid_playlist.m3u"');
    res.send(m3uContent);
  } catch (err: any) {
    res.status(502).send(`Playlist export error: ${err?.message || 'Failed to download playlist'}`);
  }
});

async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/api/*', (req, res) => {
      res.status(404).json({ error: 'API route not found' });
    });
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PlayID IPTV Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
