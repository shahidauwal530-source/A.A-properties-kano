import React, { useState } from 'react';
import { Property } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  FileCheck,
  ShieldCheck,
  Droplet,
  Zap,
  Car,
  Fence,
  MessageCircle,
  CalendarCheck,
  PhoneCall,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookInspection: (property: Property) => void;
  onSelectSimilar: (property: Property) => void;
  similarProperties: Property[];
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBookInspection,
  onSelectSimilar,
  similarProperties,
}) => {
  const { isFavorited, toggleFavorite } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!property) return null;

  const favorited = isFavorited(property._id || property.id || '');
  const images = property.images && property.images.length > 0
    ? property.images
    : ['/src/assets/images/kano_duplex_residence_1793795042264.jpg'];

  const formatNaira = (amount: number) => '₦' + amount.toLocaleString('en-NG');

  const handleWhatsApp = () => {
    fetch(`/api/properties/${property._id || property.id}/whatsapp-click`, { method: 'POST' }).catch(() => {});
    const msg = encodeURIComponent(
      `Salam Malam Adam (A.A Properties Kano),\n\nIna son karin bayani akan wannan gidan/filin:\n📌 *${property.title}*\n📍 *Unguwa:* ${property.area}, Kano\n💰 *Farashi:* ${formatNaira(property.price)} (${property.dealType})\n\nYa dace in zo duba shi?`
    );
    window.open(`https://wa.me/2349042782681?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Sticky Header with Close and Favorite */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-[#0B3D2E] text-sm uppercase tracking-wider">
              {property.type}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 truncate">{property.area}, Kano State</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(property._id || property.id || '')}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Ajiye a Favorites"
            >
              <Heart
                className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Rufe"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[78vh] overflow-y-auto space-y-6">
          {/* Main Large Image & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#0B3D2E]/90 text-[#C9A227] px-3 py-1 rounded-md text-xs font-bold border border-[#C9A227]/30">
                {property.dealType}
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded text-xs font-mono tabular-nums flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>{property.views || 0} views</span>
              </div>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-[#C9A227] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Kano property photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Title Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Poppins']">
                {property.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                <span className="font-semibold">{property.area}, Kano</span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700 font-medium">Binciken Takarda: {property.document}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] font-['Poppins'] tabular-nums">
                {formatNaira(property.price)}
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {property.dealType}
              </span>
            </div>
          </div>

          {/* Key Amenities & Specifications */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 font-['Poppins']">
              Kayan Ciki & Bayanan Tsari (Amenities & Features)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {property.bedrooms ? (
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#0B3D2E]" />
                  <span>
                    <strong>{property.bedrooms}</strong> Dakuna (Bedrooms)
                  </span>
                </div>
              ) : null}

              {property.bathrooms ? (
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-[#0B3D2E]" />
                  <span>
                    <strong>{property.bathrooms}</strong> Bandakuna (Baths)
                  </span>
                </div>
              ) : null}

              {property.size && (
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#0B3D2E]" />
                  <span>
                    Girma: <strong>{property.size}</strong>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#0B3D2E]" />
                <span>Takarda: <strong>{property.document}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-600" />
                <span>{property.water || 'Borehole / Famfo'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{property.power || 'Wutar NEPA / Solar'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Fence className="w-4 h-4 text-slate-600" />
                <span>{property.fence ? 'Katanga Zagaye' : 'Babu Katanga'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-slate-600" />
                <span>{property.parking ? 'Filin Fakin Mota' : 'Babu Parking'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 font-['Poppins']">
              Karin Bayani (Full Description)
            </h4>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-white p-4 rounded-xl border border-slate-100">
              {property.description}
            </div>
          </div>

          {/* Trust Guarantee Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#0B3D2E] shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-1">
              <p className="font-bold text-[#0B3D2E]">
                Tabbacin Gaskiya da Aminci daga Adam Auwal Adam (CEO)
              </p>
              <p className="text-emerald-900">
                Kowane gida ko fili a karkashin A.A Properties Kano an tantance takardunsa sosai a kotu da ma'aikatar filaye ta Kano. Zaka iya zuwa duba shi kyauta kafin ka biya ko kwabo.
              </p>
            </div>
          </div>

          {/* Action Callout Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onBookInspection(property)}
              className="w-full py-3 px-4 bg-[#C9A227] hover:bg-[#B58F1D] text-[#0B3D2E] font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>BOOK FREE INSPECTION A KANO</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full py-3 px-4 bg-[#0B3D2E] hover:bg-[#07261C] text-[#C9A227] font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-[#C9A227] text-[#0B3D2E]" />
              <span>YI MAGANA A WHATSAPP DA ADAM</span>
            </button>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-3 font-['Poppins']">
                Kayan da Suka Yi Kama a Kano (Similar Properties)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarProperties.map((sim) => (
                  <div
                    key={sim._id || sim.id}
                    onClick={() => onSelectSimilar(sim)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-[#0B3D2E] transition-colors cursor-pointer bg-slate-50"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 mb-2">
                      <img
                        src={sim.images?.[0] || '/src/assets/images/kano_duplex_residence_1793795042264.jpg'}
                        alt={sim.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate">{sim.title}</div>
                    <div className="text-xs font-semibold text-[#0B3D2E]">{formatNaira(sim.price)}</div>
                    <div className="text-[10px] text-slate-500 truncate">{sim.area}, Kano</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
