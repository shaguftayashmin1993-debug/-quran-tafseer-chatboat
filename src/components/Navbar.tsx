import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, MessageSquare, BookMarked, Search, ExternalLink, Globe, ChevronDown, Check, Database } from 'lucide-react';
import { ARCHIVE_BASE_URL } from '../data/tafheemVolume1Data';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TranslationStrings } from '../data/translations';

interface NavbarProps {
  activeTab: 'chat' | 'explorer' | 'viewer' | 'tafseer' | 'bookmarks';
  setActiveTab: (tab: 'chat' | 'explorer' | 'viewer' | 'tafseer' | 'bookmarks') => void;
  bookmarksCount: number;
  fontSize: 'normal' | 'large';
  setFontSize: (size: 'normal' | 'large') => void;
  onOpenQuickScan: (page: number) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationStrings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bookmarksCount,
  fontSize,
  setFontSize,
  language,
  setLanguage,
  t,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const currentLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/60 text-amber-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Scholarly Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-inner shadow-amber-900/40 border border-amber-400/40">
              <BookOpen className="w-6 h-6 text-emerald-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base sm:text-lg tracking-wide text-amber-200">
                  {t.appTitle}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-amber-300 border border-emerald-700/80">
                  {t.volumeBadge}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-emerald-300/80">
                <span className="font-arabic text-sm text-amber-200/90" dir="rtl">تفهيم القرآن</span>
                <span>•</span>
                <span>{t.appSubtitle}</span>
                <span>•</span>
                <span className="hidden sm:inline">pp. 1–480</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-emerald-800/90 text-amber-100 shadow-sm border border-emerald-600/50'
                  : 'text-emerald-200/80 hover:text-amber-100 hover:bg-emerald-900/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">{t.tabChat}</span>
              <span className="md:hidden">Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'explorer'
                  ? 'bg-emerald-800/90 text-amber-100 shadow-sm border border-emerald-600/50'
                  : 'text-emerald-200/80 hover:text-amber-100 hover:bg-emerald-900/60'
              }`}
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">{t.tabExplorer}</span>
              <span className="md:hidden">Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('viewer')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'viewer'
                  ? 'bg-emerald-800/90 text-amber-100 shadow-sm border border-emerald-600/50'
                  : 'text-emerald-200/80 hover:text-amber-100 hover:bg-emerald-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">{t.tabViewer}</span>
              <span className="md:hidden">Reader</span>
            </button>

            <button
              onClick={() => setActiveTab('tafseer')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'tafseer'
                  ? 'bg-emerald-800/90 text-amber-100 shadow-sm border border-emerald-600/50'
                  : 'text-emerald-200/80 hover:text-amber-100 hover:bg-emerald-900/60'
              }`}
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">{t.tabTafseer}</span>
              <span className="md:hidden">Tafseer</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'bookmarks'
                  ? 'bg-emerald-800/90 text-amber-100 shadow-sm border border-emerald-600/50'
                  : 'text-emerald-200/80 hover:text-amber-100 hover:bg-emerald-900/60'
              }`}
            >
              <BookMarked className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">{t.tabBookmarks}</span>
              <span className="md:hidden">Saved</span>
              {bookmarksCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-emerald-950 text-xs font-bold rounded-full">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Toolbar: Multi-Language Selector & Reading Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700/80 text-amber-200 transition-all shadow-xs"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs sm:text-sm">{currentLangConfig.flag}</span>
                <span className="hidden sm:inline font-medium">{currentLangConfig.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-emerald-300" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-amber-900/20 py-1.5 z-50 text-stone-900 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Choose Language / भाषा चुनें
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                        language === lang.code
                          ? 'bg-emerald-50 text-emerald-950 font-bold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{lang.flag}</span>
                        <div>
                          <span className="block text-xs font-semibold">{lang.nativeName}</span>
                          <span className="block text-[10px] text-stone-400 font-normal">{lang.name}</span>
                        </div>
                      </div>
                      {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Size Adjuster */}
            <div className="hidden lg:flex items-center bg-emerald-900/80 rounded-lg p-1 border border-emerald-800">
              <button
                onClick={() => setFontSize('normal')}
                title="Normal text size"
                className={`px-2 py-1 text-xs rounded font-medium ${
                  fontSize === 'normal' ? 'bg-emerald-800 text-amber-200' : 'text-emerald-300 hover:text-amber-100'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                title="Comfortable reading font size"
                className={`px-2 py-1 text-sm rounded font-bold ${
                  fontSize === 'large' ? 'bg-emerald-800 text-amber-200' : 'text-emerald-300 hover:text-amber-100'
                }`}
              >
                A+
              </button>
            </div>

            {/* Archive.org External Link */}
            <a
              href={ARCHIVE_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300/90 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700/60 transition-colors"
              title="Open complete Volume 1 on Archive.org"
            >
              <span>Archive.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
