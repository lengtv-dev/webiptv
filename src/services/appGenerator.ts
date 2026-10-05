import { AppBlockComponent, AppProject, AppThemeConfig, BlockType } from '../types';
import { THEME_PRESETS, APP_TEMPLATES } from '../data/templates';

const STORAGE_KEY_PROJECTS = 'appcraft_saved_projects';
const STORAGE_KEY_ACTIVE = 'appcraft_active_project_id';

export const COMPONENT_PALETTE: {
  type: BlockType;
  titleTh: string;
  descTh: string;
  category: 'layout' | 'content' | 'data' | 'interactive' | 'media';
  icon: string;
}[] = [
  { type: 'navbar', titleTh: 'แถบเมนู (Navbar)', descTh: 'โลโก้ ลิงก์นำทาง และปุ่มแอคชัน', category: 'layout', icon: 'PanelTop' },
  { type: 'hero', titleTh: 'แบนเนอร์หลัก (Hero Banner)', descTh: 'หัวข้อใหญ่ คำบรรยาย และปุ่มสั่งการพร้อมรูปภาพ', category: 'content', icon: 'Sparkles' },
  { type: 'stats', titleTh: 'กล่องสถิติ (Key Metrics / Stats)', descTh: 'ตัวเลขชี้วัด เปอร์เซ็นต์การเติบโต และความสำเร็จ', category: 'data', icon: 'TrendingUp' },
  { type: 'product-grid', titleTh: 'ตารางสินค้า / การ์ดบริการ', descTh: 'แคตตาล็อกสินค้า ราคา และปุ่มสั่งซื้อ', category: 'content', icon: 'Grid' },
  { type: 'interactive-form', titleTh: 'แบบฟอร์มติดต่อ / จองคิว', descTh: 'ช่องกรอกข้อมูล ดรอปดาวน์ และปุ่มส่งข้อมูล', category: 'interactive', icon: 'FormInput' },
  { type: 'data-table', titleTh: 'ตารางข้อมูล (Data Table)', descTh: 'คอลัมน์ แถวข้อมูล และสถานะการทำงาน', category: 'data', icon: 'Table' },
  { type: 'kanban-board', titleTh: 'กระดานงาน (Kanban Board)', descTh: 'คอลัมน์แบ่งงาน To-Do, In Progress, Done', category: 'interactive', icon: 'Kanban' },
  { type: 'pricing-table', titleTh: 'ตารางราคาแพ็กเกจ (Pricing)', descTh: 'เปรียบเทียบฟีเจอร์และแผนสมาชิก', category: 'content', icon: 'DollarSign' },
  { type: 'order-cart', titleTh: 'ตะกร้าสินค้า (Order & Cart)', descTh: 'คำนวณยอดเงินรวมและสรุปออเดอร์', category: 'interactive', icon: 'ShoppingBag' },
  { type: 'review-testimonials', titleTh: 'รีวิวจากลูกค้า (Reviews)', descTh: 'ดาวความพึงพอใจและคำติชม', category: 'content', icon: 'Star' },
  { type: 'media-player', titleTh: 'เครื่องเล่นวิดีโอ (Media Player)', descTh: 'วิดีโอตัวอย่างและเพลเยอร์มัลติมีเดีย', category: 'media', icon: 'Video' },
  { type: 'faq-accordion', titleTh: 'คำถามที่พบบ่อย (FAQ Accordion)', descTh: 'กล่องถาม-ตอบ พับและขยายได้', category: 'content', icon: 'HelpCircle' },
  { type: 'cta-banner', titleTh: 'แบนเนอร์ปิดการขาย (CTA Box)', descTh: 'กระตุ้นให้ผู้ใช้ตัดสินใจและลงทะเบียน', category: 'layout', icon: 'Zap' },
  { type: 'footer', titleTh: 'ส่วนท้ายหน้าเว็บ (Footer)', descTh: 'ลิขสิทธิ์ ลิงก์ติดต่อ และข้อมูลบริษัท', category: 'layout', icon: 'PanelBottom' },
];

