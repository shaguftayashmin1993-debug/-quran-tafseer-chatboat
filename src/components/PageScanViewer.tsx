import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Bookmark,
  Share2,
  Maximize2
} from 'lucide-react';
import { getScanUrl, Volume1PageEntry } from '../data/tafheemVolume1Data';
import { getLocalizedPage, getLocalizedLandmarks } from '../data/localizedVolume1';
import { SupportedLanguage, TranslationStrings, getPagePrompt } from '../data/translations';

interface PageScanViewerProps {
  onAskAboutPage: (pageNumber: number, prompt: string) => void;
  onBookmarkPage: (page: Volume1PageEntry) => void;
  language: SupportedLanguage;
  t: TranslationStrings;
}

export const PageScanViewer: React.FC<PageScanViewerProps> = ({
  onAskAboutPage,
  onBookmarkPage,
  language,
  t,
}) => {
  const [targetPage, setTargetPage] = useState<number>(30);
  const [inputVal, setInputVal] = useState<string>('30');

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(480, newPage));
    setTargetPage(clamped);
    setInputVal(String(clamped));
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputVal, 10);
    if (!isNaN(num)) {
      handlePageChange(num);
    }
  };

  const currentPageData: Volume1PageEntry = getLocalizedPage(targetPage, language);
  const scanUrl = getScanUrl(targetPage);
  const landmarks = getLocalizedLandmarks(language);

  const isRTL = language === 'ur';

  const readerLabels = {
    en: {
      badge: "Manuscript & Scan Navigator",
      title: "Volume 1 Scanned Book Reader",
      desc: "Jump directly to any page from 1 to 480. Compare Maududi's thematic notes with the high-resolution scanned dual-page spreads on Archive.org.",
      prevPage: "Previous Page",
      nextPage: "Next Page",
      goToPage: "Go to Page:",
      jump: "Jump",
      milestones: "Key Canonical Milestones",
      thematicOverview: "Thematic Overview",
      topicsOnPage: "Topics on this page:",
      exegesisExcerpt: "Sayyid Maududi's Exegesis Excerpt",
      dualPageNotice: "Dual-page spread available on Archive.org",
      launchViewer: "Launch Scan Viewer",
      viewScannedPage: "View Scanned Page in Archive.org 2-Up Mode",
      includesTypography: "Includes full Urdu manuscript typography, comprehensive footnotes, and cross-reference margins.",
      openScan: "Open Page Scan",
      bookmark: "Bookmark",
    },
    hi: {
      badge: "पांडुलिपि एवं स्कैन नेविगेटर",
      title: "खंड 1 मूल पांडुलिपि रीडर",
      desc: "पृष्ठ 1 से 480 तक किसी भी पृष्ठ पर जाएं। Archive.org पर उच्च गुणवत्ता वाले दोहरे पृष्ठ स्कैन के साथ मौदूदी की तफ़सीर का अध्ययन करें।",
      prevPage: "पिछला पृष्ठ",
      nextPage: "अगला पृष्ठ",
      goToPage: "पृष्ठ संख्या:",
      jump: "जाएं",
      milestones: "प्रमुख ऐतिहासिक पड़ाव",
      thematicOverview: "विषयगत समीक्षा",
      topicsOnPage: "इस पृष्ठ के मुख्य विषय:",
      exegesisExcerpt: "सैयद मौदूदी का तफ़सीर अंश",
      dualPageNotice: "Archive.org पर दोहरा पृष्ठ स्कैन उपलब्ध है",
      launchViewer: "स्कैन व्यूअर खोलें",
      viewScannedPage: "Archive.org 2-Up मोड में स्कैन देखें",
      includesTypography: "मूल उर्दू सुलेख, विस्तृत पाद-टिप्पणियां और व्यापक संदर्भ सहित।",
      openScan: "पृष्ठ स्कैन खोलें",
      bookmark: "सहेजें",
    },
    ur: {
      badge: "اصل مطبوعہ نسخہ نیویگیٹر",
      title: "جلد اول اسکین شدہ کتاب ریڈر",
      desc: "صفحہ 1 سے 480 تک کسی بھی صفحے پر براہِ راست جائیں۔ Archive.org پر اعلیٰ معیار کے دو رخی اسکین کے ساتھ سید مودودی کی تفسیر کا موازنہ کریں۔",
      prevPage: "پچھلا صفحہ",
      nextPage: "اگلا صفحہ",
      goToPage: "صفحہ درج کریں:",
      jump: "جائیں",
      milestones: "اہم سنگ میل",
      thematicOverview: "موضوعاتی خلاصہ",
      topicsOnPage: "اس صفحے کے موضوعات:",
      exegesisExcerpt: "سید مودودی کا تفسیری اقتباس",
      dualPageNotice: "Archive.org پر مکمل اسکین نسخہ موجود ہے",
      launchViewer: "اسکین ریڈر شروع کریں",
      viewScannedPage: "Archive.org پر دو رخی مطالعہ",
      includesTypography: "اصل کتابت، جامع حواشی اور بنیادی متون کے ساتھ۔",
      openScan: "اسکین صفحہ کھولیں",
      bookmark: "محفوظ کریں",
    },
    bn: {
      badge: "পাণ্ডুলিপি ও স্ক্যান নেভিগেটর",
      title: "খণ্ড ১ মূল স্ক্যান রিডার",
      desc: "১ থেকে ৪৮০ পৃষ্ঠার যেকোনোটিতে সরাসরি প্রবেশ করুন। Archive.org-এ দুই পৃষ্ঠার উচ্চমানের স্ক্যানের সাথে মাওদূদীর তাফসীর অধ্যয়ন করুন।",
      prevPage: "পূর্ববর্তী পৃষ্ঠা",
      nextPage: "পরবর্তী পৃষ্ঠা",
      goToPage: "পৃষ্ঠা নম্বর:",
      jump: "যান",
      milestones: "প্রধান ঐতিহাসিক অধ্যায়",
      thematicOverview: "বিষয়ভিত্তিক সারসংক্ষেপ",
      topicsOnPage: "এই পৃষ্ঠার আলোচ্য বিষয়:",
      exegesisExcerpt: "সাইয়্যেদ মাওদূদীর তাফসীর উদ্ধৃতি",
      dualPageNotice: "Archive.org-এ দুই পৃষ্ঠার বিস্তার বিদ্যমান",
      launchViewer: "স্ক্যান ভিউয়ার চালু করুন",
      viewScannedPage: "Archive.org ২-আপ মোডে দেখুন",
      includesTypography: "মূল পাণ্ডুলিপির লিপি, বিস্তারিত টীকা ও তথ্যসূত্র সংবলিত।",
      openScan: "পৃষ্ঠা স্ক্যান খুলুন",
      bookmark: "সংরক্ষণ",
    },
    ta: {
      badge: "சுவடி & மூலப் பக்க வழிகாட்டி",
      title: "பாகம் 1 அசல் நூலின் ஸ்கேன் ரீடர்",
      desc: "பக்கம் 1 முதல் 480 வரை நேரடியாகச் செல்லுங்கள். Archive.org இல் உயர் தெளிவுத்திறன் கொண்ட இருபக்க விரிவுடன் மௌதூதியின் விளக்கத்தை ஒப்பிடுங்கள்.",
      prevPage: "முந்தைய பக்கம்",
      nextPage: "அடுத்த பக்கம்",
      goToPage: "பக்க எண்:",
      jump: "செல்",
      milestones: "முக்கிய மைல்கற்கள்",
      thematicOverview: "பொருள்வாரியான கண்ணோட்டம்",
      topicsOnPage: "இப்பக்கத்தின் தலைப்புகள்:",
      exegesisExcerpt: "மௌதூதியின் விரிவுரை மேற்கோள்",
      dualPageNotice: "Archive.org இல் முழுமையான இருபக்கத் தோற்றம் கிடைக்கிறது",
      launchViewer: "ஸ்கேன் பார்வையாளரைத் திற",
      viewScannedPage: "Archive.org இல் பக்கத்தைக் காண்க",
      includesTypography: "முழுமையான அடிக்குறிப்புகள் மற்றும் விளக்கக் குறிப்புகளுடன்.",
      openScan: "பக்க ஸ்கேனைத் திற",
      bookmark: "சேமி",
    },
    ml: {
      badge: "മാനുസ്ക്രിപ്റ്റ് & സ്കാൻ നാവിഗേറ്റർ",
      title: "വാല്യം 1 സ്കാൻ ചെയ്ത ബുക്ക് റീഡർ",
      desc: "1 മുതൽ 480 വരെയുള്ള ഏത് പേജിലേക്കും നേരിട്ട് പോവുക. Archive.org-ലെ ഹൈ-റെസല്യൂഷൻ സ്കാനിനൊപ്പം വ്യാഖ്യാനം താരതമ്യം ചെയ്യുക.",
      prevPage: "മുൻ പേജ്",
      nextPage: "അടുത്ത പേജ്",
      goToPage: "പേജ് നമ്പർ:",
      jump: "പോവുക",
      milestones: "പ്രധാന നാഴികക്കല്ലുകൾ",
      thematicOverview: "വിഷയ സംഗ്രഹം",
      topicsOnPage: "ഈ പേജിലെ വിഷയങ്ങൾ:",
      exegesisExcerpt: "സയ്യിദ് മൗദൂദിയുടെ തഫ്സീർ ഉദ്ധരണി",
      dualPageNotice: "Archive.org-ൽ ലഭ്യമായ ഇരട്ട പേജ് സ്കാൻ",
      launchViewer: "സ്കാൻ വ്യൂവർ തുറക്കുക",
      viewScannedPage: "Archive.org-ൽ പേജ് കാണുക",
      includesTypography: "സമഗ്രമായ അടിക്കുറിപ്പുകളും റഫറൻസുകളും ഉൾപ്പെടെ.",
      openScan: "പേജ് സ്കാൻ തുറക്കുക",
      bookmark: "സൂക്ഷിക്കുക",
    },
    kn: {
      badge: "ಹಸ್ತಪ್ರತಿ & ಸ್ಕ್ಯಾನ್ ನ್ಯಾವಿಗೇಟರ್",
      title: "ಸಂಪುಟ 1 ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಬುಕ್ ರೀಡರ್",
      desc: "1 ರಿಂದ 480 ರವರೆಗಿನ ಯಾವುದೇ ಪುಟಕ್ಕೆ ನೇರವಾಗಿ ಹೋಗಿ. Archive.org ನಲ್ಲಿ ಹೈ-ರೆಸಲ್ಯೂಶನ್ ಸ್ಕ್ಯಾನ್ ಜೊತೆ ಮೌದೂದಿ ಅವರ ಟಿಪ್ಪಣಿಗಳನ್ನು ಹೋಲಿಸಿ.",
      prevPage: "ಹಿಂದಿನ ಪುಟ",
      nextPage: "ಮುಂದಿನ ಪುಟ",
      goToPage: "ಪುಟ ಸಂಖ್ಯೆ:",
      jump: "ಹೋಗಿ",
      milestones: "ಪ್ರಮುಖ ಮೈಲಿಗಲ್ಲುಗಳು",
      thematicOverview: "ವಿಷಯ ಸಾರಾಂಶ",
      topicsOnPage: "ಈ ಪುಟದ ವಿಷಯಗಳು:",
      exegesisExcerpt: "ಸೈಯ್ಯದ್ ಮೌದೂದಿಯವರ ತಫ್ಸೀರ್ ಉದ್ಧರಣ",
      dualPageNotice: "Archive.org ನಲ್ಲಿ ಡ್ಯುಯಲ್-ಪೇಜ್ ಸ್ಕ್ಯಾನ್ ಲಭ್ಯವಿದೆ",
      launchViewer: "ಸ್ಕ್ಯಾನ್ ವೀಕ್ಷಕವನ್ನು ತೆರೆಯಿರಿ",
      viewScannedPage: "Archive.org ನಲ್ಲಿ ಪುಟ ವೀಕ್ಷಿಸಿ",
      includesTypography: "ಸಮಗ್ರ ಅಡಿಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ಉಲ್ಲೇಖಗಳೊಂದಿಗೆ.",
      openScan: "ಪುಟ ಸ್ಕ್ಯಾನ್ ತೆರೆಯಿರಿ",
      bookmark: "ಉಳಿಸಿ",
    },
  }[language] || {
    badge: "Manuscript & Scan Navigator",
    title: "Volume 1 Scanned Book Reader",
    desc: "Jump directly to any page from 1 to 480. Compare Maududi's thematic notes with the high-resolution scanned dual-page spreads on Archive.org.",
    prevPage: "Previous Page",
    nextPage: "Next Page",
    goToPage: "Go to Page:",
    jump: "Jump",
    milestones: "Key Canonical Milestones",
    thematicOverview: "Thematic Overview",
    topicsOnPage: "Topics on this page:",
    exegesisExcerpt: "Sayyid Maududi's Exegesis Excerpt",
    dualPageNotice: "Dual-page spread available on Archive.org",
    launchViewer: "Launch Scan Viewer",
    viewScannedPage: "View Scanned Page in Archive.org 2-Up Mode",
    includesTypography: "Includes full Urdu manuscript typography, comprehensive footnotes, and cross-reference margins.",
    openScan: "Open Page Scan",
    bookmark: "Bookmark",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          {readerLabels.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-emerald-950">
          {readerLabels.title}
        </h2>
        <p className="text-sm sm:text-base text-stone-600">
          {readerLabels.desc}
        </p>
      </div>

      {/* Control Bar: Slider + Direct Input + Prev/Next */}
      <div className="bg-white p-6 rounded-2xl border border-amber-900/15 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quick Step Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(targetPage - 1)}
              disabled={targetPage <= 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{readerLabels.prevPage}</span>
            </button>
            <button
              onClick={() => handlePageChange(targetPage + 1)}
              disabled={targetPage >= 480}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 transition-colors"
            >
              <span>{readerLabels.nextPage}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Direct page input form */}
          <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-600">{readerLabels.goToPage}</span>
            <input
              type="number"
              min="1"
              max="480"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-20 px-3 py-1.5 text-center text-sm font-bold font-mono rounded-lg border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none text-stone-900"
            />
            <span className="text-xs text-stone-400">/ 480</span>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-200 text-xs font-semibold shadow-xs transition-colors"
            >
              {readerLabels.jump}
            </button>
          </form>
        </div>

        {/* Range Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="1"
            max="480"
            value={targetPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
          />
          <div className="flex justify-between text-[11px] text-stone-400 font-mono">
            <span>{t.page} 1 (Muqaddimah)</span>
            <span>{t.page} 35 (Al-Fatihah)</span>
            <span>{t.page} 270 (Ayat al-Kursi)</span>
            <span>{t.page} 480 (Vol. 1)</span>
          </div>
        </div>

        {/* Landmark Shortcuts */}
        <div className="pt-2 border-t border-stone-100">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            {readerLabels.milestones}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {landmarks.map((mark, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(mark.page)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors border ${
                  targetPage === mark.page
                    ? 'bg-amber-500 text-emerald-950 font-bold border-amber-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {mark.name} ({t.page} {mark.page})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Page Showcase */}
      <div className="bg-white rounded-2xl border border-amber-900/15 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header of selected page */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-md bg-emerald-900 text-amber-200 font-mono text-xs font-bold">
                  {t.page} {targetPage}
                </span>
                {currentPageData.surahName && (
                  <span className="text-xs font-bold text-amber-800">
                    {currentPageData.surahName} {currentPageData.verseRange && `• ${currentPageData.verseRange}`}
                  </span>
                )}
                {currentPageData.surahNameArabic && (
                  <span className="font-arabic text-sm text-emerald-800" dir="rtl">
                    {currentPageData.surahNameArabic}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-emerald-950">
                {currentPageData.sectionTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onBookmarkPage(currentPageData)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-stone-200 hover:bg-stone-50 transition-colors text-stone-700"
              >
                <Bookmark className="w-4 h-4 text-amber-700" />
                <span>{readerLabels.bookmark}</span>
              </button>

              <button
                onClick={() =>
                  onAskAboutPage(
                    targetPage,
                    getPagePrompt(language, targetPage, currentPageData.sectionTitle)
                  )
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-900 text-amber-200 hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.askAboutPage}</span>
              </button>
            </div>
          </div>

          {/* Arabic snippet if present */}
          {currentPageData.arabicSnippet && (
            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-center">
              <p className="font-arabic text-2xl sm:text-3xl text-emerald-950 leading-loose" dir="rtl">
                {currentPageData.arabicSnippet}
              </p>
            </div>
          )}

          {/* Exegesis & Summary or Full Transcript */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {readerLabels.thematicOverview}
                </h4>
                <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  data/txt/{String(targetPage).padStart(4, '0')}.txt
                </span>
              </div>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {currentPageData.summary}
              </p>

              {currentPageData.keyThemes && (
                <div className="pt-2">
                  <div className="text-xs font-semibold text-stone-500 mb-1.5">
                    {readerLabels.topicsOnPage}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPageData.keyThemes.map((th, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200"
                      >
                        {th}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/5 border border-emerald-900/15 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
                  {readerLabels.exegesisExcerpt}
                </h4>
                <blockquote className="text-sm text-stone-800 italic leading-relaxed border-l-4 border-amber-600 pl-3">
                  "{currentPageData.tafseerExcerpt}"
                </blockquote>
              </div>

              {/* Scanned page portal button */}
              <div className="mt-4 pt-3 border-t border-emerald-900/10 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  {readerLabels.dualPageNotice}
                </span>
                <a
                  href={scanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 text-amber-200 hover:bg-emerald-800 text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>{readerLabels.launchViewer}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Big CTA Banner to view scan */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 to-emerald-900 text-amber-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-bold text-base sm:text-lg text-amber-200">
                {readerLabels.viewScannedPage} ({t.page} {targetPage})
              </p>
              <p className="text-xs text-emerald-200/80">
                {readerLabels.includesTypography}
              </p>
            </div>
          </div>

          <a
            href={scanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition-all whitespace-nowrap"
          >
            <span>{readerLabels.openScan} ({t.page} {targetPage})</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
