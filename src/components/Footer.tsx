import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { Phone, Mail, MapPin, MessageCircle, Shield, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface FooterProps {
  onNavigateTab: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const { openAuthModal, isAdmin } = useAuth();

  return (
    <footer className="bg-[#07261C] text-white border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo size="lg" isLight={true} />
            <p className="text-xs text-emerald-100/80 max-w-sm leading-relaxed">
              Babban kamfanin dillancin gidaje, filaye, da shaguna a jihar Kano. Muna bada tabbacin takardun halal, binciken kotu, da kariya ga masu haya da masu siye.
            </p>
            <p className="text-[11px] text-[#C9A227] font-semibold">
              CEO & Founder: Adam Auwal Adam · Est. 2022
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227] font-['Poppins']">
              Bangarori (Categories)
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('houses')}
                  className="hover:text-white transition-colors"
                >
                  Gidajen Haya da Sayarwa a Kano
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('land')}
                  className="hover:text-white transition-colors"
                >
                  Filaye Masu C of O da R of O
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('shops')}
                  className="hover:text-white transition-colors"
                >
                  Shaguna a Kantin Kwari & Sabon Gari
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('commercial')}
                  className="hover:text-white transition-colors"
                >
                  Ofisoshi da Warehouses a Sharada & Bompai
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-white transition-colors"
                >
                  Game da Adam Auwal Adam
                </button>
              </li>
            </ul>
          </div>

          {/* Kano Office Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227] font-['Poppins']">
              Ofishin Kano (Contact Office)
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-100/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>Murtala Mohammed Way, Kano, Kano State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="font-bold text-white">09042782681 / +2349042782681</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>aapropertieskano@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a
                  href="https://wa.me/2349042782681"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-[#C9A227] font-semibold"
                >
                  WhatsApp Kai Tsaye: 09042782681
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('admin')}
                className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 hover:text-white bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-800 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Kofar Shiga ta Admin (Adam)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Legal Bar */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-400/80">
          <p>© 2022 - 2026 A.A Properties Kano. Dukkan Hakki Mallakar Adam Auwal Adam ne.</p>
          <div className="flex items-center gap-4">
            <span>www.aapropertieskano.com</span>
            <span aria-hidden="true">·</span>
            <span>Kano State Real Estate</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C9A227]">Gaskiya & Aminci</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