export function createDefaultBlock(type: BlockType): AppBlockComponent {
  const id = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  switch (type) {
    case 'navbar':
      return {
        id,
        type,
        title: 'แถบเมนูนำทาง',
        props: {
          logoText: '🚀 MY NEW APP',
          navLinks: [
            { label: 'หน้าแรก', targetPage: 'page-home' },
            { label: 'บริการของเรา', targetPage: 'page-services' },
            { label: 'ติดต่อเรา', targetPage: 'page-contact' },
          ],
        },
      };
    case 'hero':
      return {
        id,
        type,
        title: 'แบนเนอร์ไฮไลต์',
        props: {
          heroHeadline: 'สร้างสรรค์ประสบการณ์ที่เหนือระดับสำหรับลูกค้าของคุณ',
          heroSubheadline: 'ระบบการทำงานที่ทันสมัย รวดเร็ว และตอบสนองได้ทุกอุปกรณ์ พร้อมส่งมอบผลลัพธ์ที่คุณประทับใจ',
          heroCtaText: 'เริ่มต้นใช้งานฟรี',
          heroCtaSecondary: 'ดูรายละเอียดเพิ่มเติม',
          heroImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
        },
      };
    case 'stats':
      return {
        id,
        type,
        title: 'ตัวเลขและสถิติสำคัญ',
        props: {
          stats: [
            { label: 'ลูกค้าที่ไว้วางใจ', value: '12,500+', change: '+24% ปีนี้', isPositive: true },
            { label: 'คะแนนความพึงพอใจ', value: '4.9 / 5.0', change: 'จากผู้ใช้ 2,400+ คน', isPositive: true },
            { label: 'ระยะเวลาตอบกลับเฉลี่ย', value: '< 3 นาที', change: 'รวดเร็วสูงสุด', isPositive: true },
          ],
        },
      };
    case 'product-grid':
      return {
        id,
        type,
        title: 'รายการสินค้าและบริการเด่น',
        subtitle: 'เลือกชมสินค้าและบริการที่คุณสนใจ พร้อมโปรโมชั่นพิเศษ',
        props: {
          items: [
            {
              id: 'prod-1',
              title: 'แพ็กเกจบริการระดับพรีเมียม',
              description: 'บริการครบวงจร พร้อมทีมงานผู้เชี่ยวชาญดูแลตลอด 24 ชั่วโมง',
              price: 3500,
              badge: 'ยอดนิยม',
              image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
              actionText: 'สั่งซื้อทันที',
            },
            {
              id: 'prod-2',
              title: 'บริการชุดเริ่มต้น (Starter Kit)',
              description: 'เหมาะสำหรับธุรกิจขนาดเล็กและฟรีแลนซ์ เริ่มต้นได้ทันที',
              price: 1200,
              badge: 'คุ้มค่า',
              image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
              actionText: 'สั่งซื้อทันที',
            },
          ],
        },
      };
    case 'interactive-form':
      return {
        id,
        type,
        title: 'แบบฟอร์มติดต่อและส่งข้อความ',
        subtitle: 'กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
        props: {
          formFields: [
            { id: 'fullName', label: 'ชื่อ-นามสกุล', type: 'text', placeholder: 'กรอกชื่อและนามสกุลของคุณ', required: true },
            { id: 'email', label: 'อีเมลติดต่อ', type: 'email', placeholder: 'name@example.com', required: true },
            { id: 'serviceType', label: 'ประเภทบริการที่สนใจ', type: 'select', options: ['บริการให้คำปรึกษา', 'สั่งซื้อแพ็กเกจองค์กร', 'สอบถามทั่วไป'] },
            { id: 'message', label: 'รายละเอียดข้อความ', type: 'textarea', placeholder: 'บอกรายละเอียดความต้องการของคุณ...' },
          ],
          submitButtonText: 'ส่งข้อความติดต่อ',
          formSuccessMessage: '🎉 ส่งข้อมูลสำเร็จ! ขอบคุณที่ติดต่อเรา',
        },
      };
    case 'data-table':
      return {
        id,
        type,
        title: 'ตารางรายงานข้อมูล',
        props: {
          tableColumns: ['ลำดับ', 'รายการ', 'หมวดหมู่', 'ยอดเงิน', 'สถานะ'],
          tableRows: [
            { 'ลำดับ': '01', 'รายการ': 'สั่งซื้อระบบแอปพลิเคชัน', 'หมวดหมู่': 'ซอฟต์แวร์', 'ยอดเงิน': '฿18,500', 'สถานะ': 'เสร็จสิ้น' },
            { 'ลำดับ': '02', 'รายการ': 'ต่ออายุการบำรุงรักษารายปี', 'หมวดหมู่': 'บริการ', 'ยอดเงิน': '฿6,000', 'สถานะ': 'เสร็จสิ้น' },
            { 'ลำดับ': '03', 'รายการ': 'เพิ่มพื้นที่จัดเก็บข้อมูลคลาวด์', 'หมวดหมู่': 'อินฟราสตรัคเจอร์', 'ยอดเงิน': '฿2,400', 'สถานะ': 'รอการชำระ' },
          ],
        },
      };
    case 'kanban-board':
      return {
        id,
        type,
        title: 'กระดานงานโปรเจกต์',
        props: {
          kanbanColumns: [
            { id: 'col-1', title: 'รอดำเนินการ', items: [{ id: 't-1', title: 'รวบรวม Requirement จากลูกค้า', tag: 'Planning' }] },
            { id: 'col-2', title: 'กำลังทำ', items: [{ id: 't-2', title: 'ออกแบบ Wireframe หน้าจอหลัก', tag: 'UI Design' }] },
            { id: 'col-3', title: 'เสร็จสิ้น', items: [{ id: 't-3', title: 'จัดตั้งค่าเซิร์ฟเวอร์ฐานข้อมูล', tag: 'DevOps' }] },
          ],
        },
      };
    case 'pricing-table':
      return {
        id,
        type,
        title: 'ตารางราคาและแพ็กเกจ',
        props: {
          pricingTiers: [
            { id: 'tier-1', name: 'Basic', price: '฿990', period: '/เดือน', features: ['ฟีเจอร์พื้นฐาน', 'ผู้ใช้ 1 บัญชี', 'อีเมลช่วยเหลือ'], buttonText: 'เลือกแผนนี้' },
            { id: 'tier-2', name: 'Professional', price: '฿2,490', period: '/เดือน', popular: true, features: ['ฟีเจอร์ครบทุกอย่าง', 'ไม่จำกัดผู้ใช้', 'ซัพพอร์ตด่วนพิเศษ', 'รายงานขั้นสูง'], buttonText: 'เลือกแผนนี้' },
          ],
        },
      };
    case 'order-cart':
      return {
        id,
        type,
        title: 'รายการในตะกร้าสินค้า',
        props: {
          cartItems: [
            { id: 'c-1', name: 'สินค้าตัวอย่างชิ้นที่ 1', price: 850, quantity: 1 },
            { id: 'c-2', name: 'สินค้าตัวอย่างชิ้นที่ 2', price: 450, quantity: 2 },
          ],
        },
      };
    case 'review-testimonials':
      return {
        id,
        type,
        title: 'รีวิวและความประทับใจ',
        props: {
          items: [
            { id: 'r-1', title: 'คุณวิภาดา ม.', description: 'ระบบใช้งานง่ายมาก ทีมงานดูแลดีและแก้ปัญหาได้รวดเร็ว ประทับใจมากค่ะ', rating: 5, badge: 'ลูกค้าจริง' },
            { id: 'r-2', title: 'คุณกิตติศักดิ์ ช.', description: 'ช่วยเพิ่มยอดขายให้กับธุรกิจได้อย่างชัดเจน คุ้มค่ากับการลงทุนครับ', rating: 5, badge: 'ผู้บริหาร' },
          ],
        },
      };
    case 'media-player':
      return {
        id,
        type,
        title: 'วิดีโอแนะนำบริการ',
        props: {
          mediaTitle: 'วิดีโอพรีเซนเทชันแนะนำระบบและฟังก์ชันการใช้งาน',
          mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          mediaType: 'video',
        },
      };
    case 'faq-accordion':
      return {
        id,
        type,
        title: 'คำถามที่พบบ่อย (FAQ)',
        props: {
          faqs: [
            { question: 'สามารถปรับแต่งระบบได้ตามความต้องการหรือไม่?', answer: 'สามารถปรับแต่งโลโก้ สีสัน ข้อความ และคอมโพเนนต์ได้ตามต้องการผ่านตัวแก้ไข' },
            { question: 'มีทีมงานช่วยเหลือในการเริ่มต้นใช้งานหรือไม่?', answer: 'มีคู่มือภาษาไทยและทีมงานให้คำปรึกษาตลอดการใช้งาน' },
          ],
        },
      };
    case 'cta-banner':
      return {
        id,
        type,
        title: 'กล่องเรียกร้องความสนใจ',
        props: {
          heroHeadline: 'พร้อมที่จะยกระดับธุรกิจของคุณแล้วหรือยัง?',
          heroSubheadline: 'ลงทะเบียนวันนี้เพื่อรับสิทธิพิเศษและทดลองใช้งานฟรี 14 วัน',
          heroCtaText: 'ลงทะเบียนทันที',
        },
      };
    case 'footer':
      return {
        id,
        type,
        title: 'ส่วนท้ายหน้าเว็บ',
        props: {
          footerText: `© ${new Date().getFullYear()} My Application. สงวนลิขสิทธิ์ทั้งหมด`,
          footerLinks: [
            { label: 'เงื่อนไขการใช้งาน', url: '#' },
            { label: 'นโยบายความเป็นส่วนตัว', url: '#' },
            { label: 'ติดต่อเรา', url: '#' },
          ],
        },
      };
  }
}

