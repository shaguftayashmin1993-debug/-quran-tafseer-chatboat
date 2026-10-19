import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Copy,
  Check,
  Bookmark,
  MessageSquare,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  Search,
  BookMarked,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SupportedLanguage, TranslationStrings } from '../data/translations';
import { QURAN_SURAHS, TAFSEER_BOOKS, NOTABLE_AYAHS, TafseerBookMeta, SurahMeta } from '../data/quranMetadata';
import { TafseerVerseResponse } from '../types';

interface TafseerViewProps {
  language: SupportedLanguage;
  t: TranslationStrings;
  onAskAboutTafseer: (prompt: string) => void;
  onBookmarkTafseer: (item: {
    surah: number;
    ayah: number;
    surahName: string;
    bookName: string;
    arabicText: string;
    translation: string;
    tafseerText: string;
    scanUrl?: string;
  }) => void;
  onInspectVolume1Page?: (page: number) => void;
}

export const TafseerView: React.FC<TafseerViewProps> = ({
  language,
  t,
  onAskAboutTafseer,
  onBookmarkTafseer,
  onInspectVolume1Page,
}) => {
  const [selectedSurah, setSelectedSurah] = useState<number>(2);
  const [selectedAyah, setSelectedAyah] = useState<number>(255);
  
  // Default book selected based on current active language
  const getDefaultBook = (lang: SupportedLanguage) => {
    if (lang === 'ur') return '160'; // Urdu Ibn Kathir
    if (lang === 'bn') return '164'; // Bengali Ibn Kathir
    return '169'; // English Ibn Kathir
  };

  const [selectedBookId, setSelectedBookId] = useState<string>(() => getDefaultBook(language));
  const [data, setData] = useState<TafseerVerseResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // UI state
  const [copiedTextType, setCopiedTextType] = useState<'arabic' | 'tafseer' | null>(null);
  const [isBookmarkedSaved, setIsBookmarkedSaved] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [surahFilterQuery, setSurahFilterQuery] = useState<string>('');

  // When language changes, optionally adapt default book if user hasn't explicitly customized
  useEffect(() => {
    setSelectedBookId((prev) => {
      if (prev === '169' && language === 'ur') return '160';
      if (prev === '160' && language === 'bn') return '164';
      if (prev === '164' && language === 'en') return '169';
      return prev;
    });
  }, [language]);

  const currentSurahMeta: SurahMeta =
    QURAN_SURAHS.find((s) => s.number === selectedSurah) || QURAN_SURAHS[1];
  const currentBookMeta: TafseerBookMeta =
    TAFSEER_BOOKS.find((b) => b.id === selectedBookId) || TAFSEER_BOOKS[0];

  // Fetch Tafseer & Verse from Backend API
  useEffect(() => {
    let isSubscribed = true;
    setIsLoading(true);
    setError(null);
    setIsBookmarkedSaved(false);

    // Stop existing audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    const controller = new AbortController();

    async function loadVerseData() {
      try {
        const queryParams = new URLSearchParams({
          surah: String(selectedSurah),
          ayah: String(selectedAyah),
          book: selectedBookId,
          lang: language,
        });

        const res = await fetch(`/api/tafseer/verse?${queryParams.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load exegesis (status ${res.status})`);
        }

        const json: TafseerVerseResponse = await res.json();
        if (isSubscribed) {
          setData(json);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && isSubscribed) {
          console.error('Error fetching Tafseer:', err);
          setError(err?.message || 'Failed to load exegesis from live Tafseer API.');
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    loadVerseData();

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [selectedSurah, selectedAyah, selectedBookId, language]);

  // Audio Playback handler
  const handleToggleAudio = () => {
    if (!data?.audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(data.audioUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
      audioRef.current.onerror = () => setIsPlayingAudio(false);
    } else if (audioRef.current.src !== data.audioUrl) {
      audioRef.current.src = data.audioUrl;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch((e) => {
        console.warn('Audio play prevented:', e);
        setIsPlayingAudio(false);
      });
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Copy helper
  const handleCopy = (text: string, type: 'arabic' | 'tafseer') => {
    navigator.clipboard.writeText(text);
    setCopiedTextType(type);
    setTimeout(() => setCopiedTextType(null), 2200);
  };

  // Bookmark helper
  const handleSaveBookmark = () => {
    if (!data) return;
    onBookmarkTafseer({
      surah: data.surah,
      ayah: data.ayah,
      surahName: `${data.surahNameEnglish} (${data.surahNameArabic})`,
      bookName: data.tafsir.name,
      arabicText: data.arabicText,
      translation: data.translation,
      tafseerText: data.tafsir.cleanText || data.tafsir.text,
      scanUrl: data.volume1ScanUrl,
    });
    setIsBookmarkedSaved(true);
  };

  // Ask AI about this Ayah & Tafseer
  const handleAskAi = () => {
    if (!data) return;
    const prompt = language === 'ur'
      ? `سورۃ ${data.surahNameEnglish} آیت نمبر ${data.ayah} کی تفسیر (${data.tafsir.name}) کی روشنی میں تفصیلی وضاحت فرمائیں اور تفہیم القرآن جلد اول کے تناظر میں اس کے اہم اسباق بیان کریں۔`
      : language === 'hi'
      ? `सूरह ${data.surahNameEnglish} की आयत ${data.ayah} और इसकी तफ़सीर (${data.tafsir.name}) के आधार पर मुख्य शिक्षाएं और तफ़ीम-उल-क़ुरआन खंड 1 के संदर्भ समझाएं।`
      : language === 'bn'
      ? `সূরা ${data.surahNameEnglish}-এর আয়াত ${data.ayah} এবং এর তাফসীর (${data.tafsir.name})-এর আলোকে মূল শিক্ষা ও তাফহীমুল কুরআন খণ্ড ১-এর প্রেক্ষাপট ব্যাখ্যা করুন।`
      : `Please provide a comprehensive scholarly exegesis of Surah ${data.surahNameEnglish} (${data.surah}:${data.ayah}) based on ${data.tafsir.name} and correlate it with the themes of Tafheem-ul-Quran Volume 1.`;

    onAskAboutTafseer(prompt);
  };

  // Filtered Surahs list for quick selector
  const filteredSurahs = QURAN_SURAHS.filter(
    (s) =>
      s.transliteration.toLowerCase().includes(surahFilterQuery.toLowerCase()) ||
      s.translation.toLowerCase().includes(surahFilterQuery.toLowerCase()) ||
      s.name.includes(surahFilterQuery) ||
      String(s.number).includes(surahFilterQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-amber-50 rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.liveApiStatus}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-800/60 text-emerald-200 border border-emerald-700/50">
                114 Surahs • 6,236 Ayahs
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-amber-100 tracking-wide">
              {t.tafseerDbTitle}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-emerald-200/90 max-w-3xl leading-relaxed">
              {t.tafseerDbSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-900/80 border border-emerald-700/60 text-amber-200/90 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-lingual API Gateway</span>
            </span>
          </div>
        </div>
      </div>

      {/* Notable Ayahs Shortcuts Strip */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>{t.quickAyahsTitle}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {NOTABLE_AYAHS.map((item, idx) => {
            const isSelected = selectedSurah === item.surah && selectedAyah === item.ayah;
            const labelText = item.label[language] || item.label.en;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSurah(item.surah);
                  setSelectedAyah(item.ayah);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-900 text-amber-100 shadow border border-emerald-700'
                    : 'bg-white text-stone-700 hover:bg-emerald-50 hover:text-emerald-950 border border-stone-200/80'
                }`}
              >
                <span>{labelText}</span>
                <span className="text-[10px] opacity-75 font-mono">({item.surah}:{item.ayah})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Panel: Surah, Ayah & Tafseer Book Selector */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Surah Selector */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
            {t.selectSurahLabel}
          </label>
          <div className="relative">
            <select
              value={selectedSurah}
              onChange={(e) => {
                const s = Number(e.target.value);
                setSelectedSurah(s);
                setSelectedAyah(1); // Reset to first verse of selected surah
              }}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all appearance-none"
            >
              {QURAN_SURAHS.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.transliteration} ({s.name}) — {s.totalVerses} {t.verses}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              ▼
            </div>
          </div>
        </div>

        {/* Ayah Selector with Next / Prev */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
            {t.selectAyahLabel} (1–{currentSurahMeta.totalVerses})
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedAyah((prev) => Math.max(1, prev - 1))}
              disabled={selectedAyah <= 1}
              title={t.previousAyah}
              className="p-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none text-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <select
              value={selectedAyah}
              onChange={(e) => setSelectedAyah(Number(e.target.value))}
              className="flex-1 px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-stone-900 font-medium text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all appearance-none"
            >
              {Array.from({ length: currentSurahMeta.totalVerses }, (_, i) => i + 1).map((a) => (
                <option key={a} value={a}>
                  {t.selectAyahLabel} {a}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSelectedAyah((prev) => Math.min(currentSurahMeta.totalVerses, prev + 1))}
              disabled={selectedAyah >= currentSurahMeta.totalVerses}
              title={t.nextAyah}
              className="p-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none text-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tafseer Book Selection */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center justify-between">
            <span>{t.selectTafseerBook}</span>
            <span className="text-[10px] text-emerald-800 font-normal">
              {currentBookMeta.nativeLanguageName}
            </span>
          </label>
          <div className="relative">
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all appearance-none"
            >
              {TAFSEER_BOOKS.map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.language.toUpperCase()}] {b.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Main Exegesis & Verse Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        {/* Verse Header Info Bar */}
        <div className="bg-stone-50/90 px-6 py-4 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-200 flex items-center justify-center font-bold text-sm shadow-sm">
              {currentSurahMeta.number}:{selectedAyah}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-heading font-bold text-stone-900">
                  {currentSurahMeta.transliteration} ({currentSurahMeta.name})
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 font-medium">
                  {currentSurahMeta.revelationType}
                </span>
                {data?.tafheemVolume1Page && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold border border-amber-300/60">
                    Volume 1 • Page {data.tafheemVolume1Page}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                {currentSurahMeta.translation} • {t.selectAyahLabel} {selectedAyah} of {currentSurahMeta.totalVerses}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Audio Recitation Button */}
            {data?.audioUrl && (
              <button
                onClick={handleToggleAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/80'
                }`}
                title={isPlayingAudio ? t.pauseRecitation : t.playRecitation}
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? t.pauseRecitation : t.playRecitation}</span>
              </button>
            )}

            {/* Bookmark */}
            <button
              onClick={handleSaveBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isBookmarkedSaved
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
              title={t.bookmarkTafseer}
            >
              {isBookmarkedSaved ? <Check className="w-3.5 h-3.5 text-amber-700" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isBookmarkedSaved ? t.saved : t.bookmarkTafseer}</span>
            </button>

            {/* Ask AI */}
            <button
              onClick={handleAskAi}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-900 text-amber-100 hover:bg-emerald-950 shadow-sm transition-all border border-emerald-800"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.askAiAboutVerse}</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 space-y-8">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-stone-600 font-medium">{t.loadingTafseer}</p>
              <p className="text-xs text-stone-400">
                Fetching authentic text from Quran.com API v4 & AlQuran Cloud...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-800 rounded-xl border border-red-200 text-center space-y-2">
              <p className="font-semibold">{error}</p>
              <button
                onClick={() => setSelectedAyah((p) => p)}
                className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md font-medium text-red-900 transition-colors"
              >
                Retry Request
              </button>
            </div>
          ) : data ? (
            <>
              {/* 1. Arabic Verse Display */}
              <div className="bg-stone-50/70 border border-amber-100/80 rounded-2xl p-6 sm:p-8 relative group">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-4 pb-2 border-b border-stone-200/60">
                  <span className="font-semibold text-emerald-900 uppercase tracking-wider">
                    {t.arabicVerse}
                  </span>
                  <button
                    onClick={() => handleCopy(data.arabicText, 'arabic')}
                    className="flex items-center gap-1 text-stone-500 hover:text-emerald-900 transition-colors"
                    title={t.copy}
                  >
                    {copiedTextType === 'arabic' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedTextType === 'arabic' ? t.copied : t.copy}</span>
                  </button>
                </div>

                <div
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl lg:text-4xl leading-[2.2] text-stone-900 text-right font-medium select-text"
                >
                  {data.arabicText}{' '}
                  <span className="inline-flex items-center justify-center font-sans text-xs sm:text-sm text-amber-700 px-2 py-0.5 rounded-full border border-amber-300 bg-amber-50 mx-1 align-middle">
                    ۝ {data.ayah}
                  </span>
                </div>
              </div>

              {/* 2. Meaning & Translation */}
              <div className="bg-white border-l-4 border-amber-600 pl-5 py-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-semibold text-stone-700 uppercase tracking-wider">
                    {t.meaningTranslation} ({data.translationAuthor})
                  </span>
                </div>
                <p className="text-base sm:text-lg text-stone-800 leading-relaxed font-body">
                  "{data.translation}"
                </p>
              </div>

              {/* 3. Scholarly Commentary / Tafseer */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider block">
                      {t.scholarlyCommentary}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-stone-900">
                      {data.tafsir.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      By {data.tafsir.author} • Language: {data.tafsir.language}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Font Size controls */}
                    <div className="flex items-center border border-stone-200 rounded-lg p-0.5 text-xs text-stone-600 bg-stone-50">
                      <button
                        onClick={() => setFontSize('sm')}
                        className={`px-2 py-1 rounded ${fontSize === 'sm' ? 'bg-white shadow font-bold text-stone-900' : ''}`}
                      >
                        A-
                      </button>
                      <button
                        onClick={() => setFontSize('base')}
                        className={`px-2 py-1 rounded ${fontSize === 'base' ? 'bg-white shadow font-bold text-stone-900' : ''}`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => setFontSize('lg')}
                        className={`px-2 py-1 rounded ${fontSize === 'lg' ? 'bg-white shadow font-bold text-stone-900' : ''}`}
                      >
                        A+
                      </button>
                    </div>

                    {/* Copy Tafseer */}
                    <button
                      onClick={() => handleCopy(data.tafsir.cleanText || data.tafsir.text, 'tafseer')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 transition-colors"
                      title={t.copy}
                    >
                      {copiedTextType === 'tafseer' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedTextType === 'tafseer' ? t.copied : t.copy}</span>
                    </button>
                  </div>
                </div>

                {/* Exegesis Text Body */}
                <div
                  className={`bg-stone-50/60 p-6 sm:p-8 rounded-2xl border border-stone-200/80 leading-relaxed text-stone-800 font-body select-text ${
                    fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg leading-loose' : 'text-base'
                  } ${data.tafsir.language === 'arabic' || data.tafsir.language === 'urdu' ? 'font-arabic text-right leading-loose' : ''}`}
                  dir={data.tafsir.language === 'arabic' || data.tafsir.language === 'urdu' ? 'rtl' : 'ltr'}
                >
                  {data.tafsir.cleanText ? (
                    <div className="space-y-4 whitespace-pre-line">
                      {data.tafsir.cleanText}
                    </div>
                  ) : (
                    <p className="text-stone-500 italic">No detailed exegesis text available for this verse selection.</p>
                  )}
                </div>

                {/* Cross-link to Tafheem Volume 1 Archive Scan if within Volume 1 bounds */}
                {data.tafheemVolume1Page && (
                  <div className="mt-6 p-4 rounded-xl bg-amber-50/90 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-700 text-amber-100 flex items-center justify-center font-bold text-xs">
                        V1
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-amber-950">
                          Cross-Referenced in Tafheem-ul-Quran (Volume 1)
                        </h4>
                        <p className="text-xs text-amber-800">
                          This Ayah corresponds to Page {data.tafheemVolume1Page} of Maududi's original manuscript scan.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onInspectVolume1Page && (
                        <button
                          onClick={() => onInspectVolume1Page(data.tafheemVolume1Page!)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-800 text-amber-50 hover:bg-amber-900 transition-colors"
                        >
                          {t.inspectPage} ({data.tafheemVolume1Page})
                        </button>
                      )}
                      {data.volume1ScanUrl && (
                        <a
                          href={data.volume1ScanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-amber-900 hover:bg-amber-100 border border-amber-300 flex items-center gap-1 transition-colors"
                        >
                          <span>{t.openScan}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
