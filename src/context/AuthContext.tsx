import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';
import { api } from '../api/client.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  favorites: string[];
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  toggleFavorite: (propertyId: string) => Promise<boolean>;
  isFavorited: (propertyId: string) => boolean;
  authModal: { isOpen: boolean; mode: 'signin' | 'signup' | 'admin' };
  openAuthModal: (mode?: 'signin' | 'signup' | 'admin') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('aa_token'));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' | 'admin' }>({
    isOpen: false,
    mode: 'signin',
  });

  // Verify stored token on init
  useEffect(() => {
    async function initUser() {
      const storedToken = localStorage.getItem('aa_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            setFavorites(res.user.favorites || []);
          } else {
            localStorage.removeItem('aa_token');
            setToken(null);
            setUser(null);
          }
        } catch (e) {
          localStorage.removeItem('aa_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    initUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('aa_token', newToken);
    setToken(newToken);
    setUser(newUser);
    setFavorites(newUser.favorites || []);
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  const logout = () => {
    localStorage.removeItem('aa_token');
    setToken(null);
    setUser(null);
    setFavorites([]);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    if (updated.favorites) {
      setFavorites(updated.favorites);
    }
  };

  const toggleFavorite = async (propertyId: string): Promise<boolean> => {
    if (!user) {
      openAuthModal('signin');
      return false;
    }

    try {
      const res = await api.toggleFavorite(propertyId);
      if (res.success) {
        const nextFavorites = res.favorites || [];
        setFavorites(nextFavorites);
        if (user) {
          setUser({ ...user, favorites: nextFavorites });
        }
        return res.isFavorited;
      }
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
    return false;
  };

  const isFavorited = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  const openAuthModal = (mode: 'signin' | 'signup' | 'admin' = 'signin') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        favorites,
        loading,
        login,
        logout,
        updateUser,
        toggleFavorite,
        isFavorited,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