// Smart AI / Heuristic Fallback Generator
export async function generateAppFromPrompt(prompt: string, category?: string): Promise<AppProject> {
  const cleanPrompt = prompt.trim();
  
  // 1. Try server-side Gemini API
  try {
    const res = await fetch('/api/ai/generate-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: cleanPrompt, category }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.project && !data.fallback) {
        const raw = data.project;
        return {
          id: `proj-${Date.now()}`,
          name: raw.name || 'แอพพลิเคชั่นใหม่',
          description: raw.description || cleanPrompt,
          category: raw.category || category || 'Custom App',
          theme: raw.theme || THEME_PRESETS[0],
          pages: (raw.pages && raw.pages.length > 0) ? raw.pages : [
            {
              id: 'page-home',
              name: 'หน้าแรก',
              slug: '/',
              icon: 'Home',
              components: [
                createDefaultBlock('navbar'),
                createDefaultBlock('hero'),
                createDefaultBlock('stats'),
                createDefaultBlock('product-grid'),
                createDefaultBlock('interactive-form'),
                createDefaultBlock('footer'),
              ],
            }
          ],
          activePageId: raw.pages?.[0]?.id || 'page-home',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('API call failed, switching to smart semantic generator:', err);
  }

  // 2. Intelligent Semantic Generator based on keywords in Thai/English
  const lower = cleanPrompt.toLowerCase();
  let baseTemplate = APP_TEMPLATES[0]; // default cafe

  if (lower.includes('ร้าน') || lower.includes('กาแฟ') || lower.includes('อาหาร') || lower.includes('เครื่องดื่ม') || lower.includes('coffee') || lower.includes('food')) {
    baseTemplate = APP_TEMPLATES[0];
  } else if (lower.includes('แดชบอร์ด') || lower.includes('วิเคราะห์') || lower.includes('สถิติ') || lower.includes('saas') || lower.includes('analytics') || lower.includes('เงิน') || lower.includes('crypto')) {
    baseTemplate = APP_TEMPLATES[1];
  } else if (lower.includes('งาน') || lower.includes('โปรเจกต์') || lower.includes('kanban') || lower.includes('task') || lower.includes('todo') || lower.includes('จัดการ')) {
    baseTemplate = APP_TEMPLATES[2];
  } else if (lower.includes('ขาย') || lower.includes('สินค้า') || lower.includes('ช้อป') || lower.includes('เสื้อ') || lower.includes('shop') || lower.includes('commerce') || lower.includes('market')) {
    baseTemplate = APP_TEMPLATES[3];
  } else if (lower.includes('วิดีโอ') || lower.includes('หนัง') || lower.includes('สตรีม') || lower.includes('stream') || lower.includes('media') || lower.includes('iptv') || lower.includes('เพลง')) {
    baseTemplate = APP_TEMPLATES[4];
  }

  // Clone and customize
  const cloned: AppProject = JSON.parse(JSON.stringify(baseTemplate.project));
  cloned.id = `proj-${Date.now()}`;
  cloned.name = cleanPrompt.length > 40 ? cleanPrompt.substring(0, 37) + '...' : cleanPrompt;
  cloned.description = `แอพพลิเคชั่นสร้างตามคำสั่ง: "${cleanPrompt}" พร้อมโครงสร้างแบบพร้อมใช้งาน`;
  cloned.createdAt = new Date().toISOString();
  cloned.updatedAt = new Date().toISOString();

  // Customize hero text if present
  if (cloned.pages[0]?.components) {
    const hero = cloned.pages[0].components.find((c) => c.type === 'hero');
    if (hero && hero.props) {
      hero.props.heroHeadline = cleanPrompt;
    }
  }

  return cloned;
}

// Local Storage helpers
export function getSavedProjects(): AppProject[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load projects from storage', e);
  }
  // Default to pre-seeded templates
  const initial = APP_TEMPLATES.map((t) => t.project);
  saveProjects(initial);
  return initial;
}

export function saveProjects(projects: AppProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to storage', e);
  }
}

