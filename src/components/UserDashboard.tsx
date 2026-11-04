import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../api/client.ts';
import { Property, Inspection } from '../types.ts';
import { PropertyCard } from './PropertyCard.tsx';
import {
  Heart,
  Calendar,
  User as UserIcon,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageCircle,
} from 'lucide-react';

interface UserDashboardProps {
  initialTab?: 'favorites' | 'inspections' | 'profile';
  onSelectProperty: (property: Property) => void;
  onBookInspection: (property: Property) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  initialTab = 'favorites',
  onSelectProperty,
  onBookInspection,
}) => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'inspections' | 'profile'>(initialTab);

  // Favorites state
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  // Inspections state
  const [myInspections, setMyInspections] = useState<Inspection[]>([]);
  const [loadingInspections, setLoadingInspections] = useState(false);

  // Profile Form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || 'Kano, Nigeria');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    } else if (activeTab === 'inspections') {
      fetchInspections();
    }
  }, [activeTab]);

  const fetchFavorites = async () => {
    setLoadingFavs(true);
    try {
      const res = await api.getFavorites();
      if (res.success) {
        setFavoriteProperties(res.favorites || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFavs(false);
    }
  };

  const fetchInspections = async () => {
    setLoadingInspections(true);
    try {
      const res = await api.getMyInspections();
      if (res.success) {
        setMyInspections(res.inspections || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInspections(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setSavingProfile(true);

    try {
      const res = await api.updateProfile({ fullName, phone, location });
      if (res.success) {
        setProfileSuccess('An sabunta bayananka cikin nasara!');
        updateUser(res.user);
      }
    } catch (err: any) {
      setProfileError(err.message || 'Kuskure ya faru');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* User Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0B3D2E] text-[#C9A227] flex items-center justify-center font-bold text-xl border-2 border-[#C9A227] shadow-sm">
            {user?.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-['Poppins']">
              Barka da zuwa, {user?.fullName}!
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>{user?.phone}</span>
              <span aria-hidden="true">·</span>
              <span>{user?.email}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#0B3D2E] font-medium">{user?.location || 'Kano, Nigeria'}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span>Abubuwan da nake so</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inspections')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'inspections'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#0B3D2E]" />
            <span>Duban Gida</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
              Jerin Kayan da ka Ajiye (Saved Favorites)
            </h3>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {favoriteProperties.length} kaya
            </span>
          </div>

          {loadingFavs ? (
            <div className="py-12 text-center text-xs text-slate-500">Ana loda kayan...</div>
          ) : favoriteProperties.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 font-['Poppins']">
                Baka ajiye kowane kaya ba tukuna
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Idan kana duba gidaje ko filaye, danna alamar ❤️ domin ajiye su anan don duba su a kowane lokaci.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((p) => (
                <PropertyCard
                  key={p._id || p.id}
                  property={p}
                  onSelect={onSelectProperty}
                  onBookInspection={onBookInspection}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Inspections */}
      {activeTab === 'inspections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
              Bukatar Duban Gida (My Inspections)
            </h3>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {myInspections.length} bookings
            </span>
          </div>

          {loadingInspections ? (
            <div className="py-12 text-center text-xs text-slate-500">Ana duba bookings...</div>
          ) : myInspections.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 font-['Poppins']">
                Baka yi booking na duba gida ba tukuna
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Zaka iya danna "FREE Inspection" a kan ko wani gida domin Malam Adam ya raka ka duba shi kyauta.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myInspections.map((insp) => (
                <div
                  key={insp._id || insp.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0B3D2E]">
                        {insp.propertyTitle}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          insp.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : insp.status === 'Done'
                            ? 'bg-blue-100 text-blue-800'
                            : insp.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {insp.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(insp.date).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{insp.time}</span>
                      </div>
                    </div>

                    {insp.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2">
                        {insp.notes}
                      </p>
                    )}
                  </div>

                  <a
                    href="https://wa.me/2349042782681"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#0B3D2E] hover:bg-[#07261C] text-[#C9A227] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-[#C9A227] text-[#0B3D2E]" />
                    <span>Yi Magana da Adam</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Edit */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-slate-900 font-['Poppins'] mb-1">
            Bayanai na (Edit Profile)
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Sabunta sunanka, lambar wayar WhatsApp da unguwarka a Kano.
          </p>

          {profileSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cikakken Suna *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lambar Waya (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unguwarka a Kano (Location)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Misali: Sabon Gari, Kano"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 px-4 bg-[#0B3D2E] hover:bg-[#07261C] text-[#C9A227] font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              {savingProfile ? 'Ana ajiye bayanan...' : 'AJIYE SABABBIN BAYANAI'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
