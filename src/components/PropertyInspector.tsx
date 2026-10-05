import React from 'react';
import { AppBlockComponent, AppThemeConfig } from '../types';
import {
  X,
  Sliders,
  Plus,
  Trash2,
  Type,
  Image,
  AlignLeft,
  ListPlus,
  DollarSign,
  Tag,
  Link,
  HelpCircle,
} from 'lucide-react';

interface PropertyInspectorProps {
  selectedBlock: AppBlockComponent | null;
  onClose: () => void;
  onUpdateBlock: (updated: AppBlockComponent) => void;
  theme: AppThemeConfig;
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  selectedBlock,
  onClose,
  onUpdateBlock,
  theme,
}) => {
  if (!selectedBlock) {
    return (
      <aside className="w-80 bg-[#0c0c0c] border-l border-[#222222] p-6 flex flex-col items-center justify-center text-center space-y-3 shrink-0 h-[calc(100vh-4rem)] select-none">
        <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#222] flex items-center justify-center text-neutral-500">
          <Sliders className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-bold text-neutral-300">ตัวปรับแต่งคอมโพเนนต์</h4>
        <p className="text-[11px] text-neutral-500 max-w-[200px]">
          คลิกเลือกคอมโพเนนต์ใดก็ได้ในพื้นที่ทำงานตรงกลาง เพื่อแก้ไขข้อความ รูปภาพ และข้อมูล
        </p>
      </aside>
    );
  }

  const updateProp = (key: string, value: any) => {
    onUpdateBlock({
      ...selectedBlock,
      props: {
        ...selectedBlock.props,
        [key]: value,
      },
    });
  };

  return (
    <aside className="w-80 bg-[#0c0c0c] border-l border-[#222222] flex flex-col h-[calc(100vh-4rem)] shrink-0 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-[#222222] flex items-center justify-between bg-[#0e0e0e]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#FF6321]" />
          <div>
            <h3 className="text-xs font-bold text-white capitalize">{selectedBlock.type}</h3>
            <span className="text-[10px] text-neutral-400">ปรับแต่งคุณสมบัติ</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a1a]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Component Title & Subtitle */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3 h-3 text-[#FF6321]" />
            <span>หัวข้อคอมโพเนนต์ (Title)</span>
          </label>
          <input
            type="text"
            value={selectedBlock.title || ''}
            onChange={(e) => onUpdateBlock({ ...selectedBlock, title: e.target.value })}
            className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
          />
        </div>

        {selectedBlock.subtitle !== undefined && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft className="w-3 h-3 text-[#FF6321]" />
              <span>คำอธิบายย่อย (Subtitle)</span>
            </label>
            <input
              type="text"
              value={selectedBlock.subtitle || ''}
              onChange={(e) => onUpdateBlock({ ...selectedBlock, subtitle: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
            />
          </div>
        )}

        {/* Specific Props based on block type */}
        {selectedBlock.type === 'navbar' && (
          <div className="space-y-3 pt-2 border-t border-[#222]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400">ข้อความโลโก้ (Logo Text)</label>
              <input
                type="text"
                value={selectedBlock.props.logoText || ''}
                onChange={(e) => updateProp('logoText', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
              />
            </div>
          </div>
        )}

        {selectedBlock.type === 'hero' && (
          <div className="space-y-3 pt-2 border-t border-[#222]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400">พาดหัวใหญ่ (Headline)</label>
              <textarea
                rows={2}
                value={selectedBlock.props.heroHeadline || ''}
                onChange={(e) => updateProp('heroHeadline', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400">คำบรรยายย่อย (Subheadline)</label>
              <textarea
                rows={3}
                value={selectedBlock.props.heroSubheadline || ''}
                onChange={(e) => updateProp('heroSubheadline', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400">ข้อความปุ่มสั่งการหลัก (CTA Button)</label>
              <input
                type="text"
                value={selectedBlock.props.heroCtaText || ''}
                onChange={(e) => updateProp('heroCtaText', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5">
                <Image className="w-3 h-3 text-[#FF6321]" />
                <span>URL รูปภาพประกอบ (Image URL)</span>
              </label>
              <input
                type="text"
                value={selectedBlock.props.heroImageUrl || ''}
                onChange={(e) => updateProp('heroImageUrl', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white focus:outline-none focus:border-[#FF6321]"
              />
            </div>
          </div>
        )}

        {selectedBlock.type === 'product-grid' && (
          <div className="space-y-3 pt-2 border-t border-[#222]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                รายการสินค้า ({selectedBlock.props.items?.length || 0})
              </span>
              <button
                onClick={() => {
                  const items = selectedBlock.props.items || [];
                  const newItem = {
                    id: `item-${Date.now()}`,
                    title: 'สินค้าใหม่',
                    description: 'รายละเอียดสินค้าเพิ่มเติม',
                    price: 490,
                    badge: 'ใหม่',
                    actionText: 'สั่งซื้อ',
                  };
                  updateProp('items', [...items, newItem]);
                }}
                className="px-2 py-1 rounded bg-[#181818] text-[10px] font-bold text-[#FF6321] hover:bg-[#222]"
              >
                + เพิ่มสินค้า
              </button>
            </div>

            <div className="space-y-3">
              {(selectedBlock.props.items || []).map((item, idx) => (
                <div key={item.id} className="p-3 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px]">ชิ้นที่ {idx + 1}</span>
                    <button
                      onClick={() => {
                        const items = (selectedBlock.props.items || []).filter((_, i) => i !== idx);
                        updateProp('items', items);
                      }}
                      className="text-neutral-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="ชื่อสินค้า"
                    value={item.title}
                    onChange={(e) => {
                      const items = [...(selectedBlock.props.items || [])];
                      items[idx] = { ...items[idx], title: e.target.value };
                      updateProp('items', items);
                    }}
                    className="w-full px-2.5 py-1 rounded-lg bg-[#0c0c0c] border border-[#2e2e2e] text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="ราคา (บาท)"
                    value={item.price}
                    onChange={(e) => {
                      const items = [...(selectedBlock.props.items || [])];
                      items[idx] = { ...items[idx], price: Number(e.target.value) || 0 };
                      updateProp('items', items);
                    }}
                    className="w-full px-2.5 py-1 rounded-lg bg-[#0c0c0c] border border-[#2e2e2e] text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedBlock.type === 'interactive-form' && (
          <div className="space-y-3 pt-2 border-t border-[#222]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400">ข้อความบนปุ่มส่ง (Submit Button)</label>
              <input
                type="text"
                value={selectedBlock.props.submitButtonText || ''}
                onChange={(e) => updateProp('submitButtonText', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400">ข้อความเมื่อส่งสำเร็จ</label>
              <input
                type="text"
                value={selectedBlock.props.formSuccessMessage || ''}
                onChange={(e) => updateProp('formSuccessMessage', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white"
              />
            </div>
          </div>
        )}

        {selectedBlock.type === 'media-player' && (
          <div className="space-y-3 pt-2 border-t border-[#222]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400">ชื่อวิดีโอ (Video Title)</label>
              <input
                type="text"
                value={selectedBlock.props.mediaTitle || ''}
                onChange={(e) => updateProp('mediaTitle', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400">URL วิดีโอ (MP4 / WebM)</label>
              <input
                type="text"
                value={selectedBlock.props.mediaUrl || ''}
                onChange={(e) => updateProp('mediaUrl', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-white"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
