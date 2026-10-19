import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  RotateCcw,
  Search,
  BookCheck,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage, MessageSource } from '../types';
import { getScanUrl } from '../data/tafheemVolume1Data';
import { getLocalizedPage, getLocalizedYou, getCitationsLabel } from '../data/localizedVolume1';
import { SupportedLanguage, TranslationStrings, SUPPORTED_LANGUAGES } from '../data/translations';

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onInspectPage: (pageNumber: number) => void;
  onBookmarkMessage: (message: ChatMessage) => void;
  fontSize: 'normal' | 'large';
  savedMessageIds: Set<string>;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationStrings;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onInspectPage,
  onBookmarkMessage,
  fontSize,
  savedMessageIds,
  language,
  setLanguage,
  t,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRTL = language === 'ur';
  const currentLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Auto-detect script as user types and optionally switch language
  const handleInputChange = (text: string) => {
    setInputText(text);

    // If user starts typing in a specific script, automatically switch active language
    if (/[\u0900-\u097F]/.test(text) && language !== 'hi') {
      setLanguage('hi');
    } else if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text) && language !== 'ur') {
      setLanguage('ur');
    } else if (/[\u0980-\u09FF]/.test(text) && language !== 'bn') {
      setLanguage('bn');
    } else if (/[\u0B80-\u0BFF]/.test(text) && language !== 'ta') {
      setLanguage('ta');
    } else if (/[\u0D00-\u0D7F]/.test(text) && language !== 'ml') {
      setLanguage('ml');
    } else if (/[\u0C80-\u0CFF]/.test(text) && language !== 'kn') {
      setLanguage('kn');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (activeSpeakingId === id) {
      window.speechSynthesis.cancel();
      setActiveSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown hashes/links for smoother audio reading
    const cleanText = text
      .replace(/[#*_`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 1500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCodes: Record<SupportedLanguage, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      ur: 'ur-PK',
      bn: 'bn-BD',
      ta: 'ta-IN',
      ml: 'ml-IN',
      kn: 'kn-IN',
    };
    utterance.lang = langCodes[language] || 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setActiveSpeakingId(null);
    utterance.onerror = () => setActiveSpeakingId(null);

    setActiveSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to render formatted text with inline page link highlights
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div
        className={`space-y-3 ${fontSize === 'large' ? 'text-base sm:text-lg leading-relaxed' : 'text-sm sm:text-base leading-normal'} text-stone-800`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-heading font-bold text-emerald-950 text-base sm:text-lg mt-4 mb-1">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-heading font-bold text-emerald-900 text-lg sm:text-xl mt-5 mb-2 border-b border-emerald-800/10 pb-1">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="pl-4 py-1.5 border-l-4 border-amber-600 bg-amber-500/10 rounded-r-lg italic text-stone-800 my-2">
                {trimmed.replace('> ', '')}
              </blockquote>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            return (
              <li key={idx} className="ml-5 list-disc text-stone-700">
                {renderInlineStyles(trimmed.slice(2))}
              </li>
            );
          }
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <li key={idx} className="ml-5 list-decimal text-stone-700">
                {renderInlineStyles(trimmed.replace(/^\d+\.\s/, ''))}
              </li>
            );
          }
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx}>{renderInlineStyles(trimmed)}</p>;
        })}
      </div>
    );
  };

  const renderInlineStyles = (text: string) => {
    // Regex for bold text **bold**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-emerald-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-6xl mx-auto px-3 sm:px-6 py-4">
      {/* Top Banner / Status */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-900/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-900">
            {t.statusEngine}
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 px-2 py-1 rounded hover:bg-stone-200/60 transition-colors"
            title={t.newDiscussion}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.newDiscussion}</span>
          </button>
        )}
      </div>

      {/* Prominent Multi-Language Selector Bar (Hindi, English, Urdu, Bangla, Tamil, Malayalam, Kannada) */}
      <div className="bg-gradient-to-r from-amber-50/90 via-emerald-50/60 to-amber-50/90 border border-amber-900/15 rounded-xl p-2.5 sm:p-3 mb-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
            <Globe className="w-4 h-4 text-emerald-800" />
            <span>Select Answer Language / भाषा चुनें / زبان کا انتخاب کریں:</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-850 font-medium bg-emerald-900/10 px-2 py-0.5 rounded-md border border-emerald-900/15">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Answers strictly in: <strong className="font-bold text-emerald-950">{currentLangConfig.nativeName} ({currentLangConfig.name})</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-all border ${
                  isSelected
                    ? 'bg-emerald-900 text-amber-200 border-emerald-800 shadow-xs ring-2 ring-emerald-600/30 font-bold scale-[1.02]'
                    : 'bg-white hover:bg-amber-100/50 text-stone-700 border-stone-200 hover:border-amber-300 font-medium'
                }`}
                title={`Receive all answers in ${lang.name} (${lang.nativeName})`}
              >
                <span>{lang.flag}</span>
                <span className="truncate">{lang.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 sm:pr-2">
        {messages.length === 0 ? (
          /* Empty State / Welcome Screen */
          <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8 animate-fadeIn">
            {/* Calligraphic greeting */}
            <div className="text-center space-y-3">
              <div className="inline-block px-6 py-2 rounded-full bg-emerald-900/10 border border-emerald-900/20">
                <p className="font-arabic text-2xl sm:text-3xl text-emerald-900 font-bold" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-emerald-950">
                {t.welcomeTitle}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
                {t.welcomeDesc}
              </p>
            </div>

            {/* Scope highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white/90 border border-amber-900/10 shadow-xs">
                <span className="text-xs font-bold text-amber-800 block">Muqaddimah</span>
                <span className="text-xs text-stone-500">pp. 1–32</span>
              </div>
              <div className="p-3 rounded-xl bg-white/90 border border-amber-900/10 shadow-xs">
                <span className="text-xs font-bold text-amber-800 block">Surah Al-Fatihah</span>
                <span className="text-xs text-stone-500">pp. 33–46</span>
              </div>
              <div className="p-3 rounded-xl bg-white/90 border border-amber-900/10 shadow-xs">
                <span className="text-xs font-bold text-amber-800 block">Surah Al-Baqarah</span>
                <span className="text-xs text-stone-500">pp. 47–320</span>
              </div>
              <div className="p-3 rounded-xl bg-white/90 border border-amber-900/10 shadow-xs">
                <span className="text-xs font-bold text-amber-800 block">Surah Ali 'Imran</span>
                <span className="text-xs text-stone-500">pp. 321–480</span>
              </div>
            </div>

            {/* Suggested Inquiries (Localized) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {t.featuredQuestions}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {t.sampleQuestions.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(sample.question)}
                    className="p-3.5 text-left rounded-xl bg-white hover:bg-emerald-50/70 border border-amber-900/15 hover:border-emerald-600/50 shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between"
                  >
                    <span className="text-xs sm:text-sm font-medium text-stone-800 group-hover:text-emerald-950 leading-snug" dir={isRTL ? 'rtl' : 'ltr'}>
                      "{sample.question}"
                    </span>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs">
                      <span className="text-amber-800 font-semibold">{sample.surah}</span>
                      <span className="text-stone-400 group-hover:text-emerald-700 font-mono">
                        {t.page} ~{sample.pageRef}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat Thread */
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 px-1 text-xs text-stone-500">
                <span className="font-semibold text-emerald-950">
                  {message.role === 'user' ? getLocalizedYou(language) : t.appTitle}
                </span>
                <span>•</span>
                <span>{message.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[92%] sm:max-w-2xl lg:max-w-3xl rounded-2xl p-4 sm:p-5 shadow-xs ${
                  message.role === 'user'
                    ? 'bg-emerald-900 text-amber-50 rounded-tr-none'
                    : 'bg-white border border-amber-900/15 text-stone-900 rounded-tl-none'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap" dir={isRTL ? 'rtl' : 'ltr'}>
                    {message.content}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {renderFormattedContent(message.content)}

                    {/* Live Quran Tafseer API Database Citations */}
                    {message.tafseerCitations && message.tafseerCitations.length > 0 && (
                      <div className="mt-4 p-3.5 rounded-xl bg-amber-50/90 border border-amber-300/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-950 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {language === 'ur'
                              ? 'براہ راست قرآنی تفسیر ڈیٹا بیس حوالہ'
                              : language === 'hi'
                              ? 'लाइव क़ुरआन तफ़सीर डेटाबेस संदर्भ'
                              : language === 'bn'
                              ? 'লাইভ কুরআন তাফসীর ডেটাবেস তথ্যসূত্র'
                              : language === 'ta'
                              ? 'நேரடி குர்ஆன் தஃப்ஸீர் தரவுத்தள மேற்கோள்'
                              : language === 'ml'
                              ? 'തത്സമയ ഖുർആൻ തഫ്സീർ ഡാറ്റാബേസ് റഫറൻസ്'
                              : language === 'kn'
                              ? 'ಲೈವ್ ಕುರ್ಆನ್ ತಫ್ಸೀರ್ ಡೇಟಾಬೇಸ್ ಉಲ್ಲೇಖ'
                              : 'Live Quran Tafseer API Database Reference'}
                          </span>
                        </div>
                        {message.tafseerCitations.map((cit, idx) => (
                          <div key={idx} className="text-xs space-y-1">
                            <div className="flex items-center justify-between font-semibold text-amber-900">
                              <span>
                                {cit.bookName} ({cit.author})
                              </span>
                              <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200">
                                {cit.surah}:{cit.ayah}
                              </span>
                            </div>
                            {cit.arabicExcerpt && (
                              <p dir="rtl" className="font-arabic text-sm text-stone-800 text-right leading-relaxed">
                                {cit.arabicExcerpt}
                              </p>
                            )}
                            {cit.translationExcerpt && (
                              <p className="text-stone-700 italic">
                                "{cit.translationExcerpt}"
                              </p>
                            )}
                            {cit.tafseerExcerpt && (
                              <p className="text-stone-600 line-clamp-3 bg-white/70 p-2 rounded-lg border border-amber-100">
                                {cit.tafseerExcerpt}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sources & Page Citations Shelf */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-amber-900/15">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                            <BookCheck className="w-4 h-4 text-emerald-700" />
                            {t.citedPagesTitle}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">
                            {getCitationsLabel(message.sources.length, language)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {message.sources.map((src, i) => {
                            const loc = getLocalizedPage(src.page, language);
                            const displaySurah = loc.surahName || src.surah;
                            const displayTitle = loc.sectionTitle || src.title;
                            const displayExcerpt = loc.tafseerExcerpt || src.excerpt;

                            return (
                              <div
                                key={i}
                                className="p-2.5 rounded-lg bg-emerald-950/5 border border-emerald-900/15 hover:border-emerald-700/50 transition-colors flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-xs text-emerald-900">
                                      {t.page} {src.page}
                                    </span>
                                    <span className="text-[11px] text-amber-800 font-medium">
                                      {displaySurah} {src.verse ? `(${src.verse})` : ''}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-stone-800 line-clamp-1">
                                    {displayTitle}
                                  </p>
                                  <p className="text-[11px] text-stone-600 italic line-clamp-2 mt-1">
                                    "{displayExcerpt}"
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-emerald-900/10">
                                <button
                                  onClick={() => onInspectPage(src.page)}
                                  className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-emerald-900 text-amber-100 text-[11px] font-semibold hover:bg-emerald-800 transition-colors"
                                >
                                  <BookOpen className="w-3 h-3 text-amber-400" />
                                  <span>{t.inspectPage}</span>
                                </button>
                                <a
                                  href={src.scanUrl || getScanUrl(src.page)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1 py-1 px-2 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 text-[11px] font-medium transition-colors"
                                  title="View on Archive.org"
                                >
                                  <span>{t.openScan}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    )}

                    {/* Toolbar Actions for Assistant */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100 transition-colors"
                        title={t.copy}
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">{t.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t.copy}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSpeak(message.id, message.content)}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                          activeSpeakingId === message.id
                            ? 'bg-amber-100 text-amber-900 font-semibold'
                            : 'hover:bg-stone-100'
                        }`}
                        title={t.listen}
                      >
                        {activeSpeakingId === message.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                            <span>{t.stopAudio}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t.listen}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onBookmarkMessage(message)}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                          savedMessageIds.has(message.id)
                            ? 'bg-amber-100 text-amber-900 font-semibold'
                            : 'hover:bg-stone-100'
                        }`}
                        title={t.save}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            savedMessageIds.has(message.id) ? 'fill-amber-600 text-amber-600' : ''
                          }`}
                        />
                        <span>{savedMessageIds.has(message.id) ? t.saved : t.save}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col items-start space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 px-1 text-xs text-stone-500">
              <span className="font-semibold text-emerald-950">{t.appTitle}</span>
              <span>•</span>
              <span>{t.researching}</span>
            </div>
            <div className="bg-white border border-amber-900/15 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <div className="text-xs text-stone-700 space-y-0.5">
                <p className="font-semibold text-emerald-900">{t.analyzing}</p>
                <p className="text-stone-500">Analyzing Al-Fatihah, Al-Baqarah, Ali 'Imran, or Muqaddimah</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar Form */}
      <div className="mt-4 pt-2.5 border-t border-amber-900/15 bg-amber-50/70 backdrop-blur-sm">
        {/* Quick Language Toggle Bar directly above input */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 px-1 text-xs">
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="font-semibold text-emerald-950 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>Response Language:</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-900 text-amber-200 shadow-xs">
              {currentLangConfig.nativeName}
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  language === lang.code
                    ? 'bg-emerald-900 text-amber-200 font-bold shadow-xs'
                    : 'bg-white/80 hover:bg-emerald-100/60 text-stone-700 border border-stone-200'
                }`}
                title={`Switch response language to ${lang.name}`}
              >
                <span>{lang.flag} {lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t.inputPlaceholder}
            disabled={isLoading}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="w-full pl-4 pr-12 py-3.5 text-sm sm:text-base rounded-xl bg-white border border-amber-900/20 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none shadow-sm text-stone-900 placeholder:text-stone-400 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-emerald-900 text-amber-200 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            title={t.sendBtn}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-stone-500">
          <span>{t.inputNote}</span>
          <span className="hidden sm:inline">Press Enter to ask • Language: {currentLangConfig.name}</span>
        </div>
      </div>
    </div>
  );
};
