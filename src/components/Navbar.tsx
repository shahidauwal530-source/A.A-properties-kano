import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { translations, Language } from '../translations.ts';
import { BrandLogo } from './BrandLogo.tsx';
import {
  Heart,
  Calendar,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  PhoneCall,
  MessageCircle,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateTab: (tab: 'home' | 'houses' | 'land' | 'shops' | 'commercial' | 'about' | 'favorites' | 'inspections' | 'profile' | 'admin') => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onNavigateTab,
  activeTab,
}) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const t = translations[language];
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Slim Top Bar: Trust info & Language toggle */}
      <div className="bg-[#0B3D2E] text-white text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-emerald-100/90 truncate">
            <span className="font-semibold text-[#C9A227] hidden sm:inline">
              CEO Adam Auwal Adam
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="truncate">📞 09042782681 ({t.freeInspectionBadge})</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Direct WhatsApp Callout */}
            <a
              href="https://wa.me/2349042782681"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#C9A227] hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp: 09042782681</span>
            </a>

            <span className="text-emerald-800" aria-hidden="true">|</span>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#07261C] p-0.5 rounded text-[11px] font-medium border border-emerald-900">
              <Globe className="w-3 h-3 text-[#C9A227] ml-1" />
              <button
                type="button"
                onClick={() => onLanguageChange('ha')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  language === 'ha'
                    ? 'bg-[#C9A227] text-[#0B3D2E] font-bold'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                HA
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  language === 'en'
                    ? 'bg-[#C9A227] text-[#0B3D2E] font-bold'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-5 Nav Links) — Zone 3 (Primary Action / User) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigateTab('home')}
          className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-lg"
        >
          <BrandLogo size="md" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            className={`whitespace-nowrap transition-colors hover:text-[#0B3D2E] pb-0.5 ${
              activeTab === 'home'
                ? 'text-[#0B3D2E] font-bold border-b-2 border-[#C9A227]'
                : ''
            }`}
          >
            {t.navHome}
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('houses')}
            className={`whitespace-nowrap transition-colors hover:text-[#0B3D2E] pb-0.5 ${
              activeTab === 'houses'
                ? 'text-[#0B3D2E] font-bold border-b-2 border-[#C9A227]'
                : ''
            }`}
          >
            {t.navHouses}
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('land')}
            className={`whitespace-nowrap transition-colors hover:text-[#0B3D2E] pb-0.5 ${
              activeTab === 'land'
                ? 'text-[#0B3D2E] font-bold border-b-2 border-[#C9A227]'
                : ''
            }`}
          >
            {t.navLand}
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('shops')}
            className={`whitespace-nowrap transition-colors hover:text-[#0B3D2E] pb-0.5 ${
              activeTab === 'shops'
                ? 'text-[#0B3D2E] font-bold border-b-2 border-[#C9A227]'
                : ''
            }`}
          >
            {t.navShops}
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('commercial')}
            className={`whitespace-nowrap transition-colors hover:text-[#0B3D2E] pb-0.5 ${
              activeTab === 'commercial'
                ? 'text-[#0B3D2E] font-bold border-b-2 border-[#C9A227]'
                : ''
            }`}
          >
            {t.navCompany}
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('about')}
            className={`whitespace-nowrap transition-colors hover:text-[#0B3D2E] pb-0.5 ${
              activeTab === 'about'
                ? 'text-[#0B3D2E] font-bold border-b-2 border-[#C9A227]'
                : ''
            }`}
          >
            {t.navAbout}
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0B3D2E] transition-all bg-slate-50 text-slate-800 text-sm font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              >
                <div className="w-7 h-7 rounded-full bg-[#0B3D2E] text-[#C9A227] flex items-center justify-center text-xs font-bold shrink-0">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.fullName}</span>
                {isAdmin && (
                  <span className="text-[10px] font-bold bg-[#C9A227] text-[#0B3D2E] px-1.5 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.phone} · {user.email}</p>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigateTab('admin');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#0B3D2E] hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-[#C9A227]" />
                      {t.adminDashboard}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigateTab('favorites');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                    {t.myFavorites}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigateTab('inspections');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#0B3D2E]" />
                    {t.myInspections}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigateTab('profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    {t.myProfile}
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.signOut}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-800 hover:text-[#0B3D2E] hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {t.signIn}
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="px-4 py-2 text-xs font-bold text-[#0B3D2E] bg-[#C9A227] hover:bg-[#B58F1D] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                {t.signUp}
              </button>
            </div>
          )}

          {/* Quick WhatsApp Action Button */}
          <a
            href="https://wa.me/2349042782681"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B3D2E] hover:bg-[#07261C] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Adam: 09042782681</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#0B3D2E] rounded-lg focus-visible:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-800 pb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={() => {
                onNavigateTab('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navHome}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateTab('houses');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navHouses}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateTab('land');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navLand}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateTab('shops');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navShops}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateTab('commercial');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navCompany}
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateTab('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navAbout}
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://wa.me/2349042782681"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 px-4 text-xs font-bold text-white bg-[#0B3D2E] rounded-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A227]" />
              WhatsApp Adam 09042782681
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