export function getActiveProjectId(): string {
  return localStorage.getItem(STORAGE_KEY_ACTIVE) || APP_TEMPLATES[0].project.id;
}

export function setActiveProjectId(id: string): void {
  localStorage.setItem(STORAGE_KEY_ACTIVE, id);
}

// Export code generator: Produces standalone React 18 + Tailwind Component
export function generateReactCode(project: AppProject): string {
  const theme = project.theme;
  const page = project.pages.find((p) => p.id === project.activePageId) || project.pages[0];

  return `import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  ShoppingBag, 
  TrendingUp, 
  Check, 
  ChevronDown, 
  HelpCircle 
} from 'lucide-react';

// Generated by App Studio ("สร้างแอพพลิเคชั่น")
// Project: ${project.name}
// Theme: ${theme.name}
// Generated At: ${new Date().toLocaleString('th-TH')}

export default function ${project.name.replace(/[^a-zA-Z0-9]/g, '') || 'CustomApp'}() {
  const [cartCount, setCartCount] = useState(2);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[${theme.backgroundColor}] text-[${theme.textColor}] font-sans selection:bg-[${theme.primaryColor}] selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[${theme.surfaceColor}]/90 backdrop-blur-md border-b border-[${theme.borderColor}] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-tight text-[${theme.textColor}]">
              ${project.name}
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[${theme.mutedTextColor}]">
            ${(page.components.find(c => c.type === 'navbar')?.props.navLinks || [
              { label: 'หน้าแรก' },
              { label: 'บริการ' },
              { label: 'เกี่ยวกับเรา' }
            ]).map(l => `<a href="#" className="hover:text-[${theme.textColor}] transition-colors">${l.label}</a>`).join('\n            ')}
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCartCount(c => c + 1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[${theme.primaryColor}] text-white hover:opacity-90 transition-all shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ตะกร้า ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-16">
        ${page.components.map((comp) => {
          if (comp.type === 'hero') {
            return `{/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl p-8 md:p-14 bg-gradient-to-br from-[${theme.surfaceColor}] to-[${theme.backgroundColor}] border border-[${theme.borderColor}]">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[${theme.primaryColor}]/15 text-[${theme.primaryColor}] border border-[${theme.primaryColor}]/30">
              <Sparkles className="w-3.5 h-3.5" />
              ฟีเจอร์ใหม่พร้อมใช้งาน
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              ${comp.props.heroHeadline || 'ยินดีต้อนรับสู่ระบบของเรา'}
            </h1>
            <p className="text-base sm:text-lg text-[${theme.mutedTextColor}] leading-relaxed">
              ${comp.props.heroSubheadline || 'ระบบการจัดการที่ตอบสนองรวดเร็ว ทรงพลัง และยืดหยุ่น'}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="px-6 py-3.5 text-base font-bold rounded-2xl bg-gradient-to-r ${theme.accentGradient} text-white shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                <span>${comp.props.heroCtaText || 'เริ่มต้นใช้งาน'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>`;
          }

          if (comp.type === 'stats') {
            return `{/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${(comp.props.stats || []).map((s) => `
          <div className="p-6 rounded-2xl bg-[${theme.surfaceColor}] border border-[${theme.borderColor}] space-y-2">
            <div className="text-sm font-medium text-[${theme.mutedTextColor}]">${s.label}</div>
            <div className="text-3xl font-black tracking-tight text-[${theme.textColor}]">${s.value}</div>
            <div className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              ${s.change}
            </div>
          </div>`).join('\n')}
        </section>`;
          }

          if (comp.type === 'product-grid') {
            return `{/* Product Catalog */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">${comp.title}</h2>
            <p className="text-sm text-[${theme.mutedTextColor}]">${comp.subtitle || ''}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            ${(comp.props.items || []).map((item) => `
            <div className="rounded-2xl overflow-hidden bg-[${theme.surfaceColor}] border border-[${theme.borderColor}] flex flex-col group hover:border-[${theme.primaryColor}] transition-all">
              ${item.image ? `<div className="h-48 overflow-hidden bg-neutral-900"><img src="${item.image}" alt="${item.title}" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>` : ''}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-[${theme.textColor}]">${item.title}</h3>
                  <p className="text-xs text-[${theme.mutedTextColor}] mt-1">${item.description || ''}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[${theme.borderColor}]">
                  <span className="text-lg font-black text-[${theme.primaryColor}]">฿${item.price?.toLocaleString() || '0'}</span>
                  <button 
                    onClick={() => setCartCount(c => c + 1)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[${theme.primaryColor}] text-white hover:opacity-90 transition-opacity"
                  >
                    ${item.actionText || 'เพิ่มในตะกร้า'}
                  </button>
                </div>
              </div>
            </div>`).join('\n')}
          </div>
        </section>`;
          }

          return `{/* Component: ${comp.title} */}`;
        }).join('\n\n        ')}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[${theme.borderColor}] bg-[${theme.surfaceColor}] py-8 px-6 text-center text-sm text-[${theme.mutedTextColor}]">
        <p>© {new Date().getFullYear()} ${project.name}. พัฒนาและสร้างโดย App Studio</p>
      </footer>
    </div>
  );
}
`;
}
