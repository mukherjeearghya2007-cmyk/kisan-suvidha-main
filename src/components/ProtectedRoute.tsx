import React, { useEffect } from 'react';
import { UserAccount } from '../types';
import { KisanLogo } from './KisanLogo';

interface ProtectedRouteProps {
  currentUser: UserAccount | null;
  isLoading: boolean;
  targetTabName: string;
  onRedirectToLogin: (intendedTab: string) => void;
  children: React.ReactNode;
}

/**
 * Reusable Route Guard: Checks actual authenticated session.
 * Displays a clean loading screen while session is initializing.
 * Redirects unauthenticated visitors to /login, preserving intended destination.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  currentUser,
  isLoading,
  targetTabName,
  onRedirectToLogin,
  children
}) => {
  useEffect(() => {
    if (!isLoading && !currentUser) {
      onRedirectToLogin(targetTabName);
    }
  }, [isLoading, currentUser, targetTabName, onRedirectToLogin]);

  if (isLoading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-8 space-y-4 font-sans">
        <div className="w-16 h-16 relative flex items-center justify-center">
          <KisanLogo className="w-14 h-14 animate-pulse drop-shadow-xs" />
          <div className="absolute inset-0 rounded-full border-2 border-emerald-600/30 border-t-emerald-700 animate-spin"></div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-[#14532D]">Verifying Farmer Session...</p>
          <p className="text-xs text-stone-500">Securing your personal agricultural records</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
