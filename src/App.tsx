import React, { useState, useEffect } from 'react';
import {
  AppBlockComponent,
  AppProject,
  AppThemeConfig,
  DeviceView,
  StudioMode,
} from './types';
import {
  getActiveProjectId,
  getSavedProjects,
  saveProjects,
  setActiveProjectId,
  generateReactCode,
  createDefaultBlock,
} from './services/appGenerator';
import { THEME_PRESETS, APP_TEMPLATES } from './data/templates';
import { StudioNavbar } from './components/StudioNavbar';
import { ComponentPalette } from './components/ComponentPalette';
import { CanvasRenderer } from './components/CanvasRenderer';
import { PropertyInspector } from './components/PropertyInspector';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { TemplateSelectorModal } from './components/TemplateSelectorModal';
import { ThemeModal } from './components/ThemeModal';
import { CodeExportModal } from './components/CodeExportModal';
import { Copy, Download, Check } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<AppProject[]>(() => getSavedProjects());
  const [activeProjectId, setCurrentActiveId] = useState<string>(() => getActiveProjectId());
  const [mode, setMode] = useState<StudioMode>('builder');
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Code view copy state
  const [copiedCode, setCopiedCode] = useState(false);

  // Current active project
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0] || APP_TEMPLATES[0].project;
  const activePage = currentProject.pages.find((p) => p.id === currentProject.activePageId) || currentProject.pages[0];

  // Auto-save projects when currentProject changes
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    setActiveProjectId(activeProjectId);
  }, [activeProjectId]);

  // Update current project helper
  const updateProject = (updater: (prev: AppProject) => AppProject) => {
    setProjects((all) =>
      all.map((p) => (p.id === currentProject.id ? updater(p) : p))
    );
  };

  // Add component block to active page
  const handleAddComponent = (newBlock: AppBlockComponent) => {
    updateProject((prev) => {
      const pages = prev.pages.map((page) => {
        if (page.id === prev.activePageId || page.id === prev.pages[0].id) {
          return {
            ...page,
            components: [...page.components, newBlock],
          };
        }
        return page;
      });
      return { ...prev, pages, updatedAt: new Date().toISOString() };
    });
    setSelectedBlockId(newBlock.id);
  };

  // Move component up or down
  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    updateProject((prev) => {
      const pages = prev.pages.map((page) => {
        if (page.id === prev.activePageId || page.id === prev.pages[0].id) {
          const comps = [...page.components];
          const idx = comps.findIndex((c) => c.id === id);
          if (idx < 0) return page;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= comps.length) return page;

          const temp = comps[idx];
          comps[idx] = comps[targetIdx];
          comps[targetIdx] = temp;
          return { ...page, components: comps };
        }
        return page;
      });
      return { ...prev, pages };
    });
  };

  // Duplicate component
  const handleDuplicateBlock = (id: string) => {
    updateProject((prev) => {
      const pages = prev.pages.map((page) => {
        if (page.id === prev.activePageId || page.id === prev.pages[0].id) {
          const comps = [...page.components];
          const idx = comps.findIndex((c) => c.id === id);
          if (idx < 0) return page;
          const cloned: AppBlockComponent = JSON.parse(JSON.stringify(comps[idx]));
          cloned.id = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          cloned.title = `${cloned.title} (สำเนา)`;
          comps.splice(idx + 1, 0, cloned);
          return { ...page, components: comps };
        }
        return page;
      });
      return { ...prev, pages };
    });
  };

  // Delete component
  const handleDeleteBlock = (id: string) => {
    updateProject((prev) => {
      const pages = prev.pages.map((page) => {
        if (page.id === prev.activePageId || page.id === prev.pages[0].id) {
          return {
            ...page,
            components: page.components.filter((c) => c.id !== id),
          };
        }
        return page;
      });
      return { ...prev, pages };
    });
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  // Update component properties
  const handleUpdateBlock = (updated: AppBlockComponent) => {
    updateProject((prev) => {
      const pages = prev.pages.map((page) => {
        if (page.id === prev.activePageId || page.id === prev.pages[0].id) {
          return {
            ...page,
            components: page.components.map((c) => (c.id === updated.id ? updated : c)),
          };
        }
        return page;
      });
      return { ...prev, pages };
    });
  };

  // Add page
  const handleAddPage = (name: string) => {
    const newPage = {
      id: `page-${Date.now()}`,
      name,
      slug: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
      icon: 'FileText',
      components: [createDefaultBlock('navbar'), createDefaultBlock('footer')],
    };

    updateProject((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
      activePageId: newPage.id,
    }));
  };

  // Delete page
  const handleDeletePage = (pageId: string) => {
    if (currentProject.pages.length <= 1) return;
    updateProject((prev) => {
      const newPages = prev.pages.filter((p) => p.id !== pageId);
      return {
        ...prev,
        pages: newPages,
        activePageId: newPages[0].id,
      };
    });
  };

  // Switch active page
  const handleSelectPage = (pageId: string) => {
    updateProject((prev) => ({
      ...prev,
      activePageId: pageId,
    }));
    setSelectedBlockId(null);
  };

  // Create new project
  const handleNewProject = () => {
    const newProj: AppProject = {
      id: `proj-${Date.now()}`,
      name: 'แอพใหม่ของฉัน',
      description: 'แอพพลิเคชั่นสร้างด้วย App Studio',
      category: 'General',
      theme: THEME_PRESETS[0],
      activePageId: 'page-home',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [
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
            createDefaultBlock('footer'),
          ],
        },
      ],
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentActiveId(newProj.id);
  };

  // Select project from switcher
  const handleSelectProject = (id: string) => {
    setCurrentActiveId(id);
    setSelectedBlockId(null);
  };

  // Apply template
  const handleSelectTemplate = (templateProj: AppProject) => {
    setProjects((prev) => [templateProj, ...prev]);
    setCurrentActiveId(templateProj.id);
    setSelectedBlockId(null);
  };

  // Select theme
  const handleSelectTheme = (theme: AppThemeConfig) => {
    updateProject((prev) => ({
      ...prev,
      theme,
    }));
  };

  // Find currently selected block
  const selectedBlock = activePage?.components?.find((c) => c.id === selectedBlockId) || null;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050505] text-[#FAFAFA] font-sans overflow-hidden">
      {/* Top Navbar */}
      <StudioNavbar
        project={currentProject}
        savedProjects={projects}
        mode={mode}
        onSetMode={setMode}
        deviceView={deviceView}
        onSetDeviceView={setDeviceView}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {mode === 'code' ? (
          /* Code View Mode */
          <div className="flex-1 flex flex-col bg-[#0a0a0a] p-6 overflow-hidden">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">โค้ด React Component</h2>
                  <p className="text-xs text-neutral-400">
                    โค้ดคอมโพเนนต์ React 18+ พร้อม Tailwind CSS สำหรับโปรเจกต์ "{currentProject.name}"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateReactCode(currentProject));
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-xs font-bold text-white flex items-center gap-2 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                  </button>
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-xs font-bold text-white flex items-center gap-2 shadow-lg hover:opacity-90"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลดไฟล์</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-[#0e0e0e] border border-[#222222] p-5 overflow-auto custom-scrollbar font-mono text-xs text-neutral-300">
                <pre>
                  <code>{generateReactCode(currentProject)}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Builder & Preview Mode */
          <>
            {/* Left Component Palette (Visible in Builder Mode) */}
            {mode === 'builder' && (
              <ComponentPalette
                pages={currentProject.pages}
                activePageId={currentProject.activePageId}
                onSelectPage={handleSelectPage}
                onAddPage={handleAddPage}
                onDeletePage={handleDeletePage}
                onAddComponent={handleAddComponent}
                activeComponentsCount={activePage?.components?.length || 0}
              />
            )}

            {/* Canvas Area */}
            <CanvasRenderer
              project={currentProject}
              mode={mode}
              deviceView={deviceView}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onMoveBlock={handleMoveBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onDeleteBlock={handleDeleteBlock}
              onAddBlockPrompt={() => handleAddComponent(createDefaultBlock('hero'))}
              onSwitchPage={handleSelectPage}
            />

            {/* Right Property Inspector (Visible in Builder Mode) */}
            {mode === 'builder' && (
              <PropertyInspector
                selectedBlock={selectedBlock}
                onClose={() => setSelectedBlockId(null)}
                onUpdateBlock={handleUpdateBlock}
                theme={currentProject.theme}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAppGenerated={(genProj) => {
          setProjects((prev) => [genProj, ...prev]);
          setCurrentActiveId(genProj.id);
          setSelectedBlockId(null);
        }}
      />

      <TemplateSelectorModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentProjectId={currentProject.id}
      />

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentProject.theme}
        onSelectTheme={handleSelectTheme}
      />

      <CodeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={currentProject}
      />
    </div>
  );
}
