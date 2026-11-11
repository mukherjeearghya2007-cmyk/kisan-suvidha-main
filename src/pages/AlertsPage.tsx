import React, { useState, useMemo } from 'react';
import { Language, AlertItem } from '../types';
import { verifiedAlerts } from '../data/alerts';
import { translations } from '../translations';
import { 
  Bell, 
  Calendar, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Filter,
  FileCheck
} from 'lucide-react';

interface AlertsPageProps {
  language: Language;
  onNavigateToScheme: (schemeId: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  language,
  onNavigateToScheme
}) => {
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<'all' | 'deadline' | 'announcement'>('all');

  const filteredAlerts = useMemo(() => {
    if (activeFilter === 'all') return verifiedAlerts;
    if (activeFilter === 'deadline') return verifiedAlerts.filter(a => a.type === 'deadline');
    return verifiedAlerts.filter(a => a.type === 'announcement' || a.type === 'scheme_update');
  }, [activeFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#14532D] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.alerts.verifiedBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] tracking-tight">
            {t.alerts.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            {t.alerts.subtitle}
          </p>
        </div>

        {/* Segmented Filter Control */}
        <div className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-bold self-start md:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.alerts.filterAll}
          </button>
          <button
            onClick={() => setActiveFilter('deadline')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFilter === 'deadline' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.alerts.filterDeadlines}
          </button>
          <button
            onClick={() => setActiveFilter('announcement')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFilter === 'announcement' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.alerts.filterAnnouncements}
          </button>
        </div>
      </div>

      {/* Verified Gazette Notice Disclaimer */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-700 flex items-start gap-3">
        <Clock className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official Integrity Standard:</strong> Kisan Suvidha cross-references all deadlines with published Ministry gazettes and PIB press notices. We never publish speculative, expired or unverified application windows.
        </p>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-600 text-sm">
            {t.alerts.noAlerts}
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-[#14532D]/40 transition-all space-y-3"
            >
              {/* Meta Top */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {alert.deadline ? (
                    <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.alerts.deadlineLabel} {alert.deadline}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      Notification
                    </span>
                  )}
                  {alert.isUrgent && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px]">
                      {t.alerts.urgentTag}
                    </span>
                  )}
                </div>

                <span className="text-stone-400 font-mono text-[11px]">
                  {t.alerts.publishedOn} {alert.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {alert.title[language]}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {alert.description[language]}
              </p>

              {/* Official Reference & Action */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-stone-400 font-mono text-[11px] truncate max-w-md">
                  Ref: {alert.officialReference}
                </span>

                <div className="flex items-center gap-3">
                  {alert.schemeId && (
                    <button
                      onClick={() => onNavigateToScheme(alert.schemeId!)}
                      className="font-bold text-[#14532D] hover:underline cursor-pointer"
                    >
                      View Scheme Criteria
                    </button>
                  )}
                  <a
                    href={alert.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>{t.alerts.viewNotice}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
