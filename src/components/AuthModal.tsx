import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../api/client.ts';
import { BrandLogo } from './BrandLogo.tsx';
import {
  X,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModal, closeAuthModal, login } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>(authModal.mode || 'signin');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);

  if (!authModal.isOpen) return null;

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier || !password) {
      setErrorMessage('Shigar da Email ko Lambar Waya da Password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.signIn({ identifier, password });
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          login(res.token, res.user);
        }, 300);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Email ko password ba daidai ba - Ka sake gwadawa');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !phone || !email || !password) {
      setErrorMessage('Da fatan a cika dukkan bayanan da ake bukata');
      return;
    }

    if (phone.replace(/[\s\-\+]/g, '').length < 11) {
      setErrorMessage('Lambar waya ba daidai ba ce. Lambar Najeriya mai lambobi 11 ake bukata (Misali: 08012345678)');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password ya zama akalla haruffa 6');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password biyun ba su zo daya ba (Passwords do not match)');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Dole ne ka yarda da ka\'idojin A.A Properties');
      return;
    }

    setLoading(true);
    try {
      const res = await api.signUp({ fullName, phone, email, password });
      if (res.success) {
        setSuccessMessage(`Barka da zuwa ${res.user.fullName}!`);
        setTimeout(() => {
          login(res.token, res.user);
        }, 400);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Kuskure ya faru wajen Sign Up');
    } finally {
      setLoading(false);
    }
  };

  // Admin Login Handler (Adam Auwal Adam)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    setLoading(true);
    try {
      const res = await api.adminLogin({
        whatsapp: phone || '09042782681',
        pin: adminPin || password,
      });

      if (res.success) {
        setSuccessMessage('Barka da zuwa Adam! Shugaban A.A Properties Kano.');
        setTimeout(() => {
          login(res.token, res.user);
        }, 400);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ba kai ba ne - Kira Adam 09042782681');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Autofills
  const autofillDemoUser = () => {
    setMode('signin');
    setIdentifier('demo@gmail.com');
    setPassword('123456');
    setErrorMessage('');
  };

  const autofillAdmin = () => {
    setMode('admin');
    setPhone('09042782681');
    setAdminPin('0904');
    setPassword('0904');
    setErrorMessage('');
  };

  // Forgot password flow
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!forgotPhone) {
      setErrorMessage('Shigar da lambar waya');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(forgotPhone);
      setSuccessMessage(res.message);
      setResetStep(2);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!resetCode || !newPassword) {
      setErrorMessage('Cika dukkan bayanan');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword({
        phone: forgotPhone,
        code: resetCode,
        newPassword,
      });
      setSuccessMessage(res.message);
      setTimeout(() => {
        setForgotPasswordOpen(false);
        setMode('signin');
        setIdentifier(forgotPhone);
        setPassword(newPassword);
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 grid grid-cols-1 md:grid-cols-12 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          aria-label="Rufe (Close)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Deep Emerald Branding Showcase */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#0B3D2E] to-[#07261C] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:20px_20px]"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            <BrandLogo size="md" isLight={true} />

            <div className="pt-4 space-y-3">
              <h2 className="text-xl font-bold font-['Poppins'] text-white leading-snug">
                Barka da zuwa A.A Properties Kano
              </h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Nemi Gida, Fili, Shago da Ofisoshi a duk fadin jihar Kano cikin sauki da gaskiya ba tare da an damfare ka ba.
              </p>
            </div>

            {/* Kano Trust List */}
            <div className="space-y-2.5 text-xs text-emerald-100/90 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>FREE Physical Inspection a Ko'ina</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>100% Takardun Halal (C of O / R of O)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>Adam Auwal Adam: 09042782681</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Autofill Box */}
          <div className="relative z-10 pt-6 mt-6 border-t border-emerald-900/80">
            <p className="text-[11px] font-semibold text-[#C9A227] uppercase tracking-wider mb-2">
              Don Gwada Shafin (Quick Demo Login):
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <button
                type="button"
                onClick={autofillDemoUser}
                className="w-full text-left p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 flex items-center justify-between border border-emerald-700/50 transition-colors"
              >
                <div>
                  <span className="font-bold text-white">Musa (Customer)</span>
                  <p className="text-[10px] text-emerald-300">demo@gmail.com / 123456</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
              </button>

              <button
                type="button"
                onClick={autofillAdmin}
                className="w-full text-left p-2 rounded-lg bg-[#C9A227]/20 hover:bg-[#C9A227]/30 text-emerald-100 flex items-center justify-between border border-[#C9A227]/40 transition-colors"
              >
                <div>
                  <span className="font-bold text-[#C9A227]">Adam (CEO & Admin)</span>
                  <p className="text-[10px] text-emerald-200">09042782681 / PIN: 0904</p>
                </div>
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: White Interactive Forms */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          {/* Header Switcher */}
          {!forgotPasswordOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'signup'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign Up Kyauta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('admin');
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'admin'
                      ? 'bg-[#0B3D2E] text-[#C9A227] shadow-sm'
                      : 'text-slate-600 hover:text-[#0B3D2E]'
                  }`}
                >
                  Admin Only
                </button>
              </div>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. FORGOT PASSWORD VIEW */}
          {forgotPasswordOpen ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold font-['Poppins'] text-slate-900">
                  Sake Saitin Password (Reset Password)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Shigar da lambar wayarka domin karbar lambar tabbatarwa (OTP).
                </p>
              </div>

              {resetStep === 1 ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lambar Waya (WhatsApp / Phone) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        placeholder="Misali: 08012345678"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#0B3D2E] hover:bg-[#07261C] text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    {loading ? 'Ana aikawa...' : 'AIKA LAMBAR OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="w-full text-center text-xs text-slate-600 hover:text-slate-900"
                  >
                    Koma baya zuwa Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lambar OTP da aka aiko *
                    </label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Shigar da lambar OTP"
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sabuwar Password *
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Akalla haruffa 6"
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#C9A227] hover:bg-[#B58F1D] text-[#0B3D2E] font-bold text-xs rounded-lg transition-colors"
                  >
                    {loading ? 'Ana sabuntawa...' : 'CANZA PASSWORD'}
                  </button>
                </form>
              )}
            </div>
          ) : mode === 'signin' ? (
            /* 2. SIGN IN VIEW */
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold font-['Poppins'] text-slate-900">
                  Barka da dawowa!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ka shiga - Ka ci gaba da neman gida, fili ko shago a Kano.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email ko WhatsApp Number *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="musa@gmail.com ko 08012345678"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs text-[#0B3D2E] hover:underline font-medium"
                    >
                      Ka manta Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#0B3D2E] rounded border-slate-300 focus:ring-[#0B3D2E]"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-xs text-slate-600">
                    Ka tuna ni (Remember me)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#0B3D2E] hover:bg-[#07261C] text-[#C9A227] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {loading ? 'Ana shiga...' : 'SHIGA - SIGN IN'}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-600">
                  Baka da account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage('');
                    }}
                    className="font-bold text-[#0B3D2E] hover:underline"
                  >
                    Yi Sign Up - Kyauta!
                  </button>
                </p>
              </div>
            </div>
          ) : mode === 'signup' ? (
            /* 3. SIGN UP VIEW */
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold font-['Poppins'] text-slate-900">
                  Yi Account - Kyauta!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ka yi Sign Up - Ka ajiye kaya da kake so - Ka yi booking na FREE Inspection.
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cikakken Suna (Full Name) *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Musa Abdullahi"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Phone *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08012345678"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="musa@gmail.com"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password (min 6) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tabbatar da Password *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreedTerms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="h-4 w-4 text-[#0B3D2E] rounded border-slate-300 focus:ring-[#0B3D2E]"
                  />
                  <label htmlFor="agreedTerms" className="ml-2 block text-xs text-slate-600">
                    Na yarda da Ka'idojin A.A Properties & Privacy Policy
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#C9A227] hover:bg-[#B58F1D] text-[#0B3D2E] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {loading ? 'Ana bude account...' : 'YI SIGN UP - KYAUTA'}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-600">
                  Kana da account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage('');
                    }}
                    className="font-bold text-[#0B3D2E] hover:underline"
                  >
                    Ka yi Sign In anan
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* 4. ADMIN LOGIN VIEW */
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 text-[#0B3D2E] font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
                  <span>Kofar Shiga ta Admin - Adam Auwal Adam Kadai</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Wannan bangaren na mai kamfani ne kawai domin dora kaya, canza farashi da duba bookings.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lambar WhatsApp ta Admin *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={phone || '09042782681'}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09042782681"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin PIN ko Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={adminPin || password}
                      onChange={(e) => {
                        setAdminPin(e.target.value);
                        setPassword(e.target.value);
                      }}
                      placeholder="Default PIN: 0904"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#0B3D2E] hover:bg-[#07261C] text-[#C9A227] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? 'Ana tantancewa...' : 'SHIGA DASHBOARD NA ADAM'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
