/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Language, FarmerProfile, UserAccount } from './types';
import { authService, cleanAnonymousProfile } from './utils/authService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { SchemeFinderPage } from './pages/SchemeFinderPage';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ApplicationGuidancePage } from './pages/ApplicationGuidancePage';
import { AlertsPage } from './pages/AlertsPage';
import { AboutPage } from './pages/AboutPage';
import { FarmerRegistrationPage } from './pages/FarmerRegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';

// Public routes accessible without farmer authentication
const PUBLIC_TABS = new Set(['home', 'login', 'signup']);

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // Authenticated User State (defaults to null for public visitors, restored on refresh)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return authService.getCurrentUser();
  });

  // Active Farmer Profile (dynamic per authenticated user, or neutral clean profile if guest)
  const [activeFarmer, setActiveFarmer] = useState<FarmerProfile>(() => {
    const user = authService.getCurrentUser();
    if (user) {
      return authService.getFarmerProfile(user.id);
    }
    return cleanAnonymousProfile;
  });

  // Selected scheme target for deep links
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | undefined>(undefined);

  // Intended destination memory for redirect-after-login
  const [intendedDestination, setIntendedDestination] = useState<{ tab: string; schemeId?: string } | null>(null);
  const [redirectNotice, setRedirectNotice] = useState<string>('');

  // Sync profile when user logs in or out
  useEffect(() => {
    if (currentUser) {
      const profile = authService.getFarmerProfile(currentUser.id);
      setActiveFarmer(profile);
      if (profile.preferredLanguage) {
        setLanguage(profile.preferredLanguage);
      }
    } else {
      setActiveFarmer(cleanAnonymousProfile);
    }
  }, [currentUser]);

  // Route protection redirect handler
  const handleRedirectToLogin = useCallback((targetTab: string, schemeId?: string) => {
    const featureLabels: Record<string, string> = {
      finder: 'Smart Scheme Finder',
      checker: 'Statutory Eligibility Checker',
      dashboard: 'Farmer Welfare Dashboard',
      ai: 'Multilingual AI Assistant',
      guidance: 'Application Document Roadmap',
      alerts: 'Verified Alerts & Deadlines',
      about: 'Verified Platform Records',
      registration: 'Farmer Profile Manager',
      settings: 'Account Settings'
    };

    const label = featureLabels[targetTab] || 'this protected agricultural service';
    setIntendedDestination({ tab: targetTab, schemeId });
    setRedirectNotice(`Please sign in to your farmer account to access the ${label}. New farmer? Register free in 1 minute.`);
    setCurrentTab('login');
    window.location.hash = '#login';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Safe navigation with route guard
  const navigateToTab = useCallback((tab: string, schemeId?: string) => {
    if (schemeId) {
      setSelectedSchemeId(schemeId);
    }

    // Check if the route requires farmer authentication
    if (!PUBLIC_TABS.has(tab) && !authService.getCurrentUser()) {
      handleRedirectToLogin(tab, schemeId);
      return;
    }

    // Clear notices if heading to public or authenticated page
    if (tab !== 'login') {
      setRedirectNotice('');
    }

    setCurrentTab(tab);
    window.location.hash = `#${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleRedirectToLogin]);

  // Handle URL hash synchronization and initial deep link protection
  useEffect(() => {
    const handleHashSync = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      if (!rawHash) return;

      const validTabs = [
        'home', 'finder', 'checker', 'dashboard', 'ai', 
        'guidance', 'alerts', 'about', 'registration', 
        'login', 'signup', 'settings'
      ];

      if (validTabs.includes(rawHash)) {
        if (!PUBLIC_TABS.has(rawHash) && !authService.getCurrentUser()) {
          handleRedirectToLogin(rawHash);
        } else {
          setCurrentTab(rawHash);
        }
      }
    };

    // Run on initial load
    handleHashSync();

    // Listen to browser forward/back buttons
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [handleRedirectToLogin]);

  // Authentication success (Login or Signup)
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    const profile = authService.getFarmerProfile(user.id);
    setActiveFarmer(profile);
    if (profile.preferredLanguage) {
      setLanguage(profile.preferredLanguage);
    }

    // Resume originally requested destination if one was intercepted
    if (intendedDestination && !PUBLIC_TABS.has(intendedDestination.tab)) {
      const dest = intendedDestination.tab;
      const schemeId = intendedDestination.schemeId;
      setIntendedDestination(null);
      setRedirectNotice('');
      if (schemeId) {
        setSelectedSchemeId(schemeId);
      }
      setCurrentTab(dest);
      window.location.hash = `#${dest}`;
    } else {
      setIntendedDestination(null);
      setRedirectNotice('');
      setCurrentTab('dashboard');
      window.location.hash = '#dashboard';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Registration success -> guide directly to Step-by-Step Farmer Profile Setup
  const handleRegisterSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    const profile = authService.getFarmerProfile(user.id);
    setActiveFarmer(profile);
    if (profile.preferredLanguage) {
      setLanguage(profile.preferredLanguage);
    }
    setIntendedDestination(null);
    setRedirectNotice('');
    setCurrentTab('registration');
    window.location.hash = '#registration';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Farmer logout
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveFarmer(cleanAnonymousProfile);
    setIntendedDestination(null);
    setRedirectNotice('');
    setCurrentTab('home');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update active farmer from registration or interactive checker
  const handleUpdateFarmer = (updated: FarmerProfile) => {
    setActiveFarmer(updated);
    if (currentUser) {
      authService.saveFarmerProfile({
        ...updated,
        userId: currentUser.id
      });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#F8F9F5] text-slate-800 antialiased font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        language={language}
        setLanguage={setLanguage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport with Route Protection */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        
        {/* PUBLIC ROUTE 1: Home Page */}
        {currentTab === 'home' && (
          <HomePage
            language={language}
            onNavigate={navigateToTab}
          />
        )}

        {/* PUBLIC ROUTE 2: Login Page */}
        {currentTab === 'login' && (
          <LoginPage
            language={language}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignUp={() => navigateToTab('signup')}
            onNavigateHome={() => navigateToTab('home')}
            redirectNotice={redirectNotice}
          />
        )}

        {/* PUBLIC ROUTE 3: Signup Page */}
        {currentTab === 'signup' && (
          <RegisterPage
            language={language}
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => navigateToTab('login')}
            onNavigateHome={() => navigateToTab('home')}
          />
        )}

        {/* PROTECTED ROUTE 1: Government Scheme Finder */}
        {currentTab === 'finder' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="finder"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <SchemeFinderPage
              language={language}
              activeFarmer={activeFarmer}
              onNavigateToChecker={(schemeId) => navigateToTab('checker', schemeId)}
              onNavigateToGuidance={(schemeId) => navigateToTab('guidance', schemeId)}
            />
          </ProtectedRoute>
        )}

        {/* PROTECTED ROUTE 2: Statutory Eligibility Checker */}
        {currentTab === 'checker' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="checker"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <EligibilityCheckerPage
              language={language}
              activeFarmer={activeFarmer}
              onUpdateFarmer={handleUpdateFarmer}
              initialSchemeId={selectedSchemeId}
              onNavigateToGuidance={(schemeId) => navigateToTab('guidance', schemeId)}
            />
          </ProtectedRoute>
        )}

        {/* PROTECTED ROUTE 3: Farmer Welfare Dashboard */}
        {currentTab === 'dashboard' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="dashboard"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <FarmerDashboardPage
              language={language}
              activeFarmer={activeFarmer}
              currentUser={currentUser}
              onNavigate={navigateToTab}
              onOpenEditProfile={() => navigateToTab('registration')}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        )}

        {/* PROTECTED ROUTE 4: AI Agricultural Assistant */}
        {currentTab === 'ai' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="ai"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <AIAssistantPage
              language={language}
              activeFarmer={activeFarmer}
              onNavigateToScheme={(schemeId) => navigateToTab('finder', schemeId)}
            />
          </ProtectedRoute>
        )}

        {/* PROTECTED ROUTE 5: Application Guidance & Document Roadmap */}
        {currentTab === 'guidance' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="guidance"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <ApplicationGuidancePage
              language={language}
              activeFarmer={activeFarmer}
              initialSchemeId={selectedSchemeId}
            />
          </ProtectedRoute>
        )}

        {/* PROTECTED ROUTE 6: Verified Alerts & Deadlines */}
        {currentTab === 'alerts' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="alerts"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <AlertsPage
              language={language}
              onNavigateToScheme={(schemeId) => navigateToTab('checker', schemeId)}
            />
          </ProtectedRoute>
        )}

        {/* PROTECTED ROUTE 7: About Us & Official Records */}
        {currentTab === 'about' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="about"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <AboutPage
              language={language}
            />
          </ProtectedRoute>
        )}

        {/* PROTECTED ROUTE 8: Farmer Registration / Farm Details Update */}
        {currentTab === 'registration' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="registration"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <FarmerRegistrationPage
              language={language}
              activeFarmer={activeFarmer}
              onSaveProfile={handleUpdateFarmer}
              onNavigateToDashboard={() => navigateToTab('dashboard')}
            />
          </ProtectedRoute>
        )}

        {/* PROTECTED ROUTE 9: Account Settings */}
        {currentTab === 'settings' && (
          <ProtectedRoute
            currentUser={currentUser}
            isLoading={isAuthLoading}
            targetTabName="settings"
            onRedirectToLogin={handleRedirectToLogin}
          >
            <AccountSettingsPage
              language={language}
              setLanguage={setLanguage}
              currentUser={currentUser || {
                id: 'farmer-guest',
                email: 'guest@kisan.in',
                fullName: 'Farmer',
                mobile: '',
                role: 'farmer',
                createdAt: new Date().toISOString(),
                state: activeFarmer.state,
                district: activeFarmer.district,
                village: activeFarmer.village,
                emailVerified: false
              }}
              farmerProfile={activeFarmer}
              onUpdateProfile={handleUpdateFarmer}
              onLogout={handleLogout}
              onNavigateToScheme={(schemeId) => navigateToTab('finder', schemeId)}
              onNavigateHome={() => navigateToTab('home')}
            />
          </ProtectedRoute>
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={navigateToTab}
      />

    </div>
  );
}
