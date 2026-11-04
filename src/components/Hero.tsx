import React, { useState } from 'react';
import { translations, Language, KANO_AREAS } from '../translations.ts';
import { PropertyType } from '../types.ts';
import { Search, MapPin, Building, Banknote, ShieldCheck, CheckCircle2, PhoneCall } from 'lucide-react';

interface HeroProps {
  language: Language;
  onSearch: (filters: { type: string; area: string; maxPrice: string; search: string }) => void;
  onSelectCategory: (type: PropertyType) => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onSearch, onSelectCategory }) => {
  const t = translations[language];
  const [type, setType] = useState<string>('all');
  const [area, setArea] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ type, area, maxPrice, search: searchTerm });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-[#0B3D2E] to-[#07261C] text-white">
      {/* Background Decorative Mesh */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Search Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-900/60 border border-emerald-700/50 text-xs font-medium text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>{t.freeInspectionBadge}</span>
              <span className="text-emerald-500">·</span>
              <span className="text-[#C9A227] font-semibold">Kano Since 2022</span>
            </div>

            {/* Headline with No Orphan text-wrap */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-['Poppins'] leading-tight [text-wrap:balance]">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Direct Quick WhatsApp / Call Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
              <div className="flex items-center gap-1.5 text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                <span>100% Takardun Halal (C of O / R of O)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                <span>Babu Kudin Dubawa (FREE Inspection)</span>
              </div>
            </div>

            {/* Unified Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="p-3 bg-white text-slate-900 rounded-xl shadow-2xl border border-emerald-800/30 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Property Type Dropdown */}
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Nau'i (Type)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full pl-8 pr-6 py-2 bg-slate-50 text-xs font-medium text-slate-800 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    >
                      <option value="all">{t.allTypes}</option>
                      <option value="Gida">Gida (House / Flat)</option>
                      <option value="Fili">Fili (Plot / Land)</option>
                      <option value="Shago">Shago (Commercial Shop)</option>
                      <option value="Company">Company / Ofishi</option>
                      <option value="Warehouse">Warehouse (Rumbu)</option>
                      <option value="Hall">Hall (Dakin Taro)</option>
                    </select>
                  </div>
                </div>

                {/* Area Dropdown */}
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Unguwa (Kano Area)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full pl-8 pr-6 py-2 bg-slate-50 text-xs font-medium text-slate-800 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    >
                      <option value="all">{t.allAreas}</option>
                      {KANO_AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Max Price */}
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Farashi (Max Price ₦)
                  </label>
                  <div className="relative">
                    <Banknote className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <select
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-8 pr-6 py-2 bg-slate-50 text-xs font-medium text-slate-800 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    >
                      <option value="">Ko Wani Farashi</option>
                      <option value="500000">Kasa da ₦500,000</option>
                      <option value="1000000">Kasa da ₦1,000,000</option>
                      <option value="3000000">Kasa da ₦3,000,000</option>
                      <option value="5000000">Kasa da ₦5,000,000</option>
                      <option value="10000000">Kasa da ₦10,000,000</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Keyword & Submit Button */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs font-medium text-slate-800 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#C9A227] hover:bg-[#B58F1D] text-[#0B3D2E] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap cursor-pointer shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t.searchButton}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-700/40 bg-emerald-900 group">
              <img
                src="/src/assets/images/hero_kano_mansion_1793795009227.jpg"
                alt="Modern Luxury Real Estate in Kano Nigeria"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Floating Verified Badge */}
              <div className="absolute top-4 right-4 bg-[#0B3D2E]/90 backdrop-blur-md border border-[#C9A227]/40 text-[#C9A227] px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Kano Properties</span>
              </div>

              {/* Bottom Caption on Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-semibold text-[#C9A227] uppercase tracking-wider">
                  Murtala Mohammed Way, Kano
                </span>
                <h3 className="text-base font-bold text-white font-['Poppins']">
                  A.A Properties Kano - Adam Auwal Adam
                </h3>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  Gida, Fili, Shago da Company a duk fadin jihar Kano
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column KPI Trust Strip below hero (Frontend Design §5.13) */}
        <div className="mt-12 pt-8 border-t border-emerald-900/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-800/40">
            <div className="text-xl sm:text-2xl font-extrabold text-[#C9A227] font-['Poppins'] tabular-nums">
              150+
            </div>
            <div className="text-xs text-emerald-200 mt-1">{t.statProperties}</div>
          </div>
          <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-800/40">
            <div className="text-xl sm:text-2xl font-extrabold text-[#C9A227] font-['Poppins'] tabular-nums">
              1,200+
            </div>
            <div className="text-xs text-emerald-200 mt-1">{t.statClients}</div>
          </div>
          <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-800/40">
            <div className="text-xl sm:text-2xl font-extrabold text-[#C9A227] font-['Poppins'] tabular-nums">
              4.8 / 5.0
            </div>
            <div className="text-xs text-emerald-200 mt-1">{t.statRating} (347 reviews)</div>
          </div>
          <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-800/40">
            <div className="text-xl sm:text-2xl font-extrabold text-[#C9A227] font-['Poppins'] tabular-nums">
              5 Mins
            </div>
            <div className="text-xs text-emerald-200 mt-1">{t.statResponse}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
