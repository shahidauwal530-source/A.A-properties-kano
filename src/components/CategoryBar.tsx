import React from 'react';
import { Home, LandPlot, Store, Building2, Warehouse, PartyPopper } from 'lucide-react';
import { PropertyType } from '../types.ts';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (type: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { id: 'all', label: 'Duka (All)', count: '150+', icon: Home },
    { id: 'Gida', label: 'Gidaje (Houses)', count: '85+', icon: Home },
    { id: 'Fili', label: 'Filaye (Land / Plots)', count: '45+', icon: LandPlot },
    { id: 'Shago', label: 'Shaguna (Shops)', count: '30+', icon: Store },
    { id: 'Company', label: 'Kamfanoni (Offices)', count: '20+', icon: Building2 },
    { id: 'Warehouse', label: 'Warehouse (Rumbu)', count: '12+', icon: Warehouse },
    { id: 'Hall', label: 'Hall na Biki', count: '8+', icon: PartyPopper },
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B3D2E] text-[#C9A227] shadow-md border border-[#0B3D2E]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C9A227]' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-emerald-950 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
