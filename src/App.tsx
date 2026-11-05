/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Property, PropertyType } from './types.ts';
import { api } from './api/client.ts';
import { translations, Language, KANO_AREAS } from './translations.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { CategoryBar } from './components/CategoryBar.tsx';
import { PropertyCard } from './components/PropertyCard.tsx';
import { PropertyDetailModal } from './components/PropertyDetailModal.tsx';
import { InspectionModal } from './components/InspectionModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { UserDashboard } from './components/UserDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { Footer } from './components/Footer.tsx';
import ChatBot from './ChatBot.jsx';
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Building,
  MapPin,
  RefreshCw,
  Search,
} from 'lucide-react';

function MainApp() {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [language, setLanguage] = useState<Language>('ha');
  const t = translations[language];

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    'home' | 'houses' | 'land' | 'shops' | 'commercial' | 'about' | 'favorites' | 'inspections' | 'profile' | 'admin'
  >('home');

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<string>('');

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inspectionTargetProperty, setInspectionTargetProperty] = useState<Property | null>(null);
  const [similarProps, setSimilarProps] = useState<Property[]>([]);

  // Fetch properties on filter change
  useEffect(() => {
    fetchProperties();
  }, [selectedCategory, selectedArea, selectedDoc, sortOption, maxPriceFilter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const query: Record<string, string> = {
        sort: sortOption,
        status: 'Available',
      };
      if (selectedCategory && selectedCategory !== 'all') {
        query.type = selectedCategory;
      }
      if (selectedArea && selectedArea !== 'all') {
        query.area = selectedArea;
      }
      if (selectedDoc && selectedDoc !== 'all') {
        query.document = selectedDoc;
      }
      if (maxPriceFilter) {
        query.maxPrice = maxPriceFilter;
      }
      if (searchQuery) {
        query.search = searchQuery;
      }

      const res = await api.getProperties(query);
      if (res.success) {
        setProperties(res.properties || []);
      }
    } catch (e) {
      console.error('Failed to fetch properties:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (filters: { type: string; area: string; maxPrice: string; search: string }) => {
    setSelectedCategory(filters.type);
    setSelectedArea(filters.area);
    setMaxPriceFilter(filters.maxPrice);
    setSearchQuery(filters.search);
    setActiveTab('home');

    // Scroll smoothly to properties
    const el = document.getElementById('listings-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectProperty = async (prop: Property) => {
    setSelectedProperty(prop);
    try {
      const res = await api.getPropertyById(prop._id || prop.id || '');
      if (res.success) {
        setSelectedProperty(res.property);
        setSimilarProps(res.similar || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNavigateTab = (tab: any) => {
    if (tab === 'admin' && !isAdmin) {
      openAuthModal('admin');
      return;
    }
    if ((tab === 'favorites' || tab === 'inspections' || tab === 'profile') && !user) {
      openAuthModal('signin');
      return;
    }

    setActiveTab(tab);

    if (tab === 'houses') {
      setSelectedCategory('Gida');
    } else if (tab === 'land') {
      setSelectedCategory('Fili');
    } else if (tab === 'shops') {
      setSelectedCategory('Shago');
    } else if (tab === 'commercial') {
      setSelectedCategory('Company');
    } else if (tab === 'home') {
      setSelectedCategory('all');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedArea('all');
    setSelectedDoc('all');
    setMaxPriceFilter('');
    setSearchQuery('');
    setSortOption('newest');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#1A1A1A]">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onNavigateTab={handleNavigateTab}
        activeTab={activeTab}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* TAB: ADMIN DASHBOARD */}
        {activeTab === 'admin' && isAdmin ? (
          <AdminDashboard />
        ) : activeTab === 'favorites' || activeTab === 'inspections' || activeTab === 'profile' ? (
          /* TAB: USER DASHBOARD */
          <UserDashboard
            initialTab={activeTab as any}
            onSelectProperty={handleSelectProperty}
            onBookInspection={(p) => setInspectionTargetProperty(p)}
          />
        ) : activeTab === 'about' ? (
          /* TAB: ABOUT PAGE */
          <AboutSection />
        ) : (
          /* TAB: HOMEPAGE / PROPERTIES BROWSER */
          <>
            {/* Hero Section */}
            <Hero
              language={language}
              onSearch={handleHeroSearch}
              onSelectCategory={(type: PropertyType) => {
                setSelectedCategory(type);
                const el = document.getElementById('listings-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Category Filter Bar */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={(type) => setSelectedCategory(type)}
            />

            {/* Main Listings Section */}
            <section id="listings-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
              {/* Section Header & Inline Interactive Filters */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider">
                    {t.featuredTitle}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Poppins']">
                    {selectedCategory === 'all'
                      ? 'Dukkan Kayayyaki a Kano'
                      : `${selectedCategory} a Kano`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">{t.featuredSubtitle}</p>
                </div>

                {/* Filter Controls Strip */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Area Filter */}
                  <div className="relative">
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] shadow-sm"
                    >
                      <option value="all">Kano: Dukkan Unguwar</option>
                      {KANO_AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Document Type Filter */}
                  <div className="relative">
                    <select
                      value={selectedDoc}
                      onChange={(e) => setSelectedDoc(e.target.value)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] shadow-sm"
                    >
                      <option value="all">Takarda: Duka</option>
                      <option value="C of O">C of O</option>
                      <option value="R of O">R of O</option>
                      <option value="Tenancy Agreement">Tenancy Agreement</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] shadow-sm"
                    >
                      <option value="newest">{t.newest}</option>
                      <option value="price-low">{t.priceLowHigh}</option>
                      <option value="price-high">{t.priceHighLow}</option>
                      <option value="popular">{t.popular}</option>
                    </select>
                  </div>

                  {/* Reset button if filtered */}
                  {(selectedCategory !== 'all' || selectedArea !== 'all' || selectedDoc !== 'all' || maxPriceFilter || searchQuery) && (
                    <button
                      type="button"
                      onClick={handleResetAllFilters}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t.resetFilters}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Property Cards Grid */}
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-[#0B3D2E] border-t-[#C9A227] rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-600">Ana loda kayayyakin Kano...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                  <Building className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-800 font-['Poppins']">
                    {t.emptyTitle}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {t.emptySubtitle}
                  </p>
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="px-4 py-2 bg-[#0B3D2E] text-[#C9A227] text-xs font-bold rounded-lg transition-colors"
                  >
                    {t.resetFilters}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id || property.id}
                      property={property}
                      onSelect={handleSelectProperty}
                      onBookInspection={(p) => setInspectionTargetProperty(p)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* About & Trust Section */}
            <AboutSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={handleNavigateTab} />

      {/* Global Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBookInspection={(p) => {
          setSelectedProperty(null);
          setInspectionTargetProperty(p);
        }}
        onSelectSimilar={(p) => handleSelectProperty(p)}
        similarProperties={similarProps}
      />

      <InspectionModal
        property={inspectionTargetProperty}
        onClose={() => setInspectionTargetProperty(null)}
      />

      <AuthModal />

      {/* Floating Offline AI ChatBot */}
      <ChatBot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
