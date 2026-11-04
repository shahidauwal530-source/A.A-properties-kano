import React from 'react';
import { Property } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  FileCheck,
  MessageCircle,
  CalendarCheck,
  Droplet,
  Zap,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onBookInspection: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onBookInspection,
}) => {
  const { isFavorited, toggleFavorite } = useAuth();
  const favorited = isFavorited(property._id || property.id || '');

  // Format price in Nigerian Naira
  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG');
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(property._id || property.id || '');
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Fire tracking call
    fetch(`/api/properties/${property._id || property.id}/whatsapp-click`, { method: 'POST' }).catch(() => {});

    const msg = encodeURIComponent(
      `Salam Malam Adam (A.A Properties Kano),\n\nIna da sha\'awar wannan kaya:\n📌 *${property.title}*\n📍 *Unguwa:* ${property.area}, Kano\n💰 *Farashi:* ${formatNaira(property.price)} (${property.dealType})\n\nKarin bayani don Allah.`
    );
    window.open(`https://wa.me/2349042782681?text=${msg}`, '_blank');
  };

  const handleInspectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookInspection(property);
  };

  const imageSrc =
    property.images && property.images.length > 0
      ? property.images[0]
      : '/src/assets/images/kano_duplex_residence_1793795042264.jpg';

  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#0B3D2E]/40 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback image
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_kano_mansion_1793795009227.jpg';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Status & Deal Type Text Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#0B3D2E]/90 text-[#C9A227] px-2.5 py-1 rounded-md backdrop-blur-sm border border-[#C9A227]/30">
            {property.dealType}
          </span>
          {property.status !== 'Available' && (
            <span className="text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white px-2.5 py-1 rounded-md">
              {property.status}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Cire daga favorites' : 'Ajiye a favorites'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 flex items-center justify-center shadow-md transition-all active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-red-500 text-red-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Bottom Image Strip: Area & Legal Document */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 font-semibold truncate drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
            <span className="truncate">{property.area}, Kano</span>
          </div>

          {property.document !== 'None' && (
            <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[11px] text-emerald-300 font-medium backdrop-blur-sm border border-emerald-500/30">
              <FileCheck className="w-3 h-3 text-[#C9A227]" />
              <span>{property.document}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unboxed Metadata: Type & Utilities */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-[#0B3D2E]">{property.type}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate flex items-center gap-1">
              <Droplet className="w-3 h-3 text-cyan-600" />
              {property.water || 'Ruwa'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              {property.power || 'Wuta'}
            </span>
          </div>

          {/* Property Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0B3D2E] transition-colors line-clamp-1 font-['Poppins']">
            {property.title}
          </h3>

          {/* Price display with Tabular Numbers */}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-[#0B3D2E] font-['Poppins'] tabular-nums">
              {formatNaira(property.price)}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {property.dealType.includes('Year')
                ? '/ Shekara'
                : property.dealType.includes('Day')
                ? '/ Rana'
                : '/ Saya'}
            </span>
          </div>
        </div>

        {/* Feature Specs Grid */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600">
          {property.bedrooms ? (
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span className="tabular-nums font-semibold">{property.bedrooms} Bed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{property.size || 'Kano Plot'}</span>
            </div>
          )}

          {property.bathrooms ? (
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span className="tabular-nums font-semibold">{property.bathrooms} Bath</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium truncate">
              ✓ Tsaro
            </div>
          )}

          <div className="flex items-center justify-end text-[11px] text-slate-400 font-mono tabular-nums">
            {property.views || 0} views
          </div>
        </div>

        {/* Action Buttons: WhatsApp & FREE Inspection */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleInspectionClick}
            className="w-full py-2 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0B3D2E] border border-emerald-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#0B3D2E]" />
            <span className="truncate">FREE Inspection</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="w-full py-2 px-2 rounded-lg bg-[#0B3D2E] hover:bg-[#07261C] text-[#C9A227] text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#C9A227] text-[#0B3D2E]" />
            <span className="truncate">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
