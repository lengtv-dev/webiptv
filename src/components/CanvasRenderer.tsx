import React, { useState } from 'react';
import {
  AppBlockComponent,
  AppProject,
  AppThemeConfig,
  DeviceView,
  StudioMode,
} from '../types';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Plus,
  Play,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Star,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  Send,
  AlertCircle,
} from 'lucide-react';

interface CanvasRendererProps {
  project: AppProject;
  mode: StudioMode;
  deviceView: DeviceView;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onDuplicateBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlockPrompt: () => void;
  onSwitchPage: (pageId: string) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  project,
  mode,
  deviceView,
  selectedBlockId,
  onSelectBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onAddBlockPrompt,
  onSwitchPage,
}) => {
  const theme = project.theme;
  const activePage = project.pages.find((p) => p.id === project.activePageId) || project.pages[0];

  // Simulated interactive state in Preview mode
  const [cartItems, setCartItems] = useState<{ id: string; name: string; price: number; quantity: number }[]>([
    { id: 'c1', name: 'สินค้าตัวอย่างชิ้นที่ 1', price: 890, quantity: 1 },
  ]);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState<Record<string, boolean>>({});
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [kanbanItems, setKanbanItems] = useState(
    activePage?.components.find((c) => c.type === 'kanban-board')?.props.kanbanColumns || []
  );

  const handleAddToCart = (name: string, price: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === name);
      if (existing) {
        return prev.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: `cart-${Date.now()}`, name, price, quantity: 1 }];
    });
    setCartToast(`เพิ่ม "${name}" ลงในตะกร้าแล้ว`);
    setTimeout(() => setCartToast(null), 3000);
  };

  const handleFormSubmit = (blockId: string, e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted((prev) => ({ ...prev, [blockId]: true }));
    setTimeout(() => {
      setFormSubmitted((prev) => ({ ...prev, [blockId]: false }));
    }, 4000);
  };

  // Device dimension styling
  const getDeviceFrameClass = () => {
    switch (deviceView) {
      case 'mobile':
        return 'w-[390px] min-h-[780px] rounded-[48px] border-[10px] border-[#1e1e1e] shadow-2xl overflow-hidden my-6';
      case 'tablet':
        return 'w-[768px] min-h-[900px] rounded-[36px] border-[10px] border-[#1e1e1e] shadow-2xl overflow-hidden my-6';
      case 'desktop':
      default:
        return 'w-full max-w-[1240px] rounded-2xl border border-[#222222] shadow-xl overflow-hidden my-4';
    }
  };

  return (
    <div className="flex-1 bg-[#050505] overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center items-start relative">
      {/* Floating Toast Notification in Preview Mode */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{cartToast}</span>
        </div>
      )}

      {/* Device Frame */}
      <div
        className={`${getDeviceFrameClass()} transition-all duration-300 flex flex-col`}
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
        }}
      >
        {/* Device Top Status Bar Simulation for Mobile */}
        {deviceView === 'mobile' && (
          <div className="bg-black text-white text-[11px] font-semibold px-6 pt-3 pb-2 flex items-center justify-between select-none">
            <span>9:41</span>
            <div className="w-24 h-4 rounded-full bg-neutral-900 mx-auto -mt-1" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-4 h-2 rounded-sm border border-white flex items-center p-0.5">
                <div className="h-full w-2.5 bg-white rounded-2xs" />
              </div>
            </div>
          </div>
        )}

        {/* Browser Top Bar for Desktop */}
        {deviceView === 'desktop' && (
          <div className="bg-[#121212] border-b border-[#222222] px-4 py-2.5 flex items-center gap-3 select-none">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 max-w-sm mx-auto bg-[#0a0a0a] border border-[#222222] rounded-lg px-3 py-1 text-[11px] text-neutral-400 text-center truncate">
              https://{project.name.toLowerCase().replace(/\s+/g, '-')}.appstudio.run
            </div>
          </div>
        )}

        {/* App Content Canvas */}
        <div className="flex-1 flex flex-col">
          {(!activePage.components || activePage.components.length === 0) && (
            <div className="p-12 text-center my-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center mx-auto text-[#FF6321]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold">หน้านี้ยังไม่มีคอมโพเนนต์</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                เลือกคอมโพเนนต์จากเมนูด้านซ้ายเพื่อเริ่มต้นออกแบบ หรือคลิกปุ่มด้านล่างเพื่อเพิ่ม
              </p>
              <button
                onClick={onAddBlockPrompt}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#FF6321] text-white hover:opacity-90 transition-opacity"
              >
                + เพิ่มคอมโพเนนต์แรก
              </button>
            </div>
          )}

          {activePage.components.map((block, idx) => {
            const isSelected = mode === 'builder' && selectedBlockId === block.id;

            return (
              <div
                key={block.id}
                onClick={() => {
                  if (mode === 'builder') onSelectBlock(block.id);
                }}
                className={`relative group transition-all ${
                  mode === 'builder'
                    ? `cursor-pointer hover:outline hover:outline-2 hover:outline-[#FF6321]/50 ${
                        isSelected
                          ? 'outline outline-2 outline-[#FF6321] shadow-2xl z-10'
                          : ''
                      }`
                    : ''
                }`}
              >
                {/* Builder Mode Floating Toolbar */}
                {mode === 'builder' && (
                  <div
                    className={`absolute -top-3.5 right-4 z-20 flex items-center gap-1 bg-[#111111] border border-[#333333] rounded-lg p-1 shadow-2xl ${
                      isSelected ? 'flex' : 'hidden group-hover:flex'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-[#FF6321] px-2 uppercase tracking-wider">
                      {block.type}
                    </span>
                    <div className="h-3 w-px bg-[#333]" />
                    <button
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlock(block.id, 'up');
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30"
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={idx === activePage.components.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlock(block.id, 'down');
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30"
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateBlock(block.id);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-white"
                      title="คัดลอกคอมโพเนนต์"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBlock(block.id);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-rose-400"
                      title="ลบคอมโพเนนต์"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Render Specific Block Type */}
                {renderBlockContent(
                  block,
                  theme,
                  mode,
                  onSwitchPage,
                  handleAddToCart,
                  formValues,
                  setFormValues,
                  formSubmitted[block.id] || false,
                  (e) => handleFormSubmit(block.id, e),
                  expandedFaq,
                  setExpandedFaq,
                  cartItems,
                  setCartItems
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper: Render Block Content
function renderBlockContent(
  block: AppBlockComponent,
  theme: AppThemeConfig,
  mode: StudioMode,
  onSwitchPage: (pageId: string) => void,
  onAddToCart: (name: string, price: number) => void,
  formValues: Record<string, string>,
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  isSubmitted: boolean,
  onSubmit: (e: React.FormEvent) => void,
  expandedFaq: number | null,
  setExpandedFaq: React.Dispatch<React.SetStateAction<number | null>>,
  cartItems: { id: string; name: string; price: number; quantity: number }[],
  setCartItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; price: number; quantity: number }[]>>
) {
  switch (block.type) {
    case 'navbar':
      return (
        <nav
          className="px-6 py-4 border-b flex items-center justify-between gap-4 sticky top-0 z-30"
          style={{
            backgroundColor: theme.surfaceColor,
            borderColor: theme.borderColor,
          }}
        >
          <div className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-2">
            <span>{block.props.logoText || 'MY APP'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs font-semibold">
            {(block.props.navLinks || []).map((link, i) => (
              <button
                key={i}
                onClick={() => link.targetPage && onSwitchPage(link.targetPage)}
                className="hover:opacity-80 transition-opacity"
                style={{ color: theme.mutedTextColor }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddToCart('สินค้าด่วนพิเศษ', 290)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>สั่งซื้อ ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
            </button>
          </div>
        </nav>
      );

    case 'hero':
      return (
        <section className="px-6 py-10 sm:py-14 max-w-6xl mx-auto w-full">
          <div
            className={`p-6 sm:p-10 ${theme.borderRadius} border overflow-hidden relative flex flex-col md:flex-row items-center gap-8 justify-between`}
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            <div className="max-w-xl space-y-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  color: theme.primaryColor,
                  backgroundColor: `${theme.primaryColor}15`,
                  borderColor: `${theme.primaryColor}30`,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>พร้อมให้บริการวันนี้</span>
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {block.props.heroHeadline || 'ยินดีต้อนรับสู่บริการใหม่ของเรา'}
              </h1>

              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.mutedTextColor }}>
                {block.props.heroSubheadline || 'ระบบการจัดการที่รวดเร็ว ทรงประสิทธิภาพ และใช้งานง่ายสำหรับทุกคน'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <span>{block.props.heroCtaText || 'เริ่มต้นใช้งาน'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {block.props.heroCtaSecondary && (
                  <button
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-white/5 transition-colors"
                    style={{ borderColor: theme.borderColor, color: theme.textColor }}
                  >
                    {block.props.heroCtaSecondary}
                  </button>
                )}
              </div>
            </div>

            {block.props.heroImageUrl && (
              <div className="w-full md:w-80 h-48 md:h-60 rounded-2xl overflow-hidden shadow-xl shrink-0 border border-white/10">
                <img
                  src={block.props.heroImageUrl}
                  alt="Hero illustration"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </section>
      );

    case 'stats':
      return (
        <section className="px-6 py-6 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(block.props.stats || []).map((s, i) => (
              <div
                key={i}
                className={`p-5 ${theme.borderRadius} border space-y-1.5 transition-transform hover:scale-[1.02]`}
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor,
                }}
              >
                <div className="text-xs font-semibold" style={{ color: theme.mutedTextColor }}>
                  {s.label}
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: theme.textColor }}>
                  {s.value}
                </div>
                {s.change && (
                  <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{s.change}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case 'product-grid':
      return (
        <section className="px-6 py-8 max-w-6xl mx-auto w-full space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{block.title}</h2>
            {block.subtitle && (
              <p className="text-xs sm:text-sm mt-1" style={{ color: theme.mutedTextColor }}>
                {block.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(block.props.items || []).map((item) => (
              <div
                key={item.id}
                className={`overflow-hidden ${theme.borderRadius} border flex flex-col justify-between group hover:border-[#FF6321] transition-all`}
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor,
                }}
              >
                {item.image && (
                  <div className="h-40 overflow-hidden bg-neutral-900 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {item.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/80 text-amber-300 border border-amber-300/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm leading-snug text-white">{item.title}</h3>
                    {item.description && (
                      <p className="text-[11px] line-clamp-2 mt-1" style={{ color: theme.mutedTextColor }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="font-black text-sm" style={{ color: theme.primaryColor }}>
                      ฿{typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                    </span>
                    <button
                      onClick={() => onAddToCart(item.title, Number(item.price) || 100)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {item.actionText || 'เพิ่มลงตะกร้า'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'interactive-form':
      return (
        <section className="px-6 py-8 max-w-3xl mx-auto w-full">
          <div
            className={`p-6 sm:p-8 ${theme.borderRadius} border space-y-6`}
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            <div>
              <h2 className="text-xl font-black tracking-tight">{block.title}</h2>
              {block.subtitle && (
                <p className="text-xs sm:text-sm mt-1" style={{ color: theme.mutedTextColor }}>
                  {block.subtitle}
                </p>
              )}
            </div>

            {isSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{block.props.formSuccessMessage || 'ส่งข้อมูลเรียบร้อยแล้ว'}</span>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {(block.props.formFields || []).map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-xs font-bold block" style={{ color: theme.textColor }}>
                      {field.label} {field.required && <span className="text-rose-400">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        placeholder={field.placeholder}
                        value={formValues[field.id] || ''}
                        onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                        required={field.required}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#161616] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formValues[field.id] || ''}
                        onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                        required={field.required}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#161616] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
                      >
                        <option value="">-- โปรดเลือก --</option>
                        {(field.options || []).map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formValues[field.id] || ''}
                        onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                        required={field.required}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#161616] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{block.props.submitButtonText || 'ส่งข้อมูล'}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      );

    case 'data-table':
      return (
        <section className="px-6 py-8 max-w-6xl mx-auto w-full space-y-4">
          <div>
            <h2 className="text-xl font-black tracking-tight">{block.title}</h2>
            {block.subtitle && (
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: theme.mutedTextColor }}>
                {block.subtitle}
              </p>
            )}
          </div>

          <div
            className={`overflow-x-auto ${theme.borderRadius} border`}
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: theme.borderColor }}>
                  {(block.props.tableColumns || []).map((col, i) => (
                    <th key={i} className="p-3.5 font-bold uppercase text-[11px] tracking-wider text-neutral-400">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(block.props.tableRows || []).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-white/[0.02] transition-colors">
                    {(block.props.tableColumns || []).map((col, colIdx) => (
                      <td key={colIdx} className="p-3.5 text-neutral-200">
                        {String(row[col] || '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );

    case 'kanban-board':
      return (
        <section className="px-6 py-8 max-w-6xl mx-auto w-full space-y-4">
          <h2 className="text-xl font-black tracking-tight">{block.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(block.props.kanbanColumns || []).map((col) => (
              <div
                key={col.id}
                className={`p-4 ${theme.borderRadius} border flex flex-col space-y-3 min-h-[220px]`}
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor,
                }}
              >
                <div className="font-bold text-xs flex items-center justify-between pb-2 border-b border-white/10">
                  <span>{col.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    {col.items.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {col.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#181818] border border-[#2a2a2a] text-xs space-y-2 hover:border-[#FF6321]/50 transition-colors"
                    >
                      <div className="font-semibold text-neutral-200 leading-snug">{item.title}</div>
                      {item.tag && (
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#FF6321]/15 text-[#FF6321]">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'pricing-table':
      return (
        <section className="px-6 py-10 max-w-5xl mx-auto w-full space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{block.title}</h2>
            {block.subtitle && (
              <p className="text-xs sm:text-sm" style={{ color: theme.mutedTextColor }}>
                {block.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {(block.props.pricingTiers || []).map((tier) => (
              <div
                key={tier.id}
                className={`p-6 ${theme.borderRadius} border flex flex-col justify-between space-y-6 relative transition-all ${
                  tier.popular ? 'border-[#FF6321] ring-2 ring-[#FF6321]/30 scale-105' : ''
                }`}
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: tier.popular ? theme.primaryColor : theme.borderColor,
                }}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-white shadow-md">
                    ยอดนิยม
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black">{tier.price}</span>
                      <span className="text-xs text-neutral-400">{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    tier.popular ? 'text-white' : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                  style={{
                    backgroundColor: tier.popular ? theme.primaryColor : undefined,
                  }}
                >
                  {tier.buttonText || 'เลือกแพ็กเกจนี้'}
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    case 'order-cart': {
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return (
        <section className="px-6 py-8 max-w-3xl mx-auto w-full">
          <div
            className={`p-6 ${theme.borderRadius} border space-y-4`}
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FF6321]" />
                <span>{block.title}</span>
              </h3>
              <span className="text-xs font-semibold text-neutral-400">{cartItems.length} รายการ</span>
            </div>

            <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-neutral-400 mt-0.5">฿{item.price.toLocaleString()} x {item.quantity}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#FF6321]">฿{(item.price * item.quantity).toLocaleString()}</span>
                    <button
                      onClick={() =>
                        setCartItems((prev) => prev.filter((i) => i.id !== item.id))
                      }
                      className="text-neutral-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-sm font-black">
              <span>ยอดชำระรวม:</span>
              <span className="text-xl" style={{ color: theme.primaryColor }}>
                ฿{totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => alert(`🎉 ชำระเงินสำเร็จเรียบร้อย! ยอดรวม ฿${totalAmount.toLocaleString()}`)}
              className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-90 active:scale-98 transition-all"
              style={{ backgroundColor: theme.primaryColor }}
            >
              ดำเนินการชำระเงิน (Checkout)
            </button>
          </div>
        </section>
      );
    }

    case 'media-player':
      return (
        <section className="px-6 py-8 max-w-4xl mx-auto w-full space-y-4">
          <div>
            <h2 className="text-xl font-black tracking-tight">{block.title}</h2>
            {block.props.mediaTitle && (
              <p className="text-xs sm:text-sm mt-1" style={{ color: theme.mutedTextColor }}>
                {block.props.mediaTitle}
              </p>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden bg-black border border-[#222] shadow-2xl aspect-video relative flex items-center justify-center">
            {block.props.mediaUrl ? (
              <video
                src={block.props.mediaUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FF6321]/20 text-[#FF6321] flex items-center justify-center mx-auto">
                  <Play className="w-6 h-6 ml-0.5" />
                </div>
                <div className="text-xs text-neutral-400">ระบุลิงก์วิดีโอในหน้าจอปรับแต่ง</div>
              </div>
            )}
          </div>
        </section>
      );

    case 'faq-accordion':
      return (
        <section className="px-6 py-8 max-w-3xl mx-auto w-full space-y-4">
          <h2 className="text-xl font-black tracking-tight">{block.title}</h2>
          <div className="space-y-2.5">
            {(block.props.faqs || []).map((faq, i) => {
              const isOpen = expandedFaq === i;
              return (
                <div
                  key={i}
                  className={`border rounded-xl overflow-hidden transition-colors cursor-pointer`}
                  style={{
                    backgroundColor: theme.surfaceColor,
                    borderColor: theme.borderColor,
                  }}
                  onClick={() => setExpandedFaq(isOpen ? null : i)}
                >
                  <div className="p-4 flex items-center justify-between text-xs font-bold text-white">
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[#FF6321]' : 'text-neutral-400'}`}
                    />
                  </div>
                  {isOpen && (
                    <div
                      className="px-4 pb-4 pt-1 text-xs leading-relaxed border-t border-white/5"
                      style={{ color: theme.mutedTextColor }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );

    case 'review-testimonials':
      return (
        <section className="px-6 py-8 max-w-6xl mx-auto w-full space-y-4">
          <div>
            <h2 className="text-xl font-black tracking-tight">{block.title}</h2>
            {block.subtitle && (
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: theme.mutedTextColor }}>
                {block.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(block.props.items || []).map((item) => (
              <div
                key={item.id}
                className={`p-5 ${theme.borderRadius} border space-y-3`}
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs italic leading-relaxed text-neutral-300">"{item.description}"</p>
                <div className="font-bold text-xs text-white">— {item.title}</div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'cta-banner':
      return (
        <section className="px-6 py-8 max-w-5xl mx-auto w-full">
          <div
            className={`p-8 ${theme.borderRadius} text-center space-y-4 shadow-xl border`}
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            <h2 className="text-2xl font-black tracking-tight">{block.props.heroHeadline || block.title}</h2>
            {block.props.heroSubheadline && (
              <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: theme.mutedTextColor }}>
                {block.props.heroSubheadline}
              </p>
            )}
            <div className="pt-2">
              <button
                className="px-6 py-3 rounded-xl text-xs font-bold text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {block.props.heroCtaText || 'เริ่มต้นใช้งานฟรี'}
              </button>
            </div>
          </div>
        </section>
      );

    case 'footer':
      return (
        <footer
          className="mt-auto px-6 py-8 border-t text-center text-xs space-y-3"
          style={{
            backgroundColor: theme.surfaceColor,
            borderColor: theme.borderColor,
            color: theme.mutedTextColor,
          }}
        >
          <p>{block.props.footerText || '© 2026 App Studio. สร้างขึ้นอย่างสมบูรณ์แบบ'}</p>
          {block.props.footerLinks && block.props.footerLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
              {block.props.footerLinks.map((link, i) => (
                <a key={i} href={link.url} className="hover:underline">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </footer>
      );

    default:
      return null;
  }
}
