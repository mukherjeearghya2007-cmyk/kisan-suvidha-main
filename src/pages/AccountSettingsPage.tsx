import React, { useState } from 'react';
import { UserAccount, FarmerProfile, Language } from '../types';
import { translations } from '../translations';
import { authService } from '../utils/authService';
import { schemeService } from '../utils/schemeService';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  KeyRound, 
  Bookmark, 
  Trash2, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Globe, 
  Calendar,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  X
} from 'lucide-react';

interface AccountSettingsPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserAccount;
  farmerProfile: FarmerProfile;
  onUpdateProfile: (profile: FarmerProfile) => void;
  onLogout: () => void;
  onNavigateToScheme: (schemeId: string) => void;
  onNavigateHome: () => void;
}

export const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({
  language,
  setLanguage,
  currentUser,
  farmerProfile,
  onUpdateProfile,
  onLogout,
  onNavigateToScheme,
  onNavigateHome
}) => {
  const t = translations[language];

  // Tab: 'profile' | 'security' | 'saved' | 'danger'
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'saved' | 'danger'>('profile');

  // Profile fields
  const [name, setName] = useState(farmerProfile.name);
  const [mobile, setMobile] = useState(currentUser.mobile);
  const [state, setState] = useState(farmerProfile.state);
  const [district, setDistrict] = useState(farmerProfile.district);
  const [village, setVillage] = useState(farmerProfile.village);

  // Security password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const [saveSuccess, setSaveSuccess] = useState('');

  // Saved schemes
  const allSchemes = schemeService.getAllSchemes();
  const savedSchemeList = allSchemes.filter(s => (farmerProfile.savedSchemeIds || []).includes(s.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FarmerProfile = {
      ...farmerProfile,
      name,
      state,
      district,
      village
    };
    onUpdateProfile(updated);
    setSaveSuccess('Profile settings updated successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New password and confirmation do not match.');
      return;
    }

    const res = authService.resetPassword(currentUser.email, newPass);
    if (res.success) {
      setPassSuccess('Password changed successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassSuccess(''), 3000);
    } else {
      setPassError(res.error || 'Failed to update password.');
    }
  };

  const [deleteError, setDeleteError] = useState('');

  const handleConfirmDelete = () => {
    if (deleteConfirmationText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }
    authService.deleteAccount(currentUser.id);
    onLogout();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5 text-emerald-700" />
            <span>Farmer Account & Privacy Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
            {t.nav.accountSettings}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Manage your personal profile, credentials, saved schemes, and privacy options.
          </p>
        </div>

        {/* User Card */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-bold text-sm">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="text-xs pr-2">
            <p className="font-bold text-stone-900">{currentUser.fullName}</p>
            <p className="text-stone-500 font-mono text-[11px]">{currentUser.email}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
              Verified Farmer Account
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile' ? 'bg-[#14532D] text-white shadow-2xs' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal & Location Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'security' ? 'bg-[#14532D] text-white shadow-2xs' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Password & Security</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'saved' ? 'bg-[#14532D] text-white shadow-2xs' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span>Saved Schemes</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                {savedSchemeList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'danger' ? 'bg-red-600 text-white shadow-2xs' : 'text-red-700 hover:bg-red-50'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>

          {/* Quick Account Meta */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
            <p className="flex items-center justify-between">
              <span className="text-stone-400">Account ID:</span>
              <span className="font-mono text-[11px] font-bold text-stone-800">{currentUser.id}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-stone-400">Created On:</span>
              <span className="font-medium text-stone-800">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </p>
            <div className="pt-2 border-t border-stone-200">
              <button
                onClick={onLogout}
                className="w-full py-2 px-3 text-xs font-bold text-stone-700 bg-white hover:bg-stone-100 rounded-xl border border-stone-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.nav.logout}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-8">
          
          {/* TAB 1: PERSONAL & LOCATION PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h2 className="text-base font-bold text-stone-900">Personal & Geographical Details</h2>
                <p className="text-xs text-stone-500">Your profile details determine scheme eligibility accuracy.</p>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      disabled
                      value={mobile}
                      className="w-full py-2 px-3 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 bg-stone-50/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-stone-700 mb-1">Village / Gram Panchayat</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 bg-stone-50/50"
                    />
                  </div>

                  {/* Language Selector in Settings */}
                  <div className="sm:col-span-2 pt-2">
                    <label className="block font-bold text-stone-700 mb-1">Preferred Language</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          language === 'en' ? 'bg-[#14532D] text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('hi')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          language === 'hi' ? 'bg-[#14532D] text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        हिंदी (Hindi)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('mr')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          language === 'mr' ? 'bg-[#14532D] text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        मराठी (Marathi)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0f4022] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
              <div className="pb-3 border-b border-stone-100">
                <h2 className="text-base font-bold text-stone-900">Change Account Password</h2>
                <p className="text-xs text-stone-500">Ensure your account remains safe with a strong password.</p>
              </div>

              {passError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">New Password (Min. 6 chars)</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50/50"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#14532D] hover:bg-[#0f4022] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SAVED SCHEMES */}
          {activeTab === 'saved' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-stone-900">Your Bookmarked Schemes</h2>
                  <p className="text-xs text-stone-500">Government programs you have saved for application preparation.</p>
                </div>
                <span className="text-xs font-bold text-[#14532D] bg-[#F5F2E8] px-3 py-1 rounded-full">
                  {savedSchemeList.length} Saved
                </span>
              </div>

              {savedSchemeList.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-500 space-y-2">
                  <Bookmark className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="font-semibold text-stone-700">No saved schemes yet.</p>
                  <p>Browse the Scheme Finder and click the bookmark icon to save schemes here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedSchemeList.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-[#14532D]/40 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#65A30D]">
                          {scheme.category}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900">
                          {scheme.localNames[language] || scheme.name}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-1">{scheme.benefitsAmount}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onNavigateToScheme(scheme.id)}
                          className="px-3 py-1.5 text-xs font-bold text-[#14532D] bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DANGER ZONE (DELETE ACCOUNT) */}
          {activeTab === 'danger' && (
            <div className="bg-white rounded-3xl border border-red-200 p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
              <div className="pb-3 border-b border-red-100">
                <h2 className="text-base font-bold text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Delete Farmer Account</span>
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Permanently erase your account, farm profile, saved schemes, and document drafts. This action cannot be reversed.
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 leading-relaxed">
                <p className="font-bold mb-1">Warning:</p>
                <p>Deleting your account will delete all stored survey numbers, landholding records, and offline application checklists associated with {currentUser.email}.</p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Request Account Deletion</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* CONFIRMATION MODAL FOR ACCOUNT DELETION */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Confirm Account Deletion</span>
              </h3>
              <button onClick={() => setDeleteModalOpen(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-stone-700 leading-relaxed">
              To confirm permanent deletion of account <strong className="font-mono text-stone-900">{currentUser.email}</strong>, please type <strong className="text-red-700">DELETE</strong> in the box below:
            </p>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full py-2.5 px-3 rounded-xl border border-red-300 font-mono text-xs focus:outline-hidden focus:border-red-600"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteConfirmationText !== 'DELETE'}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold rounded-xl cursor-pointer transition-colors"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
