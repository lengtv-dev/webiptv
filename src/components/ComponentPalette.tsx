import React, { useState } from 'react';
import {
  Plus,
  Search,
  Layers,
  FileText,
  Trash2,
  Copy,
  Sparkles,
  Layout,
  Grid,
  Table,
  FormInput,
  ShoppingBag,
  Star,
  Film,
  HelpCircle,
  Zap,
  TrendingUp,
  PanelTop,
  PanelBottom,
  Check,
} from 'lucide-react';
import { AppBlockComponent, AppPage, BlockType } from '../types';
import { COMPONENT_PALETTE, createDefaultBlock } from '../services/appGenerator';

interface ComponentPaletteProps {
  pages: AppPage[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: (name: string) => void;
  onDeletePage: (id: string) => void;
  onAddComponent: (comp: AppBlockComponent) => void;
  activeComponentsCount: number;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onAddComponent,
  activeComponentsCount,
}) => {
  const [activeTab, setActiveTab] = useState<'components' | 'pages'>('components');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPageName, setNewPageName] = useState('');
  const [isAddingPage, setIsAddingPage] = useState(false);

  // Icon mapper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PanelTop': return <PanelTop className="w-4 h-4 text-[#FF6321]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Grid': return <Grid className="w-4 h-4 text-cyan-400" />;
      case 'FormInput': return <FormInput className="w-4 h-4 text-purple-400" />;
      case 'Table': return <Table className="w-4 h-4 text-blue-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-[#D4145A]" />;
      case 'Star': return <Star className="w-4 h-4 text-yellow-400" />;
      case 'Video': return <Film className="w-4 h-4 text-rose-400" />;
      case 'HelpCircle': return <HelpCircle className="w-4 h-4 text-teal-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-orange-400" />;
      case 'PanelBottom': return <PanelBottom className="w-4 h-4 text-neutral-400" />;
      default: return <Layout className="w-4 h-4 text-neutral-400" />;
    }
  };

  const filteredComponents = COMPONENT_PALETTE.filter((item) => {
    const matchesSearch = item.titleTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.descTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;
    onAddPage(newPageName.trim());
    setNewPageName('');
    setIsAddingPage(false);
  };

  return (
    <aside className="w-80 bg-[#0c0c0c] border-r border-[#222222] flex flex-col h-[calc(100vh-4rem)] select-none shrink-0">
      {/* Top Tabs */}
      <div className="p-3 border-b border-[#222222] grid grid-cols-2 gap-1.5 bg-[#0e0e0e]">
        <button
          onClick={() => setActiveTab('components')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'components'
              ? 'bg-[#181818] text-[#FF6321] border border-[#2a2a2a] shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>คอมโพเนนต์</span>
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'pages'
              ? 'bg-[#181818] text-[#FF6321] border border-[#2a2a2a] shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>หน้าจอ ({pages.length})</span>
        </button>
      </div>

      {activeTab === 'components' ? (
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="ค้นหาคอมโพเนนต์ (เช่น hero, ฟอร์ม, ตาราง)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141414] border border-[#262626] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6321] transition-colors"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px] font-semibold">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'content', label: 'เนื้อหา' },
              { id: 'interactive', label: 'ฟอร์ม/โต้ตอบ' },
              { id: 'data', label: 'ข้อมูล/สถิติ' },
              { id: 'layout', label: 'โครงสร้าง' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF6321] text-white font-bold'
                    : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#222222]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Component Item List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredComponents.map((item) => (
              <div
                key={item.type}
                className="p-3 rounded-2xl bg-[#121212] hover:bg-[#161616] border border-[#222222] hover:border-[#333333] transition-all group flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-[#181818] border border-[#282828] group-hover:scale-105 transition-transform shrink-0">
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors">
                      {item.titleTh}
                    </h4>
                    <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                      {item.descTh}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onAddComponent(createDefaultBlock(item.type))}
                  className="p-1.5 rounded-lg bg-[#1a1a1a] group-hover:bg-[#FF6321] text-neutral-400 group-hover:text-white border border-[#2a2a2a] group-hover:border-transparent transition-all shrink-0 hover:scale-110 active:scale-95"
                  title="คลิกเพื่อเพิ่มลงในหน้าจอ"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-[#111111] border border-[#222222] text-[11px] text-neutral-400 flex items-center justify-between">
            <span>คอมโพเนนต์ในหน้านี้:</span>
            <span className="font-bold text-[#FF6321]">{activeComponentsCount} ชิ้น</span>
          </div>
        </div>
      ) : (
        /* Pages Manager Tab */
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              รายการหน้าจอทั้งหมด
            </span>
            <button
              onClick={() => setIsAddingPage(!isAddingPage)}
              className="px-2 py-1 rounded-lg bg-[#181818] hover:bg-[#222222] text-xs font-semibold text-[#FF6321] flex items-center gap-1 border border-[#2a2a2a]"
            >
              <Plus className="w-3 h-3" />
              <span>เพิ่มหน้า</span>
            </button>
          </div>

          {/* Add Page Form */}
          {isAddingPage && (
            <form onSubmit={handleCreatePage} className="p-3 rounded-2xl bg-[#141414] border border-[#282828] space-y-2">
              <input
                type="text"
                placeholder="ชื่อหน้าใหม่ (เช่น ติดต่อเรา, โปรโมชั่น)..."
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                autoFocus
                className="w-full px-3 py-1.5 rounded-xl bg-[#0c0c0c] border border-[#2e2e2e] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6321]"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingPage(false)}
                  className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FF6321] text-white hover:opacity-90"
                >
                  สร้างหน้า
                </button>
              </div>
            </form>
          )}

          {/* Page List */}
          <div className="flex-1 overflow-y-auto space-y-1.5">
            {pages.map((p) => {
              const isActive = p.id === activePageId;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPage(p.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#181818] border-[#FF6321]/50 text-white shadow-sm'
                      : 'bg-[#111111] border-[#222222] text-neutral-300 hover:border-[#333333]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF6321]' : 'text-neutral-500'}`} />
                    <span className="text-xs font-bold truncate">{p.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#202020] text-neutral-400">
                      {p.components.length}
                    </span>
                  </div>

                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePage(p.id);
                      }}
                      className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-[#202020] transition-colors"
                      title="ลบหน้านี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
