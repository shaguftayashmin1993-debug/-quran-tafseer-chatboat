import React, { useState, useEffect } from 'react';
import { X, ExternalLink, BookOpen, ChevronLeft, ChevronRight, Bookmark, Sparkles, FileText, Copy, Check, Download, AlignLeft } from 'lucide-react';
import { getScanUrl, Volume1PageEntry } from '../data/tafheemVolume1Data';
import { getLocalizedPage } from '../data/localizedVolume1';
import { VOLUME_1_PAGE_TEXTS } from '../data/tafheemPagesText';
import { SupportedLanguage, TranslationStrings, getPagePrompt } from '../data/translations';

interface PageReaderModalProps {
  pageNumber: number | null;
  onClose: () => void;
  onAskAboutPage: (page: number, contextText: string) => void;
  onBookmarkPage: (page: Volume1PageEntry) => void;
  isBookmarked?: boolean;
  language: SupportedLanguage;
  t: TranslationStrings;
}

export const PageReaderModal: React.FC<PageReaderModalProps> = ({
  pageNumber,
  onClose,
  onAskAboutPage,
  onBookmarkPage,
  isBookmarked,
  language,
  t,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(pageNumber || 30);
  const [viewMode, setViewMode] = useState<'commentary' | 'transcript' | 'scan'>('commentary');
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  useEffect(() => {
    if (pageNumber) {
      setCurrentPage(pageNumber);
    }
  }, [pageNumber]);

  if (!pageNumber) return null;

  const isRTL = language === 'ur';

  // Find localized page data
  const pageData: Volume1PageEntry = getLocalizedPage(currentPage, language);

  const pageTranscript = VOLUME_1_PAGE_TEXTS[currentPage]?.text ||
    `[${t.page} ${currentPage}]\n${t.appTitle} (${t.volumeBadge})\n${pageData.sectionTitle}\n\n${pageData.summary}\n\n"${pageData.tafseerExcerpt}"\n\nScan: ${getScanUrl(currentPage)}`;

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < 480) setCurrentPage((prev) => prev + 1);
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(pageTranscript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const blob = new Blob([pageTranscript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tafheem_vol1_page_${String(currentPage).padStart(4, '0')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scanUrl = getScanUrl(currentPage);

  // Localized modal labels
  const modalLabels = {
    en: {
      commentary: "Commentary",
      transcript: "Text (.txt)",
      scan: "Scan Viewer",
      exegesisHeader: "Maududi's Exegesis & Footnotes",
      keyTopics: `Key Topics Covered on Page ${currentPage}`,
      archiveCalloutTitle: "Original Volume 1 Scan on Archive.org",
      archiveCalloutDesc: "Inspect the complete two-page book spread with Urdu/English typography and full footnote apparatus.",
      openInNewTab: "Open Scan in New Tab",
      copyText: "Copy Text",
      copied: "Copied",
      downloadTxt: "Download .txt",
      readOnArchive: `Read Page ${currentPage} on Archive.org`,
      backToCommentary: "Back to Commentary",
      scanIntroDesc: "The complete scanned edition is hosted on Archive.org with dual-page book reading, zoom, and search capabilities.",
      surahPrefix: "Surah",
      versesPrefix: "Verses",
    },
    hi: {
      commentary: "तफ़सीर नोट्स",
      transcript: "मूल पाठ (.txt)",
      scan: "पांडुलिपि दृश्य",
      exegesisHeader: "मौदूदी की तफ़सीर एवं पाद-टिप्पणियां",
      keyTopics: `पृष्ठ ${currentPage} पर शामिल मुख्य विषय`,
      archiveCalloutTitle: "Archive.org पर मूल खंड 1 स्कैन",
      archiveCalloutDesc: "उर्दू सुलेख, विस्तृत पाद-टिप्पणियों और संदर्भों के साथ सम्पूर्ण दोहरे पृष्ठ का अध्ययन करें।",
      openInNewTab: "नए टैब में स्कैन खोलें",
      copyText: "पाठ कॉपी करें",
      copied: "कॉपी हो गया",
      downloadTxt: "डाउनलोड (.txt)",
      readOnArchive: `Archive.org पर पृष्ठ ${currentPage} पढ़ें`,
      backToCommentary: "तफ़सीर पर वापस जाएं",
      scanIntroDesc: "सम्पूर्ण स्कैन संस्करण Archive.org पर उपलब्ध है जहाँ आप ज़ूम और खोज सुविधाओं के साथ पढ़ सकते हैं।",
      surahPrefix: "सूरह",
      versesPrefix: "आयतें",
    },
    ur: {
      commentary: "تفسیری نوٹس",
      transcript: "اصل متن (.txt)",
      scan: "اسکین ریڈر",
      exegesisHeader: "سید مودودی کے تفسیری حواشی و نکات",
      keyTopics: `صفحہ ${currentPage} پر موجود اہم موضوعات`,
      archiveCalloutTitle: "Archive.org پر اصل مطبوعہ نسخہ",
      archiveCalloutDesc: "اصل کتابت اور جامع حواشی کے ساتھ دو رخی اسکین شدہ صفحات کا مطالعہ کریں۔",
      openInNewTab: "نئی ونڈو میں اسکین کھولیں",
      copyText: "متن کاپی کریں",
      copied: "کاپی ہو گیا",
      downloadTxt: "ڈاؤنلوڈ کریں (.txt)",
      readOnArchive: `Archive.org پر صفحہ ${currentPage} دیکھیں`,
      backToCommentary: "تفسیر پر واپس جائیں",
      scanIntroDesc: "مکمل اسکین شدہ نسخہ Archive.org پر زوم اور سرچ کی سہولت کے ساتھ محفوظ ہے۔",
      surahPrefix: "سورۃ",
      versesPrefix: "آیات",
    },
    bn: {
      commentary: "তাফসীর নোট",
      transcript: "মূল পাঠ (.txt)",
      scan: "স্ক্যান ভিউয়ার",
      exegesisHeader: "মাওদূদীর তাফসীর ও টীকা",
      keyTopics: `পৃষ্ঠা ${currentPage}-এর প্রধান বিষয়সমূহ`,
      archiveCalloutTitle: "Archive.org-এ মূল খণ্ড ১ স্ক্যান",
      archiveCalloutDesc: "মূল লিপি ও পূর্ণাঙ্গ টীকা সংবলিত দুই পৃষ্ঠার বিস্তার বিশদভাবে পর্যবেক্ষণ করুন।",
      openInNewTab: "নতুন ট্যাবে স্ক্যান খুলুন",
      copyText: "কপি করুন",
      copied: "কপি হয়েছে",
      downloadTxt: "ডাউনলোড (.txt)",
      readOnArchive: `Archive.org-এ পৃষ্ঠা ${currentPage} পড়ুন`,
      backToCommentary: "তাফসীরে ফিরে যান",
      scanIntroDesc: "সম্পূর্ণ স্ক্যান কপি Archive.org-এ সংরক্ষিত রয়েছে।",
      surahPrefix: "সূরা",
      versesPrefix: "আয়াত",
    },
    ta: {
      commentary: "விரிவுரை",
      transcript: "உரை (.txt)",
      scan: "ஸ்கேன் தோற்றம்",
      exegesisHeader: "மௌதூதியின் தப்ஸீர் குறிப்புகள்",
      keyTopics: `பக்கம் ${currentPage} இல் உள்ள முக்கிய தலைப்புகள்`,
      archiveCalloutTitle: "Archive.org இல் அசல் நூல் ஸ்கேன்",
      archiveCalloutDesc: "அடிக்குறிப்புகள் மற்றும் விளக்கக் குறிப்புகளுடன் முழுமையான பக்கத்தைப் பார்வையிடுங்கள்.",
      openInNewTab: "புதிய தாவலில் திற",
      copyText: "நகலெடு",
      copied: "நகலெடுக்கப்பட்டது",
      downloadTxt: "பதிவிறக்கு (.txt)",
      readOnArchive: `Archive.org இல் பக்கம் ${currentPage} காண்க`,
      backToCommentary: "விரிவுரைக்குத் திரும்பு",
      scanIntroDesc: "முழுமையான ஸ்கேன் Archive.org இல் கிடைக்கிறது.",
      surahPrefix: "சூரா",
      versesPrefix: "வசனங்கள்",
    },
    ml: {
      commentary: "വ്യാഖ്യാനം",
      transcript: "ടെക്സ്റ്റ് (.txt)",
      scan: "സ്കാൻ വ്യൂവർ",
      exegesisHeader: "മൗദൂദിയുടെ തഫ്സീർ കുറിപ്പുകൾ",
      keyTopics: `പേജ് ${currentPage}-ലെ പ്രധാന വിഷയങ്ങൾ`,
      archiveCalloutTitle: "Archive.org-ലെ യഥാർത്ഥ സ്കാൻ",
      archiveCalloutDesc: "സമഗ്രമായ അടിക്കുറിപ്പുകളോടെ യഥാർത്ഥ പേജ് പരിശോധിക്കുക.",
      openInNewTab: "പുതിയ ടാബിൽ തുറക്കുക",
      copyText: "പകർത്തുക",
      copied: "പകർത്തി",
      downloadTxt: "ഡൗൺലോഡ് (.txt)",
      readOnArchive: `Archive.org-ൽ പേജ് ${currentPage} വായിക്കുക`,
      backToCommentary: "വ്യാഖ്യാനത്തിലേക്ക് മടങ്ങുക",
      scanIntroDesc: "സമ്പൂർണ്ണ സ്കാൻ പതിപ്പ് Archive.org-ൽ ലഭ്യമാണ്.",
      surahPrefix: "സൂറത്ത്",
      versesPrefix: "സൂക്തങ്ങൾ",
    },
    kn: {
      commentary: "ವಿವರಣೆ",
      transcript: "ಪಠ್ಯ (.txt)",
      scan: "ಸ್ಕ್ಯಾನ್ ವೀಕ್ಷಕ",
      exegesisHeader: "ಮೌದೂದಿಯವರ ತಫ್ಸೀರ್ ಟಿಪ್ಪಣಿಗಳು",
      keyTopics: `ಪುಟ ${currentPage} ರ ಪ್ರಮುಖ ವಿಷಯಗಳು`,
      archiveCalloutTitle: "Archive.org ನಲ್ಲಿ ಮೂಲ ಸ್ಕ್ಯಾನ್",
      archiveCalloutDesc: "ಅಡಿಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ಉಲ್ಲೇಖಗಳೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಪುಟವನ್ನು ಪರಿಶೀಲಿಸಿ.",
      openInNewTab: "ಹೊಸ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ",
      copyText: "ನಕಲಿಸಿ",
      copied: "ನಕಲಿಸಲಾಗಿದೆ",
      downloadTxt: "ಡೌನ್‌ಲೋಡ್ (.txt)",
      readOnArchive: `Archive.org ನಲ್ಲಿ ಪುಟ ${currentPage} ಓದಿ`,
      backToCommentary: "ವಿವರಣೆಗೆ ಹಿಂತಿರುಗಿ",
      scanIntroDesc: "ಸಂಪೂರ್ಣ ಆವೃತ್ತಿಯು Archive.org ನಲ್ಲಿ ಲಭ್ಯವಿದೆ.",
      surahPrefix: "ಸೂರಹ್",
      versesPrefix: "ಆಯತ್‌ಗಳು",
    },
  }[language] || {
    commentary: "Commentary",
    transcript: "Text (.txt)",
    scan: "Scan Viewer",
    exegesisHeader: "Maududi's Exegesis & Footnotes",
    keyTopics: `Key Topics Covered on Page ${currentPage}`,
    archiveCalloutTitle: "Original Volume 1 Scan on Archive.org",
    archiveCalloutDesc: "Inspect the complete two-page book spread with Urdu/English typography and full footnote apparatus.",
    openInNewTab: "Open Scan in New Tab",
    copyText: "Copy Text",
    copied: "Copied",
    downloadTxt: "Download .txt",
    readOnArchive: `Read Page ${currentPage} on Archive.org`,
    backToCommentary: "Back to Commentary",
    scanIntroDesc: "The complete scanned edition is hosted on Archive.org with dual-page book reading, zoom, and search capabilities.",
    surahPrefix: "Surah",
    versesPrefix: "Verses",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-sm animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-stone-50 rounded-2xl shadow-2xl border border-amber-900/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-amber-50 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-800/80 text-amber-300 border border-emerald-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base sm:text-lg text-amber-200">
                  {t.page} {currentPage}
                </span>
                {pageData.surahName && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-800 text-amber-200 border border-emerald-700">
                    {pageData.surahName} {pageData.verseRange && `(${pageData.verseRange})`}
                  </span>
                )}
                {pageData.surahNameArabic && (
                  <span className="font-arabic text-sm text-emerald-300" dir="rtl">
                    {pageData.surahNameArabic}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-300/80">
                {t.appTitle} ({t.volumeBadge}: pp. 1–480)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Commentary / Transcript / Scan */}
            <div className="hidden sm:flex bg-emerald-900/90 rounded-lg p-0.5 border border-emerald-700">
              <button
                onClick={() => setViewMode('commentary')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'commentary'
                    ? 'bg-amber-500 text-emerald-950 font-semibold'
                    : 'text-emerald-200 hover:text-amber-100'
                }`}
              >
                {modalLabels.commentary}
              </button>
              <button
                onClick={() => setViewMode('transcript')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'transcript'
                    ? 'bg-amber-500 text-emerald-950 font-semibold'
                    : 'text-emerald-200 hover:text-amber-100'
                }`}
              >
                <AlignLeft className="w-3 h-3" />
                <span>{modalLabels.transcript}</span>
              </button>
              <button
                onClick={() => setViewMode('scan')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'scan'
                    ? 'bg-amber-500 text-emerald-950 font-semibold'
                    : 'text-emerald-200 hover:text-amber-100'
                }`}
              >
                {modalLabels.scan}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-amber-200 hover:bg-emerald-800/80 transition-colors"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {viewMode === 'commentary' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Arabic Snippet if available */}
              {pageData.arabicSnippet && (
                <div className="p-5 rounded-xl bg-amber-50 border border-amber-200/80 shadow-sm text-center">
                  <p className="font-arabic text-xl sm:text-2xl text-emerald-950 leading-loose" dir="rtl">
                    {pageData.arabicSnippet}
                  </p>
                  {pageData.verseRange && (
                    <span className="inline-block mt-2 text-xs font-medium text-amber-800">
                      {pageData.surahName} • {pageData.verseRange}
                    </span>
                  )}
                </div>
              )}

              {/* Title & Summary */}
              <div>
                <h3 className="text-xl font-heading font-bold text-emerald-950 mb-2">
                  {pageData.sectionTitle}
                </h3>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {pageData.summary}
                </p>
              </div>

              {/* Tafseer Excerpt */}
              <div className="p-5 rounded-xl bg-emerald-900/5 border border-emerald-900/15">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  {modalLabels.exegesisHeader}
                </div>
                <blockquote className="text-stone-800 text-sm sm:text-base italic leading-relaxed border-l-4 border-amber-600 pl-4 py-1">
                  "{pageData.tafseerExcerpt}"
                </blockquote>
              </div>

              {/* Themes */}
              {pageData.keyThemes && pageData.keyThemes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                    {modalLabels.keyTopics}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {pageData.keyThemes.map((theme, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-900 border border-amber-300/60"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Archive.org scan callout */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-stone-700">
                  <p className="font-semibold text-amber-900">{modalLabels.archiveCalloutTitle}</p>
                  <p className="text-stone-600">{modalLabels.archiveCalloutDesc}</p>
                </div>
                <a
                  href={scanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-900 text-amber-100 hover:bg-emerald-800 text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                >
                  <span>{modalLabels.openInNewTab}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {viewMode === 'transcript' && (
            /* Raw Extracted Text / Transcript */
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-stone-200 text-stone-800 rounded-md">
                    data/txt/{String(currentPage).padStart(4, '0')}.txt
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    {modalLabels.transcript}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyTranscript}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
                  >
                    {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTranscript ? modalLabels.copied : modalLabels.copyText}</span>
                  </button>
                  <button
                    onClick={handleDownloadTranscript}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-900 text-amber-100 hover:bg-emerald-800 text-xs font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>{modalLabels.downloadTxt}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-inner font-mono text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                {pageTranscript}
              </div>
            </div>
          )}

          {viewMode === 'scan' && (
            /* Scanned Page View */
            <div className="h-full flex flex-col items-center justify-center space-y-4 py-4">
              <div className="w-full max-w-2xl bg-stone-100 border border-stone-300 rounded-xl p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-heading font-bold text-emerald-950">
                    {t.appTitle} ({t.volumeBadge}) — {t.page} {currentPage}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                    {modalLabels.scanIntroDesc}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={scanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-100 text-sm font-semibold shadow-md transition-all"
                  >
                    <span>{modalLabels.readOnArchive}</span>
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                  </a>
                  <button
                    onClick={() => setViewMode('commentary')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-200 text-stone-700 text-sm font-medium transition-colors"
                  >
                    {modalLabels.backToCommentary}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation & Actions */}
        <div className="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.page} {currentPage - 1}</span>
            </button>
            <span className="text-xs text-stone-500 font-medium font-mono">
              {currentPage} / 480
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= 480}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>{t.page} {currentPage + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookmarkPage(pageData)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{isBookmarked ? t.saved : t.bookmarkPage}</span>
            </button>

            <button
              onClick={() => {
                onAskAboutPage(
                  currentPage,
                  getPagePrompt(language, currentPage, pageData.sectionTitle)
                );
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-900 text-amber-200 hover:bg-emerald-800 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.askAboutPage}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

