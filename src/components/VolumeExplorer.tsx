import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, Sparkles, Filter } from 'lucide-react';
import { getScanUrl } from '../data/tafheemVolume1Data';
import { getLocalizedPages, getLocalizedSurahs } from '../data/localizedVolume1';
import { SupportedLanguage, TranslationStrings, getPagePrompt } from '../data/translations';

interface VolumeExplorerProps {
  onInspectPage: (pageNumber: number) => void;
  onAskAboutPage: (pageNumber: number, prompt: string) => void;
  language: SupportedLanguage;
  t: TranslationStrings;
}

export const VolumeExplorer: React.FC<VolumeExplorerProps> = ({
  onInspectPage,
  onAskAboutPage,
  language,
  t,
}) => {
  const [selectedSurah, setSelectedSurah] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const isRTL = language === 'ur';
  const surahOverviews = getLocalizedSurahs(language);
  const localizedPages = getLocalizedPages(language);

  // Filter logic across localized fields as well as English/Arabic
  const filteredPages = localizedPages.filter((item) => {
    // Surah filter
    if (selectedSurah !== 'all') {
      if (selectedSurah === 0 && item.surahNumber !== undefined) return false;
      if (selectedSurah !== 0 && item.surahNumber !== selectedSurah) return false;
    }

    // Theme filter
    if (selectedTheme && !item.keyThemes.some((th) => th.toLowerCase() === selectedTheme.toLowerCase())) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.sectionTitle.toLowerCase().includes(q);
      const matchesSummary = item.summary.toLowerCase().includes(q);
      const matchesExcerpt = item.tafseerExcerpt.toLowerCase().includes(q);
      const matchesSurah = item.surahName?.toLowerCase().includes(q);
      const matchesPage = String(item.page).includes(q);
      const matchesTheme = item.keyThemes.some((th) => th.toLowerCase().includes(q));

      return matchesTitle || matchesSummary || matchesExcerpt || matchesSurah || matchesPage || matchesTheme;
    }

    return true;
  });

  const allThemes = Array.from(
    new Set(localizedPages.flatMap((p) => p.keyThemes))
  ).slice(0, 12);

  // Localized title & header strings
  const explorerHeaders = {
    en: {
      badge: "Thematic & Page Index",
      title: "Explore Tafheem-ul-Quran (Volume 1)",
      desc: "Navigate the 480 pages of Volume 1 covering the introductory principles, Surah Al-Fatihah, Surah Al-Baqarah, and Surah Ali 'Imran with direct scans and exegesis breakdowns.",
      themes: "Key Themes:",
      showing: "Showing",
      sections: "indexed Volume 1 sections",
      hint: "Click 'Inspect Page' for full details or 'Ask AI' to initiate study",
      intro: "Intro",
      surah: "Surah",
      pagesLabel: "Pages",
      versesLabel: "verses",
      pagesCountLabel: "pages",
    },
    hi: {
      badge: "विषयगत एवं पृष्ठ अनुक्रमणिका",
      title: "तफ़ीम-उल-क़ुरआन (खंड 1) अन्वेषक",
      desc: "खंड 1 के 480 पृष्ठों का अध्ययन करें: क़ुरआन के बुनियादी सिद्धांत, सूरह अल-फातिहा, सूरह अल-बक़रह और सूरह आले इमरान के मूल स्कैन व तफ़सीर व्याख्या।",
      themes: "प्रमुख विषय:",
      showing: "प्रदर्शित",
      sections: "सूचीबद्ध खंड 1 तफ़सीर भाग",
      hint: "विस्तृत अध्ययन के लिए 'पृष्ठ देखें' या AI प्रश्न पूछने के लिए 'AI से पूछें' पर क्लिक करें",
      intro: "मुक़द्दमा",
      surah: "सूरह",
      pagesLabel: "पृष्ठ",
      versesLabel: "आयतें",
      pagesCountLabel: "पृष्ठ",
    },
    ur: {
      badge: "موضوعاتی و تفسیری اشاریہ",
      title: "تفہیم القرآن (جلد اول) تفسیری جائزہ",
      desc: "جلد اول کے 480 صفحات کا جامع جائزہ: مقدمہ، سورۃ الفاتحہ، سورۃ البقرۃ اور سورۃ آل عمران کے اسکین شدہ صفحات اور مستند تشریحات۔",
      themes: "اہم موضوعات:",
      showing: "ظاہر کردہ",
      sections: "جلد اول کے تفسیری مقامات",
      hint: "تفصیلات کے لیے 'صفحہ دیکھیں' یا سوال پوچھنے کے لیے چمکتے ستارے پر کلک کریں",
      intro: "مقدمہ",
      surah: "سورۃ",
      pagesLabel: "صفحات",
      versesLabel: "آیات",
      pagesCountLabel: "صفحات",
    },
    bn: {
      badge: "বিষয়ভিত্তিক ও পৃষ্ঠা সূচি",
      title: "তাফহীমুল কুরআন (খণ্ড ১) অন্বেষণ",
      desc: "খণ্ড ১-এর ৪৮০ পৃষ্ঠার বিস্তারিত অধ্যয়ন: কুরআন অধ্যয়নের মূলনীতি, সূরা আল-ফাতিহা, সূরা আল-বাকারা ও সূরা আলে ইমরানের স্ক্যান ও তাফসীর।",
      themes: "মূল বিষয়সমূহ:",
      showing: "প্রদর্শিত হচ্ছে",
      sections: "টি খণ্ড ১ সূচিভুক্ত অনুচ্ছেদ",
      hint: "বিস্তারিত তথ্যের জন্য 'পৃষ্ঠা দেখুন' বা প্রশ্ন করতে AI বাটনে ক্লিক করুন",
      intro: "ভূমিকা",
      surah: "সূরা",
      pagesLabel: "পৃষ্ঠা",
      versesLabel: "আয়াত",
      pagesCountLabel: "পৃষ্ঠা",
    },
    ta: {
      badge: "பொருள்வாரியான பக்க அட்டவணை",
      title: "தஃப்ஹீமுல் குர்ஆன் (பாகம் 1) ஆய்வு",
      desc: "பாகம் 1 இன் 480 பக்கங்களை ஆராயுங்கள்: ஆரம்பக் கொள்கைகள், சூரா அல்-பாத்திஹா, சூரா அல்-பகரா மற்றும் சூரா ஆல இம்ரான் விரிவுரைகள்.",
      themes: "முக்கிய தலைப்புகள்:",
      showing: "காட்டப்படும்",
      sections: "பாகம் 1 இன் பகுதிகள்",
      hint: "முழு விவரங்களுக்கு 'பக்கம் காண்க' அல்லது கேள்வி கேட்க AI ஐ அழுத்தவும்",
      intro: "முகத்திமா",
      surah: "சூரா",
      pagesLabel: "பக்கங்கள்",
      versesLabel: "வசனங்கள்",
      pagesCountLabel: "பக்கங்கள்",
    },
    ml: {
      badge: "വിഷയ സൂചികയും പേജ് സൂചികയും",
      title: "തഫ്ഹീമുൽ ഖുർആൻ (വാല്യം 1) പര്യവേക്ഷണം",
      desc: "വാല്യം 1-ന്റെ 480 പേജുകളിലൂടെ സഞ്ചരിക്കുക: മുഖദ്ദിമ, സൂറത്തുൽ ഫാത്തിഹ, സൂറത്തുൽ ബഖറ, സൂറത്തു ആലു ഇംറാൻ വ്യാഖ്യാനങ്ങൾ.",
      themes: "പ്രധാന വിഷയങ്ങൾ:",
      showing: "പ്രദർശിപ്പിക്കുന്നത്",
      sections: "വാല്യം 1 ഭാഗങ്ങൾ",
      hint: "വിശദാംശങ്ങൾക്ക് 'പേജ് കാണുക' അല്ലെങ്കിൽ സംശയങ്ങൾ ചോദിക്കാൻ AI തിരഞ്ഞെടുക്കുക",
      intro: "മുഖദ്ദിമ",
      surah: "സൂറത്ത്",
      pagesLabel: "പേജുകൾ",
      versesLabel: "സൂക്തങ്ങൾ",
      pagesCountLabel: "പേജുകൾ",
    },
    kn: {
      badge: "ವಿಷಯವಾರು ಮತ್ತು ಪುಟ ಸೂಚಿಕೆ",
      title: "ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್ (ಸಂಪುಟ 1) ಅನ್ವೇಷಣೆ",
      desc: "ಸಂಪುಟ 1 ರ 480 ಪುಟಗಳ ಸಮಗ್ರ ಅಧ್ಯಯನ: ಮುನ್ನುಡಿ, ಸೂರಹ್ ಅಲ್-ಫಾತಿಹಾ, ಸೂರಹ್ ಅಲ್-ಬಖರಹ್ ಮತ್ತು ಸೂರಹ್ ಆಲಿ ಇಮ್ರಾನ್ ವಿವರಣೆಗಳು.",
      themes: "ಪ್ರಮುಖ ವಿಷಯಗಳು:",
      showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
      sections: "ಸಂಪುಟ 1 ರ ಭಾಗಗಳು",
      hint: "ಸಂಪೂರ್ಣ ವಿವರಗಳಿಗಾಗಿ 'ಪುಟ ವೀಕ್ಷಿಸಿ' ಅಥವಾ ಪ್ರಶ್ನೆ ಕೇಳಲು AI ಬಟನ್ ಒತ್ತಿ",
      intro: "ಮುಕದ್ದಿಮಾ",
      surah: "ಸೂರಹ್",
      pagesLabel: "ಪುಟಗಳು",
      versesLabel: "ಆಯತ್‌ಗಳು",
      pagesCountLabel: "ಪುಟಗಳು",
    },
  }[language] || {
    badge: "Thematic & Page Index",
    title: "Explore Tafheem-ul-Quran (Volume 1)",
    desc: "Navigate the 480 pages of Volume 1 covering the introductory principles, Surah Al-Fatihah, Surah Al-Baqarah, and Surah Ali 'Imran with direct scans and exegesis breakdowns.",
    themes: "Themes:",
    showing: "Showing",
    sections: "indexed Volume 1 sections",
    hint: "Click 'Inspect Page' for full details or 'Ask AI' to initiate study",
    intro: "Intro",
    surah: "Surah",
    pagesLabel: "Pages",
    versesLabel: "verses",
    pagesCountLabel: "pages",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          {explorerHeaders.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-emerald-950">
          {explorerHeaders.title}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {explorerHeaders.desc}
        </p>
      </div>

      {/* Surah Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {surahOverviews.map((surah) => {
          const isSelected = selectedSurah === surah.number;
          return (
            <div
              key={surah.number}
              onClick={() => {
                setSelectedSurah(isSelected ? 'all' : surah.number);
                setSelectedTheme(null);
              }}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-emerald-950 text-amber-50 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-white hover:bg-emerald-50/50 text-stone-900 border-amber-900/15 shadow-xs hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-amber-500 text-emerald-950' : 'bg-amber-100 text-amber-900'
                }`}>
                  {surah.number === 0 ? explorerHeaders.intro : `${explorerHeaders.surah} ${surah.number}`}
                </span>
                <span className={`font-arabic text-lg ${isSelected ? 'text-amber-200' : 'text-emerald-900'}`} dir="rtl">
                  {surah.arabicName}
                </span>
              </div>

              <h3 className={`font-heading font-bold text-base ${isSelected ? 'text-amber-100' : 'text-emerald-950'}`}>
                {surah.name}
              </h3>
              <p className={`text-xs mb-3 ${isSelected ? 'text-emerald-200/80' : 'text-stone-500'}`}>
                {surah.englishMeaning}
              </p>

              <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between text-xs font-medium">
                <span className={isSelected ? 'text-amber-300' : 'text-stone-600'}>
                  {explorerHeaders.pagesLabel} {surah.pageStart}–{surah.pageEnd}
                </span>
                <span className={isSelected ? 'text-emerald-300' : 'text-amber-800'}>
                  {surah.totalVerses > 0 ? `${surah.totalVerses} ${explorerHeaders.versesLabel}` : `32 ${explorerHeaders.pagesCountLabel}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-2.5 rounded-xl border border-stone-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 text-sm outline-none text-stone-900`}
            />
          </div>

          {/* Reset filter button */}
          {(selectedSurah !== 'all' || selectedTheme || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSurah('all');
                setSelectedTheme(null);
                setSearchQuery('');
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600 transition-colors"
            >
              {t.resetFilters}
            </button>
          )}
        </div>

        {/* Thematic Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-stone-500 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-stone-400" /> {explorerHeaders.themes}
          </span>
          {allThemes.map((theme, i) => (
            <button
              key={i}
              onClick={() => setSelectedTheme(selectedTheme === theme ? null : theme)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
                selectedTheme === theme
                  ? 'bg-emerald-900 text-amber-100 border-emerald-900 font-semibold'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          {explorerHeaders.showing} <strong>{filteredPages.length}</strong> {explorerHeaders.sections}
        </span>
        <span className="hidden sm:inline">
          {explorerHeaders.hint}
        </span>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPages.map((item) => (
          <div
            key={item.page}
            className="p-5 rounded-2xl bg-white border border-amber-900/15 hover:border-emerald-700/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Badge & Arabic snippet */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-900/10 text-emerald-900 text-xs font-bold font-mono">
                  {t.page} {item.page}
                </span>
                {item.surahName ? (
                  <span className="text-xs font-semibold text-amber-800">
                    {item.surahName} {item.verseRange && `(${item.verseRange})`}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-800">{explorerHeaders.intro}</span>
                )}
              </div>

              {/* Title */}
              <h4 className="font-heading font-bold text-emerald-950 text-base mb-2 line-clamp-2">
                {item.sectionTitle}
              </h4>

              {/* Summary */}
              <p className="text-xs text-stone-600 line-clamp-3 mb-3 leading-relaxed">
                {item.summary}
              </p>

              {/* Excerpt callout */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 mb-4">
                <p className="text-xs text-stone-800 italic line-clamp-2">
                  "{item.tafseerExcerpt}"
                </p>
              </div>

              {/* Key themes */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.keyThemes.slice(0, 3).map((theme, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-600"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onInspectPage(item.page)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-900 text-amber-100 text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.inspectPage}</span>
              </button>

              <button
                onClick={() =>
                  onAskAboutPage(
                    item.page,
                    getPagePrompt(language, item.page, item.sectionTitle)
                  )
                }
                className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                title={t.askAboutPage}
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
              </button>

              <a
                href={item.scanUrl || getScanUrl(item.page)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
                title={t.openScanArchive}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

