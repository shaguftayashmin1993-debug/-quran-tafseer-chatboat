import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  VOLUME_1_PAGES,
  SURAH_OVERVIEWS,
  SAMPLE_QUESTIONS,
  getScanUrl,
  Volume1PageEntry
} from './src/data/tafheemVolume1Data.ts';
import { getLocalizedPage } from './src/data/localizedVolume1.ts';
import { VOLUME_1_PAGE_TEXTS } from './src/data/tafheemPagesText.ts';
import {
  QURAN_SURAHS,
  TAFSEER_BOOKS,
  NOTABLE_AYAHS,
} from './src/data/quranMetadata.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gen AI client with User-Agent header
const rawKey = process.env.GEMINI_API_KEY || '';
const hasValidKey = Boolean(
  rawKey &&
  rawKey !== 'MY_GEMINI_API_KEY' &&
  !rawKey.startsWith('MY_') &&
  rawKey.trim().length > 10
);

const ai = hasValidKey
  ? new GoogleGenAI({
      apiKey: rawKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Multilingual concept keywords mapping directly to Volume 1 pages
const MULTILINGUAL_CONCEPT_MAP: { keywords: string[]; targetPages: number[] }[] = [
  {
    // Ayat al-Kursi (The Throne Verse)
    keywords: [
      'kursi', 'throne', '2:255', 'कुर्सी', 'आयत-उल-कुर्सी', 'आयतुल', 'آیت الکرسی', 'الکرسی',
      'কুরসী', 'আয়াতুল কুরসী', 'குர்ஸி', 'ஆயத்துல் குர்ஸி', 'കുർസി', 'ആയത്തുൽ കുർസി',
      'ಕುರ್ಸಿ', 'ಆಯತುಲ್ ಕುರ್ಸಿ'
    ],
    targetPages: [270, 274],
  },
  {
    // Prohibition of Riba / Usury vs Zakat
    keywords: [
      'riba', 'usury', 'interest', 'zakat', 'सूद', 'रिबा', 'ज़कात', 'سود', 'ربا', 'زکوٰۃ',
      'সুদ', 'রিবা', 'যাকাত', 'வட்டி', 'ரிபா', 'ஜகாத்', 'പലിശ', 'രിബാ', 'സകാത്ത്',
      'ಬಡ್ಡಿ', 'ರಿಬಾ', 'ಝಕಾತ್'
    ],
    targetPages: [302, 312],
  },
  {
    // The Parable of the Cow (Baqarah)
    keywords: [
      'cow', 'heifer', 'baqarah', 'गाय', 'बक़रह', 'بقرہ', 'گائے', 'গাভী', 'গরু', 'বাকারা',
      'பசு', 'பகரா', 'പശു', 'ബഖറ', 'ಹಸು', 'ಬಖರಾ'
    ],
    targetPages: [98, 84],
  },
  {
    // Creation of Adam, Khalifah, and Iblis
    keywords: [
      'adam', 'khalifah', 'vicegerent', 'iblis', 'आदम', 'ख़लीफ़ा', 'इब्लीस', 'آدم', 'خلیفہ', 'ابلیس',
      'আদম', 'খলিফা', 'ইবলিস', 'ஆதம்', 'கலீஃபா', 'இப்லீஸ்', 'ആദം', 'ഖലീഫ', 'ഇബ്ലീസ്',
      'ಆದಮ್', 'ಖಲೀಫ', 'ಇಬ್ಲೀಸ್'
    ],
    targetPages: [63, 68],
  },
  {
    // Surah Al-Fatihah, Praise, Iyyaka Na'budu
    keywords: [
      'fatihah', 'opening', 'na\'budu', 'faatiha', 'फातिहा', 'इय्याका नअबुदु', 'فاتحہ', 'ایاک نعبد',
      'ফাতিহা', 'ইয়্যাকা না\'বুদু', 'பாத்திஹா', 'இய்யாக நஃபுது', 'ഫാതിഹ', 'ഇയ്യാക നഅ്ബുദു',
      'ಫಾತಿಹಾ', 'ಇಯ್ಯಾಕ ನಅ್ಬುದು'
    ],
    targetPages: [35, 40, 44],
  },
  {
    // Battle of Uhud in Ali 'Imran
    keywords: [
      'uhud', 'battle of uhud', 'imran', 'उहुद', 'जंग-ए-उहुद', 'आले इमरान', 'احد', 'غزوہ احد', 'آل عمران',
      'ওহুদ', 'উহুদের যুদ্ধ', 'আলে ইমরান', 'உஹுத்', 'ஆல இம்ரான்', 'ഉഹുദ്', 'ആലുഇംറാൻ', 'ಉಹುದ್', 'ಆಲಿ ಇಮ್ರಾನ್'
    ],
    targetPages: [445, 458],
  },
  {
    // Muqaddimah / Introduction to Quran
    keywords: [
      'muqaddimah', 'introduction', 'guidelines', 'मुक़द्दमा', 'भूमिका', 'مقدمہ', 'اصول',
      'মুকাদ্দিমাহ', 'ভূমিকা', 'முகத்திமா', 'முன்னுரை', 'മുഖദ്ദിമ', 'ಮುಖದ್ದಿಮಾ', 'ಮುನ್ನುಡಿ'
    ],
    targetPages: [30, 5, 18],
  },
  {
    // Righteousness (Ayat al-Birr 2:177)
    keywords: [
      'birr', 'righteousness', '2:177', 'नेकी', 'बिर्र', 'نیکی', 'بر', 'সৎকর্ম', 'বিরর',
      'நன்மை', 'നന്മ', 'ಸದಾಚಾರ'
    ],
    targetPages: [180],
  },
  {
    // Ramadan Fasting (2:183-187)
    keywords: [
      'fasting', 'ramadan', 'roza', '2:183', 'रोज़ा', 'रमज़ान', 'روزہ', 'رمضان',
      'রোজা', 'রমজান', 'நோன்பு', 'ரமலான்', 'വ്രതം', 'റമദാൻ', 'ಉಪವಾಸ', 'ರಂಜಾನ್'
    ],
    targetPages: [194],
  },
  {
    // Jesus / Isa and Maryam in Ali 'Imran
    keywords: [
      'jesus', 'isa', 'maryam', 'mary', 'ईसा', 'मरयम', 'عیسیٰ', 'مریم',
      'ঈসা', 'মরিয়ম', 'ஈஸா', 'மர்யம்', 'ഈസാ', 'മറിയം', 'ಈಸಾ', 'ಮರ್ಯಮ್'
    ],
    targetPages: [350, 364],
  }
];

// Helper: TF-IDF weighted retrieval across Volume 1 Pages and Full Text Transcripts
function retrieveContext(query: string, maxResults = 4): { pages: Volume1PageEntry[]; contextStr: string } {
  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/[\s,?.!:;()"]+/).filter((t) => t.length > 1);

  // Score each page in the dataset
  const scored = VOLUME_1_PAGES.map((page) => {
    let score = 0;

    // Check multilingual concept matching
    for (const concept of MULTILINGUAL_CONCEPT_MAP) {
      if (concept.targetPages.includes(page.page)) {
        for (const kw of concept.keywords) {
          if (queryLower.includes(kw.toLowerCase())) {
            score += 20;
            break;
          }
        }
      }
    }

    // Check specific Surah mention
    if (page.surahName && queryLower.includes(page.surahName.toLowerCase())) score += 6;
    if (page.verseRange && queryLower.includes(page.verseRange.toLowerCase())) score += 8;

    // Section title matches
    if (queryTokens.some((t) => page.sectionTitle.toLowerCase().includes(t))) score += 4;

    // Key themes matches
    for (const theme of page.keyThemes) {
      if (queryTokens.some((t) => theme.toLowerCase().includes(t))) score += 3;
    }

    // Summary and tafseer matches
    for (const token of queryTokens) {
      if (page.summary.toLowerCase().includes(token)) score += 2;
      if (page.tafseerExcerpt.toLowerCase().includes(token)) score += 1;
    }

    // Full text transcript match if available
    const pageTextRecord = VOLUME_1_PAGE_TEXTS[page.page];
    if (pageTextRecord) {
      const textLower = pageTextRecord.text.toLowerCase();
      for (const token of queryTokens) {
        if (textLower.includes(token)) score += 2;
      }
    }

    // Direct page number match (e.g. "page 40", "p. 270", "0030", "صفحہ 40", "पृष्ठ 40")
    const pageNumRegex = new RegExp(`\\b(page|p\\.?|صفحہ|पृष्ठ|পৃষ্ঠা|பக்கம்|പേജ്|ಪುಟ)\\s*0*${page.page}\\b`, 'i');
    if (pageNumRegex.test(queryLower) || queryLower.includes(String(page.page))) {
      score += 15;
    }

    return { page, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // If no good match, return the first few important canonical sections (Fatihah, Ayat al-Kursi, etc.)
  let topPages = scored.filter((s) => s.score > 0).slice(0, maxResults).map((s) => s.page);
  if (topPages.length === 0) {
    topPages = VOLUME_1_PAGES.slice(0, maxResults);
  }

  // Construct context block
  let contextStr = '';
  for (const p of topPages) {
    contextStr += `\n--- [Page ${p.page}] ---\n`;
    if (p.surahName) {
      contextStr += `Surah: ${p.surahName} (${p.verseRange || ''})\n`;
    }
    contextStr += `Title: ${p.sectionTitle}\n`;
    contextStr += `Summary: ${p.summary}\n`;
    contextStr += `Tafseer Notes: "${p.tafseerExcerpt}"\n`;

    const fullText = VOLUME_1_PAGE_TEXTS[p.page];
    if (fullText) {
      contextStr += `Full Page Transcript: "${fullText.text.slice(0, 350)}..."\n`;
    }
    contextStr += `Scan URL: ${p.scanUrl}\n`;
  }

  return { pages: topPages, contextStr };
}

// Helper to identify language script in text
function getScriptMatchCount(text: string, lang: string): number {
  switch (lang) {
    case 'hi': // Devanagari (Hindi)
      return (text.match(/[\u0900-\u097F]/g) || []).length;
    case 'ur': // Arabic / Urdu
      return (text.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
    case 'bn': // Bengali / Bangla
      return (text.match(/[\u0980-\u09FF]/g) || []).length;
    case 'ta': // Tamil
      return (text.match(/[\u0B80-\u0BFF]/g) || []).length;
    case 'ml': // Malayalam
      return (text.match(/[\u0D00-\u0D7F]/g) || []).length;
    case 'kn': // Kannada
      return (text.match(/[\u0C80-\u0CFF]/g) || []).length;
    case 'en':
    default:
      return (text.match(/[A-Za-z]/g) || []).length;
  }
}

// Auto-detect script if user typed in a specific language script
function detectScriptFromText(text: string): string | null {
  if ((text.match(/[\u0900-\u097F]/g) || []).length >= 3) return 'hi';
  if ((text.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length >= 3) return 'ur';
  if ((text.match(/[\u0980-\u09FF]/g) || []).length >= 3) return 'bn';
  if ((text.match(/[\u0B80-\u0BFF]/g) || []).length >= 3) return 'ta';
  if ((text.match(/[\u0D00-\u0D7F]/g) || []).length >= 3) return 'ml';
  if ((text.match(/[\u0C80-\u0CFF]/g) || []).length >= 3) return 'kn';
  return null;
}

// Localized Fallback Exegesis Generator (guarantees 100% answer in the selected language without English leakage)
function generateLocalizedFallback(
  lang: string,
  message: string,
  pages: Volume1PageEntry[]
): string {
  const topPage = pages[0] || VOLUME_1_PAGES[0];
  const pageNum = topPage.page;
  const l = lang.toLowerCase();

  // Multi-topic localized commentary bank for Volume 1
  if (l === 'hi') {
    const isKursi = message.toLowerCase().includes('kursi') || message.includes('कुर्सी') || pageNum === 270;
    const isRiba = message.toLowerCase().includes('riba') || message.includes('सूद') || pageNum === 302;
    const isUhud = message.toLowerCase().includes('uhud') || message.includes('उहुद') || pageNum === 445;
    const isFatihah = message.toLowerCase().includes('fatihah') || message.includes('फातिहा') || pageNum <= 46;

    let topicExegesis = '';
    if (isKursi) {
      topicExegesis = `**आयत-उल-कुर्सी (सूरह अल-बक़रह: आयत 255) की विस्तृत व्याख्या [पृष्ठ 270]:**
1. **अल्लाह का जीवित और सर्व-संरक्षक होना (अल-हय्यु, अल-क़य्यूम):** अल्लाह ही सदा जीवित रहने वाला है और संपूर्ण ब्रह्मांड का अस्तित्व उसी के सहारे टिका हुआ है।
2. **मानवीय कमज़ोरियों से मुक्ति:** उसे न ऊँघ आती है और न ही नींद। थकान और लापरवाही का उसकी ज़ात में कोई स्थान नहीं है।
3. **'कुर्सी' की हक़ीक़त:** मौलाना मौदूदी स्पष्ट करते हैं कि 'कुर्सी' अल्लाह की संप्रभु सत्ता, प्रशासनिक पकड़ और सर्वव्यापी ज्ञान का प्रतीक है।
4. **स्वायत्त शफ़ाअत (सिफ़ारिश) का खंडन:** अल्लाह की अनुमति के बिना कोई भी उसके दरबार में सिफ़ारिश नहीं कर सकता, जिससे बहुदेववाद (शिर्क) की जड़ें कट जाती हैं।`;
    } else if (isRiba) {
      topicExegesis = `**सूद (रिबा) की पाबंदी और ज़कात का आर्थिक न्याय [पृष्ठ 302]:**
1. **पूंजीवादी शोषण का अंत:** मौदूदी साहब व्याख्या करते हैं कि सूदखोरी समाज में स्वार्थ, क्रूरता और असंतुलन पैदा करती है, जहाँ अमीर बिना श्रम के गरीब का शोषण करता है।
2. **ज़कात का कल्याणकारी दर्शन:** इस्लाम में ज़कात के ज़रिये धन को ज़रूरतमंदों तक पहुँचाया जाता है ताकि समाज में प्रेम, सहयोग और आर्थिक न्याय स्थापित हो सके।
3. **ईश्वरीय युद्ध की घोषणा:** क़ुरआन सूदखोरों को अल्लाह और उसके रसूल के विरुद्ध युद्ध की कड़ी चेतावनी देता है।`;
    } else if (isUhud) {
      topicExegesis = `**जंग-ए-उहुद के ऐतिहासिक और नैतिक सबक (सूरह आले इमरान) [पृष्ठ 445]:**
1. **अनुशासन और आज्ञाकारिता:** उहुद में तीरंदाज़ों द्वारा मोर्चे को छोड़ने की भूल से साबित हुआ कि भौतिक लाभ के लिए अनुशासन तोड़ना पराजय का कारण बनता है।
2. **ईमान की परीक्षा:** विजय केवल संख्या बल या हथियारों से नहीं मिलती, बल्कि अल्लाह पर अटूट विश्वास और शुद्ध नीयत से हासिल होती है।
3. **सहानुभूतिपूर्ण नेतृत्व:** हार के बावजूद अल्लाह ने पैग़ंबर मुहम्मद (स.) को साथियों के साथ नरमी बरतने और मशविरा (शूरा) जारी रखने का हुक्म दिया।`;
    } else if (isFatihah) {
      topicExegesis = `**सूरह अल-फातिहा का सार और 'इय्याका नअबुदु' का अर्थ [पृष्ठ 40]:**
1. **क़ुरआन का सार (उम्मुल किताब):** सूरह अल-फातिहा पूरे क़ुरआन का सार और एक ईश्वरीय प्रार्थना है; यह बंदे की दुआ है और शेष क़ुरआन उसका ईश्वरीय उत्तर है।
2. **इय्याका नअबुदु व इय्याका नस्तईन:** "हम केवल तेरी ही इबादत करते हैं और केवल तुझसे ही सहायता मांगते हैं।" यह आयत केवल अल्लाह के सामने झुकने और हर प्रकार की ग़ुलामी से आज़ाद होने का घोषणापत्र है।
3. **सिरात-ए-मुस्तक़ीम (सीधा मार्ग):** यह वह मार्ग है जिस पर अल्लाह ने अपने पैग़ंबरों और नेक बंदों को अनुग्रहित किया।`;
    } else {
      topicExegesis = `**तफ़ीम-उल-क़ुरआन (खंड 1) के अनुसार विषयगत विश्लेषण [पृष्ठ ${pageNum}]:**
1. **ईश्वरीय मार्गदर्शन (हिदायत):** मौलाना मौदूदी स्पष्ट करते हैं कि क़ुरआन केवल रस्मों या मंत्रों की किताब नहीं है, बल्कि मानव चरित्र, सामाजिक न्याय और व्यक्तिगत सदाचार का क्रांतिकारी घोषणापत्र है।
2. **तौहीद का व्यावहारिक प्रभाव:** जब मनुष्य स्वीकार करता है कि प्रभुत्व केवल अल्लाह का है, तो वह सांसारिक अहंकार और शोषण से मुक्त होकर न्याय के मार्ग पर चलता है।
3. **प्रामाणिक संदर्भ:** इस विषय की संपूर्ण व्याख्या तफ़ीम-उल-क़ुरआन के पृष्ठ ${pageNum} पर दी गई है।`;
    }

    const sectionList = pages
      .map((p) => `• **पृष्ठ ${p.page}** (${p.surahName || 'मुक़द्दमा'}): [मूल पांडुलिपि स्कैन देखें](${p.scanUrl})`)
      .join('\n');

    return `### तफ़ीम-उल-क़ुरआन (खंड 1) से प्रामाणिक व्याख्या

आपके प्रश्न **"${message}"** के संबंध में मौलाना सैयद अबुल आला मौदूदी की तफ़सीर:

${topicExegesis}

---

### उद्धृत पृष्ठ एवं मूल पाण्डुलिपि (खंड 1):
${sectionList}

*(मूल पाण्डुलिपि पढ़ने के लिए ऊपर दिए गए पृष्ठ लिंक पर क्लिक करें। संपूर्ण उत्तर केवल हिन्दी में दिया गया है)।*`;
  }

  if (l === 'ur') {
    const isKursi = message.toLowerCase().includes('kursi') || message.includes('کرسی') || pageNum === 270;
    const isRiba = message.toLowerCase().includes('riba') || message.includes('سود') || pageNum === 302;
    const isUhud = message.toLowerCase().includes('uhud') || message.includes('احد') || pageNum === 445;
    const isFatihah = message.toLowerCase().includes('fatihah') || message.includes('فاتحہ') || pageNum <= 46;

    let topicExegesis = '';
    if (isKursi) {
      topicExegesis = `**آیت الکرسی (سورۃ البقرہ: آیت 255) کا تفسیری جائزہ [صفحہ 270]:**
1. **الحی اور القیوم:** اللہ تعالیٰ بذاتِ خود زندہ ہے اور کائنات کے تمام نظام کو اکیلے سنبھالے ہوئے ہے۔ کائنات کا کوئی ذرہ اس کے سہارے کے بغیر قائم نہیں رہ سکتا۔
2. **بشری کمزوریوں کی نفی:** اسے نہ اونگھ آتی ہے اور نہ نیند۔ کائنات کا نظام چلانے میں وہ ذرہ برابر تھکن یا غفلت کا شکار نہیں ہوتا۔
3. **وسعتِ کرسی:** 'کرسی' سے مراد اللہ تعالیٰ کا اقتدارِ اعلیٰ، انتظامی گرفت اور اس کا علمِ محیط ہے جو آسمانوں اور زمین پر چھایا ہوا ہے۔
4. **شفاعت کی حقیقت:** اللہ کے دربار میں اس کی اجازت کے بغیر کوئی سفارش نہیں کر سکتا، جس سے شرک اور جھوٹی امیدوں کی جڑیں کٹ جاتی ہیں۔`;
    } else if (isRiba) {
      topicExegesis = `**حرمتِ سود اور نظامِ زکوٰۃ کا معاشی موازنہ [صفحہ 302]:**
1. **سود پر مبنی معاشی استحصال:** سید مودودیؒ وضاحت فرماتے ہیں کہ سود انسانوں میں بخل، حرص اور ظلم پیدا کرتا ہے جہاں سرمایہ دار غریب کے خون پسینے کی کمائی لوٹتا ہے۔
2. **زکوٰۃ کا ہمدردانہ فلسفہ:** زکوٰۃ اور انفاق مال کو معاشرے کے محروم طبقات تک پہنچا کر باہمی اخوت اور فلاحی ریاست کی بنیاد رکھتے ہیں۔
3. **اعلانِ جنگ:** سود خوروں کو قرآن مجید میں اللہ اور اس کے رسول کی جانب سے کھلی جنگ کا انتباہ دیا گیا ہے۔`;
    } else if (isUhud) {
      topicExegesis = `**غزوۂ احد کے نتائج اور تفسیری اسباق (سورۃ آل عمران) [صفحہ 445]:**
1. **اطاعت اور نظم و ضبط:** تیر اندازوں کے دستے کی معمولی لغزش نے یہ ثابت کیا کہ دنیوی مال و غنیمت کی خاطر احکام کی نافرمانی فتح کو شکست میں بدل سکتی ہے۔
2. **آزمائش اور تزکیہ:** فتح کا دارومدار مادی اسباب پر نہیں بلکہ اخلاص، تقویٰ اور اللہ پر غیر متزلزل توکل پر ہے۔
3. **رحمت و مشاورت:** شکست کے بعد بھی اللہ نے رسول اللہ ﷺ کو اپنے ساتھیوں سے نرمی برتنے اور باہمی مشاورت (شوریٰ) جاری رکھنے کی تاکید فرمائی۔`;
    } else if (isFatihah) {
      topicExegesis = `**سورۃ الفاتحہ کا خلاصہ اور 'ایاک نعبد' کا مفہوم [صفحہ 40]:**
1. **ام الکتاب (قرآن کا نچوڑ):** سورۃ الفاتحہ پورے قرآن کا پیش لفظ اور دعا ہے؛ یہ بندے کا التجا نامہ ہے اور پورا قرآن اس کا جواب ہے۔
2. **ایاک نعبد و ایاک نستعین:** "ہم صرف تیری ہی بندگی کرتے ہیں اور صرف تجھ ہی سے مدد مانگتے ہیں۔" یہ توحیدِ خالص اور ہر طاغوتی طاقت کی نفی کا اعلان ہے۔
3. **صراطِ مستقیم:** یہ وہ سیدھا راستہ ہے جس پر انبیاء، صدیقین، شہداء اور صالحین گامزن رہے۔`;
    } else {
      topicExegesis = `**تفہیم القرآن (جلد اول) کے مطابق موضوعاتی تشریح [صفحہ ${pageNum}]:**
1. **ہدایت کا الٰہی ضابطہ:** سید مودودیؒ واضح کرتے ہیں کہ قرآن مجید محض تلاوت یا رسم کی کتاب نہیں بلکہ انسانی کردار اور معاشرے کی اصلاح کا انقلابی پیغام ہے۔
2. **توحید کا عملی اثر:** جب انسان یہ تسلیم کر لیتا ہے کہ حاکمیتِ مطلقہ صرف اللہ کے لیے ہے، تو وہ ظلم اور خود غرضی سے نجات پا کر عدل کا علمبردار بنتا ہے۔
3. **مستند تفسیری حوالہ:** اس مبحث کی مفصل بحث تفہیم القرآن جلد اول کے صفحہ ${pageNum} پر ملاحظہ کی جا سکتی ہے۔`;
    }

    const sectionList = pages
      .map((p) => `• **صفحہ ${p.page}** (${p.surahName || 'مقدمہ'}): [اصل اسکین شدہ صفحہ دیکھیں](${p.scanUrl})`)
      .join('\n');

    return `### تفہیم القرآن (جلد اول) سے مستند تفسیری بیان

آپ کے سوال **"${message}"** کے جواب میں سید ابوالاعلیٰ مودودیؒ کا تفسیری جائزہ:

${topicExegesis}

---

### حوالہ شدہ صفحات (جلد اول):
${sectionList}

*(اصل اسکین شدہ صفحہ پڑھنے کے لیے اوپر دیے گئے لنک پر کلک کریں۔ تمام جواب خالصتاً اردو زبان میں فراہم کیا گیا ہے)*`;
  }

  if (l === 'bn') {
    const isKursi = message.toLowerCase().includes('kursi') || message.includes('কুরসী') || pageNum === 270;
    const isRiba = message.toLowerCase().includes('riba') || message.includes('সুদ') || pageNum === 302;
    const isUhud = message.toLowerCase().includes('uhud') || message.includes('ওহুদ') || pageNum === 445;
    const isFatihah = message.toLowerCase().includes('fatihah') || message.includes('ফাতিহা') || pageNum <= 46;

    let topicExegesis = '';
    if (isKursi) {
      topicExegesis = `**আয়াতুল কুরসী (সূরা আল-বাকারা: আয়াত ২৫৫)-এর বিশদ তাফসীর [পৃষ্ঠা ২৭০]:**
১. **আল্লাহর চিরঞ্জীব ও সার্বভৌম সত্তা (আল-হাইয়্যুল কাইয়্যূম):** আল্লাহ নিজেই চিরঞ্জীব এবং নিখিল সৃষ্টির ধারক ও পালনকর্তা।
২. **মানবীয় দুর্বলতা থেকে পবিত্রতা:** তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করতে পারে না। তিনি ক্লান্তিহীনভাবে এই মহাবিশ্ব পরিচালনা করছেন।
৩. **'কুরসী'র প্রকৃত অর্থ:** সাইয়েদ মওদূদী ব্যাখ্যা করেন যে 'কুরসী' আল্লাহর সর্বব্যাপী কর্তৃত্ব, নিরঙ্কুশ সার্বভৌমত্ব ও অসীম জ্ঞানের প্রতীক।
৪. **সুপারিশের (শাফায়াত) সত্যতা:** আল্লাহর অনুমতি ছাড়া কেউ কারও জন্য সুপারিশ করতে পারবে না, যা শিরকের ভিত্তিকে সমূলে উৎপাটন করে।`;
    } else if (isRiba) {
      topicExegesis = `**সুদ (রিবা) নিষিদ্ধকরণ ও যাকাতের অর্থনৈতিক সুবিচার [পৃষ্ঠা ৩০২]:**
১. **পুঁজিবাদী শোষণের অবসান:** সুদ মানুষের মনে স্বার্থপরতা ও নিষ্ঠুরতা জন্ম দেয়, যেখানে ধনী ব্যক্তি শ্রমহীনভাবে দরিদ্রকে শোষণ করে।
২. **যাকাতের কল্যাণমুখী দর্শন:** যাকাত ও দানের মাধ্যমে সম্পদ সমাজের অভাবীদের মাঝে পুনর্বণ্টন করা হয়, যা সামাজিক ন্যায়বিচার ও ভ্রাতৃত্ব গড়ে তোলে।
৩. **আল্লাহর বিরুদ্ধে যুদ্ধের ঘোষণা:** কুরআন স্পষ্টভাবে সুদখোরদের বিরুদ্ধে আল্লাহ ও তাঁর রাসূলের যুদ্ধের হুঁশিয়ারি দেয়।`;
    } else if (isUhud) {
      topicExegesis = `**ওহুদের যুদ্ধের ঐতিহাসিক ও নৈতিক শিক্ষা (সূরা আলে ইমরান) [পৃষ্ঠা ৪৪৫]:**
১. **শৃঙ্খলা ও আনুগত্য:** তীরন্দাজদের নির্দেশ অমান্য করার ভুল দেখিয়ে দেয় যে পার্থিব লাভের কারণে শৃঙ্খলা ভঙ্গ করলে পরাজয় অনিবার্য হয়।
২. **ঈমানের কঠোর পরীক্ষা:** বিজয় কেবল সৈন্যসংখ্যা বা অস্ত্রের শক্তিতে নয়, বরং আল্লাহর প্রতি অবিচল আনুগত্য ও আত্মত্যাগে নির্ভর করে।
৩. **নেতৃত্বের সহমর্মিতা:** সাময়িক বিপর্যয় সত্ত্বেও আল্লাহ রাসূলুল্লাহ (সা.)-কে তাঁর সাথীদের ক্ষমা করতে এবং পরামর্শ (শুরা) অব্যাহত রাখতে নির্দেশ দেন।`;
    } else if (isFatihah) {
      topicExegesis = `**সূরা আল-ফাতিহার সারসংক্ষেপ ও 'ইয়্যাকা না'বুদু'-এর শিক্ষা [পৃষ্ঠা ৪০]:**
১. **কুরআনের মূল নির্যাস (উম্মুল কিতাব):** সূরা আল-ফাতিহা হলো বান্দার পক্ষ থেকে রবের কাছে করা এক গভীর প্রার্থনা, আর সমগ্র কুরআন হলো তারই খোদায়ী জবাব।
২. **ইয়্যাকা না'বুদু ওয়া ইয়্যাকা নাস্তাঈন:** "আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই সাহায্য চাই।" এটি তাওহীদের মূল স্তম্ভ ও সকল তাগুতের দাসত্ব থেকে মুক্তির ঘোষণা।
৩. **সিরাতাল মুস্তাকীম (সরল পথ):** এটি সেই পথ যার ওপর আল্লাহ তাঁর নবী ও সৎকর্মশীল বান্দাদের অনুগ্রহ দান করেছেন।`;
    } else {
      topicExegesis = `**তাফহীমুল কুরআন (খণ্ড ১)-এর আলোকেই বিষয়ভিত্তিক পর্যালোচনা [পৃষ্ঠা ${pageNum}]:**
১. **ঐশী হেদায়াত:** সাইয়েদ মওদূদী ব্যাখ্যা করেছেন যে, কুরআন কেবল কিছু ধর্মীয় রীতির বই নয়, বরং মানুষের চরিত্র, সমাজ ও রাষ্ট্রকে সত্যের ভিত্তিতে গড়ার এক বিপ্লবী জীবনবিধান।
২. **তাওহীদের সামাজিক রূপ:** মানুষ যখন আল্লাহর সার্বভৌমত্ব স্বীকার করে, তখন সে সব ধরনের জুলুম ও অন্যায় থেকে মুক্ত হয়ে ন্যায়ের অনুসারী হয়।
৩. **পৃষ্ঠা রেফারেন্স:** এই বিষয়ের বিস্তারিত আলোচনা তাফহীমুল কুরআনের পৃষ্ঠা ${pageNum}-এ বিশদভাবে লিপিবদ্ধ রয়েছে।`;
    }

    const sectionList = pages
      .map((p) => `• **পৃষ্ঠা ${p.page}** (${p.surahName || 'মুকাদ্দিমাহ'}): [আসল স্ক্যান দেখুন](${p.scanUrl})`)
      .join('\n');

    return `### তাফহীমুল কুরআন (খণ্ড ১) থেকে প্রামাণিক তাফসীর

আপনার প্রশ্ন **"${message}"**-এর প্রেক্ষিতে সাইয়েদ আবুল আ'লা মওদূদীর তাফসীর:

${topicExegesis}

---

### উদ্ধৃত পৃষ্ঠাসমূহ ও স্ক্যান কপি (খণ্ড ১):
${sectionList}

*(মূল স্ক্যান করা পৃষ্ঠা দেখতে উপরের লিঙ্কে ক্লিক করুন। সম্পূর্ণ উত্তরটি একমাত্র বাংলা ভাষায় প্রদান করা হয়েছে)।*`;
  }

  if (l === 'ta') {
    const isKursi = message.toLowerCase().includes('kursi') || message.includes('குர்ஸி') || pageNum === 270;
    const isRiba = message.toLowerCase().includes('riba') || message.includes('வட்டி') || pageNum === 302;
    const isUhud = message.toLowerCase().includes('uhud') || message.includes('உஹுத்') || pageNum === 445;
    const isFatihah = message.toLowerCase().includes('fatihah') || message.includes('பாத்திஹா') || pageNum <= 46;

    let topicExegesis = '';
    if (isKursi) {
      topicExegesis = `**ஆயத்துல் குர்ஸி (அல்-பகரா: 255) தஃப்ஸீர் விளக்கம் [பக்கம் 270]:**
1. **அல்-ஹய்யு, அல்-கையூம்:** அல்லாஹ் நித்திய ஜீவன் உள்ளவன், அகிலத்தை தாங்கிப் பிடிக்கும் ஒரே அதிபதி.
2. **தூக்கமும் சோர்வும் அற்றவன்:** இறைவனுக்கு கண்ணயர்வும் தூக்கமும் ஏற்படாது; உலகைப் பராமரிப்பதில் அவனுக்கு எந்த சோர்வும் இல்லை.
3. **குர்ஸியின் பொருள்:** 'குர்ஸி' என்பது அவனுடைய முழுமையான ஆதிக்கம், அறிவு மற்றும் அதிகார பீடத்தைக் குறிக்கிறது.
4. **பரிந்துரை (ஷஃபாஅத்):** அவனது அனுமதியின்றி யாரும் அவனிடம் பரிந்துரை செய்ய இயலாது.`;
    } else if (isRiba) {
      topicExegesis = `**வட்டி (ரிபா) தடையின் பொருளாதார நீதி [பக்கம் 302]:**
1. **சுரண்டலுக்கு முடிவு:** வட்டி மனிதர்களிடையே சுயநலத்தையும் கொடுமையையும் பரப்பி, ஏழைகளின் உழைப்பை உறிஞ்சுகிறது.
2. **ஜகாத்தின் கருணை தத்துவம்:** ஜகாத் மூலம் செல்வம் விநியோகிக்கப்பட்டு சமூக நீதி உறுதி செய்யப்படுகிறது.
3. **போர்ப் பிரகடனம்:** வட்டி உண்போருக்கு எதிராக அல்லாஹ்வும் அவனது தூதரும் போர் பிரகடனம் செய்துள்ளனர்.`;
    } else if (isUhud) {
      topicExegesis = `**உஹுத் போரின் படிப்பினைகள் (ஆல இம்ரான்) [பக்கம் 445]:**
1. **ஒழுங்கு மற்றும் கீழ்ப்படிதல்:** கட்டளையை மீறி இடத்தை விட்டு நகர்ந்ததால் வெற்றி தோல்வியாக மாறியது.
2. **ஈமானின் சோதனை:** வெற்றி என்பது படை பலத்தினால் அல்ல, மாறாக இறை நம்பிக்கையினால் மட்டுமே கிடைக்கிறது.
3. **மன்னிப்பு மற்றும் ஆலோசனை:** தோல்விக்கு பின்னரும் தோழர்களிடம் மென்மையாக நடக்குமாறு நபி (ஸல்) அவர்களுக்கு கட்டளையிடப்பட்டது.`;
    } else if (isFatihah) {
      topicExegesis = `**அல்-ஃபாத்திஹாவின் சாரம் மற்றும் 'இய்யாக நஃபுது'வின் பொருள் [பக்கம் 40]:**
1. **குர்ஆனின் திறவுகோல்:** இது இறைவனிடம் கேட்கும் பிரார்த்தனை; முழு குர்ஆனும் அதற்கான பதில்.
2. **இய்யாக நஃபுது வ இய்யாக நஸ்தஈன்:** "உன்னையே நாங்கள் வணங்குகிறோம், உன்னிடமே உதவி தேடுகிறோம்." இதுவே ஏகத்துவத்தின் தூண்.
3. **நேரான வழி (ஸிராத்துல் முஸ்தகீம்):** அருள்பாலிக்கப்பட்ட நல்லோரின் நேர்வழி.`;
    } else {
      topicExegesis = `**தஃப்ஹீமுல் குர்ஆன் (பாகம் 1) வழிகாட்டல் [பக்கம் ${pageNum}]:**
1. **இறை வழிகாட்டுதல்:** குர்ஆன் மனித வாழ்வை சீர்திருத்தும் நடைமுறை நெறிமுறை நூல் என்பதை மௌதூதி விளக்குகிறார்.
2. **தவ்ஹீதின் தாக்கம்:** இறைவனின் ஆட்சியை ஏற்கும் மனிதன் சுயநலத்திலிருந்து விடுபட்டு நீதியுடன் வாழ்கிறான்.
3. **பக்கக் குறிப்பு:** இப்பொருள் குறித்த முழுமையான விளக்கம் பாகம் 1 இன் பக்கம் ${pageNum} இல் விரிவாக உள்ளது.`;
    }

    const sectionList = pages
      .map((p) => `• **பக்கம் ${p.page}** (${p.surahName || 'முகத்திமா'}): [அசல் ஏட்டைப் பார்க்க](${p.scanUrl})`)
      .join('\n');

    return `### தஃப்ஹீமுல் குர்ஆன் (பாகம் 1) விளக்கம்

தங்களின் கேள்வி **"${message}"** குறித்த விரிவுரை:

${topicExegesis}

---

### மேற்கோள் காட்டப்பட்ட பக்கங்கள் (பாகம் 1):
${sectionList}

*(அசல் ஏட்டை வாசிக்க மேலே உள்ள இணைப்பைப் பார்க்கவும். இப்பதில் தமிழில் மட்டுமே தரப்பட்டுள்ளது).*`;
  }

  if (l === 'ml') {
    const isKursi = message.toLowerCase().includes('kursi') || message.includes('കുർസി') || pageNum === 270;
    const isRiba = message.toLowerCase().includes('riba') || message.includes('പലിശ') || pageNum === 302;
    const isUhud = message.toLowerCase().includes('uhud') || message.includes('ഉഹുദ്') || pageNum === 445;
    const isFatihah = message.toLowerCase().includes('fatihah') || message.includes('ഫാതിഹ') || pageNum <= 46;

    let topicExegesis = '';
    if (isKursi) {
      topicExegesis = `**ആയത്തുൽ കുർസി (അൽബഖറ: 255) തഫ്സീർ വിശകലനം [പേജ് 270]:**
1. **അൽഹയ്യു, അൽഖയ്യൂം:** അല്ലാഹു സ്വയം നിലനിൽക്കുന്നവനും സർവ്വലോക സംരക്ഷകനുമാണ്.
2. **ക്ഷീണവും ഉറക്കവുമില്ലാത്തവൻ:** അവനെ ഉറക്കമോ മയക്കമോ ബാധിക്കുന്നില്ല; പ്രപഞ്ച പരിപാലനം അവനെ തളർത്തുന്നില്ല.
3. **കുർസിയുടെ അർത്ഥം:** അല്ലാഹുവിന്റെ സർവ്വാധിപത്യവും ഭരണാധികാരവും അറിവുമാണ് കുർസി എന്നതിലൂടെ വ്യക്തമാക്കുന്നത്.
4. **ശുപാർശ (ശഫാഅത്ത്):** അല്ലാഹുവിന്റെ അനുവാദമില്ലാതെ അവന്റെ സന്നിധിയിൽ ആർക്കും ശുപാർശ ചെയ്യാനാവില്ല.`;
    } else if (isRiba) {
      topicExegesis = `**പലിശ നിരോധനവും സകാത്തിന്റെ സാമ്പത്തിക നീതിയും [പേജ് 302]:**
1. **മുതലാളിത്ത ചൂഷണത്തിന്റെ അന്ത്യം:** പലിശ സമൂഹത്തിൽ ക്രൂരതയും അസമത്വവും വളർത്തുന്നു എന്ന് മൗദൂദി വിശദീകരിക്കുന്നു.
2. **സകാത്തിന്റെ കാരുണ്യ തത്ത്വം:** സമ്പത്ത് അവകാശികൾക്ക് വിതരണം ചെയ്ത് സാമൂഹിക സുരക്ഷിതത്വം ഉറപ്പാക്കുന്നു.
3. **യുദ്ധ പ്രഖ്യാപനം:** പലിശ വാങ്ങുന്നവർക്കെതിരെ അല്ലാഹുവും റസൂലും യുദ്ധം പ്രഖ്യാപിച്ചിരിക്കുന്നു.`;
    } else if (isUhud) {
      topicExegesis = `**ഉഹുദ് യുദ്ധത്തിലെ ചരിത്ര പാഠങ്ങൾ (ആലു ഇംറാൻ) [പേജ് 445]:**
1. **അച്ചടക്കവും അനുസരണയും:** കൽപ്പന ധിക്കരിച്ചുള്ള സ്ഥാനചലനം വിജയത്തെ പരാജയമാക്കി മാറ്റുമെന്ന് വ്യക്തമായി.
2. **വിശ്വാസത്തിന്റെ പരീക്ഷണം:** വിജയം സൈനിക ബലത്തിലല്ല, മറിച്ച് അല്ലാഹുവിലുള്ള അചഞ്ചലമായ വിശ്വാസത്തിലാണ്.
3. **നേതൃത്വത്തിന്റെ കാരുണ്യം:** വീഴ്ച സംഭവിച്ച അനുയായികളോട് സൗമ്യത പാലിക്കാൻ പ്രവാചകനോട് കൽപ്പിച്ചു.`;
    } else if (isFatihah) {
      topicExegesis = `**സൂറത്തുൽ ഫാതിഹയുടെ കാതലും 'ഇയ്യാക നഅ്ബുദു'വും [പേജ് 40]:**
1. **ഖുർആന്റെ സംഗ്രഹം (ഉമ്മുൽ കിതാബ്):** ഫാതിഹ ഒരു പ്രാർത്ഥനയാണ്; ബാക്കി ഖുർആൻ അതിനുള്ള ഉത്തരവുമാണ്.
2. **ഇയ്യാക നഅ്ബുദു വ ഇയ്യാക നസ്തഈൻ:** "നിന്നെ മാത്രം ഞങ്ങൾ ആരാധിക്കുന്നു, നിന്നോട് മാത്രം സഹായം തേടുന്നു."
3. **നേർവഴി (സ്വിറാത്വൽ മുസ്തഖീം):** അല്ലാഹുവിന്റെ അനുഗ്രഹം ലഭിച്ച സജ്ജനങ്ങളുടെ പാത.`;
    } else {
      topicExegesis = `**തഫ്ഹീമുൽ ഖുർആൻ (വാല്യം 1) പ്രകാരമുള്ള വിശദീകരണം [പേജ് ${pageNum}]:**
1. **ദിവ്യ മാർഗ്ഗദർശനം:** ഖുർആൻ ഒരു ആചാര ഗ്രന്ഥമല്ലെന്നും മനുഷ്യ ജീവിതത്തെ നവീകരിക്കുന്ന സന്ദേശമാണെന്നും വ്യക്തമാക്കുന്നു.
2. **തൗഹീദിന്റെ പ്രായോഗിക തലം:** അല്ലാഹുവിന്റെ പരമാധികാരം അംഗീകരിക്കുന്നതിലൂടെ മനുഷ്യൻ അനീതിയിൽ നിന്ന് മോചിതനാകുന്നു.
3. **റഫറൻസ്:** ഈ വിഷയത്തിന്റെ സമഗ്രമായ വിശദീകരണം വാല്യം 1 പേജ് ${pageNum}-ൽ അടങ്ങിയിരിക്കുന്നു.`;
    }

    const sectionList = pages
      .map((p) => `• **പേജ് ${p.page}** (${p.surahName || 'മുഖദ്ദിമ'}): [യഥാർത്ഥ സ്കാൻ കാണുക](${p.scanUrl})`)
      .join('\n');

    return `### തഫ്ഹീമുൽ ഖുർആൻ (വാല്യം 1) വ്യാഖ്യാനം

താങ്കളുടെ ചോദ്യമായ **"${message}"** സംബന്ധിച്ച വിശദീകരണം:

${topicExegesis}

---

### ഉദ്ധരിച്ച പേജുകൾ (വാല്യം 1):
${sectionList}

*(യഥാർത്ഥ സ്കാൻ പരിശോധിക്കാൻ ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക. ഈ ഉത്തരം മലയാളത്തിൽ മാത്രമാണ് നൽകിയിട്ടുള്ളത്).*`;
  }

  if (l === 'kn') {
    const isKursi = message.toLowerCase().includes('kursi') || message.includes('ಕುರ್ಸಿ') || pageNum === 270;
    const isRiba = message.toLowerCase().includes('riba') || message.includes('ಬಡ್ಡಿ') || pageNum === 302;
    const isUhud = message.toLowerCase().includes('uhud') || message.includes('ಉಹುದ್') || pageNum === 445;
    const isFatihah = message.toLowerCase().includes('fatihah') || message.includes('ಫಾತಿಹಾ') || pageNum <= 46;

    let topicExegesis = '';
    if (isKursi) {
      topicExegesis = `**ಆಯತುಲ್ ಕುರ್ಸಿ (ಅಲ್-ಬಖರಾ: 255) ತಫ್ಸೀರ್ ವಿವರಣೆ [ಪುಟ 270]:**
1. **ಅಲ್-ಹಯ್ಯು, ಅಲ್-ಖಯ್ಯೂಮ್:** ಅಲ್ಲಾಹನು ನಿತ್ಯ ಜೀವಂತನಾಗಿದ್ದಾನೆ ಮತ್ತು ಇಡೀ ವಿಶ್ವವನ್ನು ಏಕೈಕವಾಗಿ ರಕ್ಷಿಸುವ ಪ್ರಭುವಾಗಿದ್ದಾನೆ.
2. **ದಣಿವು ಮತ್ತು ನಿದ್ರೆ ಇಲ್ಲದವನು:** ಅವನಿಗೆ ನಿದ್ರೆಯಾಗಲಿ ತೂಕಡಿಕೆಯಾಗಲಿ ಸೋಕುವುದಿಲ್ಲ; ವಿಶ್ವದ ರಕ್ಷಣೆ ಅವನನ್ನು ದಣಿಸುವುದಿಲ್ಲ.
3. **'ಕುರ್ಸಿ'ಯ ಮಹತ್ವ:** ಕುರ್ಸಿಯು ಅಲ್ಲಾಹನ ಸಾರ್ವಭೌಮತ್ವ, ಆಡಳಿತಾತ್ಮಕ ಹಿಡಿತ ಮತ್ತು ಅಪಾರ ಜ್ಞಾನದ ಸಂಕೇತವಾಗಿದೆ.
4. **ಮಧ್ಯಸ್ಥಿಕೆ (ಶಫಾಅತ್):** ಅವನ ಅನುಮತಿಯಿಲ್ಲದೆ ಯಾರೂ ಅವನ ಸನ್ನಿಧಿಯಲ್ಲಿ ಮಧ್ಯಸ್ಥಿಕೆ ವಹಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.`;
    } else if (isRiba) {
      topicExegesis = `**ಬಡ್ಡಿ (ರಿಬಾ) ನಿಷೇಧ ಮತ್ತು ಝಕಾತ್‌ನ ಆರ್ಥಿಕ ನ್ಯಾಯ [ಪುಟ 302]:**
1. **ಬಂಡವಾಳಶಾಹಿ ಶೋಷಣೆಗೆ ಮುಕ್ತಿ:** ಬಡ್ಡಿಯು ಸಮಾಜದಲ್ಲಿ ಕ್ರೂರತೆ ಮತ್ತು ಅಸಮಾನತೆಯನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ ಎಂದು ಮೌದೂದಿ ವಿವರಿಸಿದ್ದಾರೆ.
2. **ಝಕಾತ್‌ನ ಸಮಾಜ ಕಲ್ಯಾಣ:** ಝಕಾತ್ ಮುಖಾಂತರ ಸಂಪತ್ತು ಬಡವರಿಗೆ ತಲುಪಿ ಸಮಾಜದಲ್ಲಿ ನ್ಯಾಯ ಸ್ಥಾಪನೆಯಾಗುತ್ತದೆ.
3. **ಯುದ್ಧದ ಎಚ್ಚರಿಕೆ:** ಬಡ್ಡಿ ತಿನ್ನುವವರಿಗೆ ಅಲ್ಲಾಹ್ ಮತ್ತು ಅವನ ಪ್ರವಾದಿ ಯುದ್ಧದ ಎಚ್ಚರಿಕೆ ನೀಡಿದ್ದಾರೆ.`;
    } else if (isUhud) {
      topicExegesis = `**ಉಹುದ್ ಕದನದ ಐತಿಹಾಸಿಕ ಪಾಠಗಳು (ಆಲಿ ಇಮ್ರಾನ್) [ಪುಟ 445]:**
1. **ಶಿಸ್ತು ಮತ್ತು ವಿಧೇಯತೆ:** ಆದೇಶ ಮೀರಿ ಜಾಗ ಬಿಟ್ಟಿದ್ದರಿಂದ ಗೆಲುವು ಸೋಲಾಗಿ ಪರಿಣಮಿಸಿತು.
2. **ವಿಶ್ವಾಸದ ಪರೀಕ್ಷೆ:** ಜಯವು ಕೇವಲ ಸೈನ್ಯದ ಬಲದಲ್ಲಲ್ಲ, ಅಲ್ಲಾಹನ ಮೇಲಿನ ಅಚಲ ಭಕ್ತಿಯಲ್ಲಿದೆ.
3. **ನಾಯಕತ್ವದ ಕರುಣೆ:** ಕಷ್ಟದ ಸಂದರ್ಭದಲ್ಲೂ ಸಹಚರರೊಂದಿಗೆ ಮೃದುವಾಗಿ ವರ್ತಿಸಲು ಪ್ರವಾದಿಯವರಿಗೆ ಆದೇಶಿಸಲಾಯಿತು.`;
    } else if (isFatihah) {
      topicExegesis = `**ಸೂರಾ ಅಲ್-ಫಾತಿಹಾದ ಸಾರಾಂಶ ಮತ್ತು 'ಇಯ್ಯಾಕ ನಅ್ಬುದು' ನ ಅರ್ಥ [ಪುಟ 40]:**
1. **ಕುರ್ಆನ್‌ನ ತಿರುಳು (ಉಮ್ಮುಲ್ ಕಿತಾಬ್):** ಫಾತಿಹಾ ಒಂದು ಪ್ರಾರ್ಥನೆಯಾಗಿದೆ, ಉಳಿದ ಕುರ್ಆನ್ ಅದಕ್ಕೆ ದೈವಿಕ ಉತ್ತರವಾಗಿದೆ.
2. **ಇಯ್ಯಾಕ ನಅ್ಬುದು ವ ಇಯ್ಯಾಕ ನಸ್ತಈನ್:** "ನಾವು ನಿನ್ನನ್ನೇ ಆರಾಧಿಸುತ್ತೇವೆ ಮತ್ತು ನಿನ್ನಲ್ಲೇ ಸಹಾಯ ಬೇಡುತ್ತೇವೆ."
3. **ಸನ್ಮಾರ್ಗ (ಸಿರಾತುಲ್ ಮುಸ್ತಖೀಮ್):** ಅಲ್ಲಾಹನ ಅನುಗ್ರಹ ಪಡೆದ ಸತ್ಪುರುಷರ ನೇರ ಮಾರ್ಗ.`;
    } else {
      topicExegesis = `**ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್ (ಸಂಪುಟ 1) ಆಧಾರಿತ ವಿವರಣೆ [ಪುಟ ${pageNum}]:**
1. **ದೈವಿಕ ಮಾರ್ಗದರ್ಶನ:** ಕುರ್ಆನ್ ಕೇವಲ ಧಾರ್ಮಿಕ ವಿಧಿವಿಧಾನಗಳ ಪುಸ್ತಕವಲ್ಲ, ಬದಲಾಗಿ ಮಾನವ ಜೀವನವನ್ನು ಸರಿಪಡಿಸುವ ಕ್ರಾಂತಿಕಾರಿ ಮಾರ್ಗದರ್ಶನವಾಗಿದೆ.
2. **ತೌಹೀದ್‌ನ ಪ್ರಭಾವ:** ಅಲ್ಲಾಹನ ಸಾರ್ವಭೌಮತ್ವವನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುವುದರಿಂದ ಮನುಷ್ಯ ಅನ್ಯಾಯಗಳಿಂದ ಮುಕ್ತನಾಗುತ್ತಾನೆ.
3. **ಪುಟ ಉಲ್ಲೇಖ:** ಈ ವಿಷಯದ ಸಂಪೂರ್ಣ ವಿವರಣೆಯನ್ನು ಸಂಪುಟ 1 ರ ಪುಟ ${pageNum} ರಲ್ಲಿ ನೋಡಬಹುದು.`;
    }

    const sectionList = pages
      .map((p) => `• **ಪುಟ ${p.page}** (${p.surahName || 'ಮುಖದ್ದಿಮಾ'}): [ಸ್ಕ್ಯಾನ್ ಓದಿ](${p.scanUrl})`)
      .join('\n');

    return `### ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್ (ಸಂಪುಟ 1) ವಿವರಣೆ

ನಿಮ್ಮ ಪ್ರಶ್ನೆ **"${message}"** ಕುರಿತಾಗಿ ಸಯ್ಯಿದ್ ಅಬುಲ್ ಅಹ್ಲಾ ಮೌದೂದಿಯವರ ವಿವರಣೆ:

${topicExegesis}

---

### ಉಲ್ಲೇಖಿತ ಪುಟಗಳು (ಸಂಪುಟ 1):
${sectionList}

*(ಮೂಲ ಪುಟವನ್ನು ವೀಕ್ಷಿಸಲು ಮೇಲಿನ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ. ಈ ಉತ್ತರವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಕನ್ನಡದಲ್ಲೇ ನೀಡಲಾಗಿದೆ).*`;
  }

  // Default English fallback
  const sectionList = pages
    .map((p) => `• **Page ${p.page}** (${p.surahName || 'Muqaddimah'}): *${p.sectionTitle}* — [Read Scan](${p.scanUrl})`)
    .join('\n');

  return `### Exegesis from Tafheem-ul-Quran (Volume 1)

In response to your inquiry regarding **"${message}"**:

${topPage.summary}

### Core Insight from Sayyid Abul A'la Maududi:
> "${topPage.tafseerExcerpt}"

In Volume 1 of *Tafheem-ul-Quran*, Maududi emphasizes that the Quran is not merely a collection of isolated maxims, but a coherent divine manifesto aimed at transforming human character and society. When analyzing this theme, he connects the spiritual reality of Tawhid (Divine Sovereignty) with practical moral discipline and social justice.

### Cited Pages in Volume 1:
${sectionList}

*(Click on any cited page below to inspect the notes or open the high-resolution scanned two-page spread on Archive.org).*`;
}

// API: Volume 1 Metadata & Table of Contents
app.get('/api/surahs', (_req, res) => {
  res.json({
    surahs: SURAH_OVERVIEWS,
    totalPages: 480,
    volume: 1,
    title: 'Tafheem-ul-Quran (Volume 1)',
    author: "Sayyid Abul A'la Maududi",
    corpusIndexedPages: Object.keys(VOLUME_1_PAGE_TEXTS).length,
  });
});

// API: Indexed Pages list
app.get('/api/pages', (req, res) => {
  const surahFilter = req.query.surah ? Number(req.query.surah) : undefined;
  if (surahFilter !== undefined && !isNaN(surahFilter)) {
    const filtered = VOLUME_1_PAGES.filter((p) => p.surahNumber === surahFilter);
    return res.json({ pages: filtered });
  }
  res.json({ pages: VOLUME_1_PAGES });
});

// API: Specific Page Info
app.get('/api/pages/:pageNumber', (req, res) => {
  const pageNum = Number(req.params.pageNumber);
  const found = VOLUME_1_PAGES.find((p) => p.page === pageNum);
  const transcript = VOLUME_1_PAGE_TEXTS[pageNum]?.text;

  if (found) {
    return res.json({
      page: {
        ...found,
        transcript: transcript || null,
      },
    });
  }

  // If not explicitly indexed, provide general Volume 1 page mapping
  let surah = 'Volume 1 (General)';
  if (pageNum >= 1 && pageNum <= 32) surah = 'Muqaddimah (Introduction)';
  else if (pageNum >= 33 && pageNum <= 46) surah = 'Surah 1: Al-Fatihah';
  else if (pageNum >= 47 && pageNum <= 320) surah = 'Surah 2: Al-Baqarah';
  else if (pageNum >= 321 && pageNum <= 480) surah = "Surah 3: Ali 'Imran";

  res.json({
    page: {
      page: pageNum,
      sectionTitle: `${surah} - Page ${pageNum}`,
      summary: `Page ${pageNum} from Volume 1 of Tafheem-ul-Quran.`,
      keyThemes: ['Quranic Commentary', 'Tafheem-ul-Quran', 'Volume 1'],
      tafseerExcerpt: `Refer to the original archive scan to read Page ${pageNum} in its complete Urdu/English translation and footnote apparatus.`,
      scanUrl: getScanUrl(pageNum),
      transcript: transcript || null,
    },
  });
});

// API: Full Page Text Transcript (matching tafheem-bot/data/txt)
app.get('/api/pages/:pageNumber/text', (req, res) => {
  const pageNum = Number(req.params.pageNumber);
  const record = VOLUME_1_PAGE_TEXTS[pageNum];
  if (record) {
    return res.json({
      page: pageNum,
      title: record.title,
      surah: record.surah,
      verseRange: record.verseRange,
      text: record.text,
      scanUrl: getScanUrl(pageNum),
    });
  }

  res.json({
    page: pageNum,
    title: `Page ${pageNum} of Tafheem-ul-Quran`,
    text: `Page ${pageNum} is available on the original archive scanned manuscript at ${getScanUrl(pageNum)}.`,
    scanUrl: getScanUrl(pageNum),
  });
});

// API: Search pages and topics
app.get('/api/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.json({ results: [] });
  }

  const { pages } = retrieveContext(q, 6);
  res.json({ results: pages });
});

// API: Sample questions
app.get('/api/sample-questions', (_req, res) => {
  res.json({ samples: SAMPLE_QUESTIONS });
});

// Helper: Strip raw HTML tags cleanly from exegesis text
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// In-memory cache for live Quran Tafseer API requests
const tafseerApiCache = new Map<string, any>();

// Helper: Fetch live Tafseer commentary from Quran.com v4 or AlQuran Cloud
async function fetchLiveTafseer(surah: number, ayah: number, bookId: string = '169') {
  const cacheKey = `tafsir:${surah}:${ayah}:${bookId}`;
  if (tafseerApiCache.has(cacheKey)) {
    return tafseerApiCache.get(cacheKey);
  }

  try {
    let result = {
      id: bookId,
      name: 'Tafsir',
      author: 'Classical Scholar',
      language: 'english',
      text: '',
    };

    if (bookId.startsWith('ar.') || bookId.startsWith('ur.')) {
      // AlQuran Cloud Tafseer edition
      const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${bookId}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const json: any = await res.json();
        if (json.data && json.data.text) {
          result = {
            id: bookId,
            name: json.data.edition?.name || bookId,
            author: json.data.edition?.englishName || bookId,
            language: json.data.edition?.language || 'ar',
            text: json.data.text,
          };
        }
      }
    } else {
      // Quran.com API v4 endpoint
      const url = `https://api.quran.com/api/v4/tafsirs/${bookId}/by_ayah/${surah}:${ayah}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const json: any = await res.json();
        if (json.tafsir && json.tafsir.text) {
          result = {
            id: bookId,
            name: json.tafsir.resource_name || 'Tafsir',
            author: json.tafsir.author_name || json.tafsir.resource_name || 'Classical Scholar',
            language: json.tafsir.language_name || 'english',
            text: json.tafsir.text,
          };
        }
      }
    }

    if (result.text) {
      tafseerApiCache.set(cacheKey, result);
    }
    return result;
  } catch (err: any) {
    console.warn(`Live Tafseer fetch skipped for ${surah}:${ayah} (${bookId}):`, err?.message);
    return null;
  }
}

// Helper: Fetch verse Arabic text, audio recitation, and localized translation
async function fetchLiveVerseAndTranslation(surah: number, ayah: number, lang: string = 'en') {
  const cacheKey = `verse:${surah}:${ayah}:${lang}`;
  if (tafseerApiCache.has(cacheKey)) {
    return tafseerApiCache.get(cacheKey);
  }

  const langMap: Record<string, string> = {
    en: 'en.sahih',
    ur: 'ur.maududi',
    hi: 'hi.hindi',
    bn: 'bn.bengali',
    ta: 'ta.tamil',
    ml: 'ml.abdulhameed',
    kn: 'en.sahih',
  };

  const edition = langMap[lang] || 'en.sahih';

  try {
    const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,ar.alafasy,${edition}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json: any = await res.json();
      if (Array.isArray(json.data) && json.data.length >= 3) {
        const arabicData = json.data[0];
        const audioData = json.data[1];
        const translationData = json.data[2];

        const output = {
          arabicText: arabicData.text || '',
          audioUrl: audioData.audio || audioData.audioSecondary?.[0] || '',
          translation: translationData.text || '',
          translationAuthor:
            translationData.edition?.englishName ||
            translationData.edition?.name ||
            'Authorized Translation',
        };
        tafseerApiCache.set(cacheKey, output);
        return output;
      }
    }
  } catch (err: any) {
    console.warn(`Live verse fetch skipped for ${surah}:${ayah}:`, err?.message);
  }

  // Graceful fallback if external connection is delayed
  return {
    arabicText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    audioUrl: '',
    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    translationAuthor: 'Translation',
  };
}

// Helper: Map Surah and Ayah to Tafheem Volume 1 Page if within bounds (Surah 1, 2, 3)
function getTafheemVolume1Reference(surah: number, ayah: number): { page: number; scanUrl: string } | null {
  if (surah === 1) {
    const page = 33 + Math.min(Math.max(ayah, 1), 7);
    return { page, scanUrl: getScanUrl(page) };
  }
  if (surah === 2) {
    // Ayat al-Kursi exact match
    if (ayah === 255) return { page: 270, scanUrl: getScanUrl(270) };
    if (ayah >= 275 && ayah <= 281) return { page: 302, scanUrl: getScanUrl(302) };
    if (ayah >= 285 && ayah <= 286) return { page: 318, scanUrl: getScanUrl(318) };
    if (ayah >= 30 && ayah <= 39) return { page: 63, scanUrl: getScanUrl(63) };
    if (ayah >= 67 && ayah <= 74) return { page: 98, scanUrl: getScanUrl(98) };

    const estPage = Math.min(320, Math.max(47, Math.round(47 + (ayah / 286) * (320 - 47))));
    return { page: estPage, scanUrl: getScanUrl(estPage) };
  }
  if (surah === 3) {
    if (ayah >= 121 && ayah <= 128) return { page: 445, scanUrl: getScanUrl(445) };
    const estPage = Math.min(480, Math.max(321, Math.round(321 + (ayah / 200) * (480 - 321))));
    return { page: estPage, scanUrl: getScanUrl(estPage) };
  }
  return null;
}

// API: Get all 114 Surahs metadata
app.get('/api/tafseer/surahs', (_req, res) => {
  res.json({ surahs: QURAN_SURAHS });
});

// API: Get supported Tafseer books
app.get('/api/tafseer/books', (_req, res) => {
  res.json({ books: TAFSEER_BOOKS });
});

// API: Get notable ayahs
app.get('/api/tafseer/notable', (_req, res) => {
  res.json({ notableAyahs: NOTABLE_AYAHS });
});

// API: Get Live Tafseer & Verse by Surah and Ayah
app.get('/api/tafseer/verse', async (req, res) => {
  try {
    const surah = Math.min(114, Math.max(1, Number(req.query.surah) || 2));
    const ayah = Math.max(1, Number(req.query.ayah) || 255);
    const bookId = String(req.query.book || '169');
    const lang = String(req.query.lang || 'en').toLowerCase();

    const surahMeta = QURAN_SURAHS.find((s) => s.number === surah) || QURAN_SURAHS[1];
    const safeAyah = Math.min(ayah, surahMeta.totalVerses);

    // Fetch verse data (Arabic + audio + translation) and tafseer commentary in parallel
    const [verseData, tafsirData] = await Promise.all([
      fetchLiveVerseAndTranslation(surah, safeAyah, lang),
      fetchLiveTafseer(surah, safeAyah, bookId),
    ]);

    const bookMeta = TAFSEER_BOOKS.find((b) => b.id === bookId) || TAFSEER_BOOKS[0];
    const v1Ref = getTafheemVolume1Reference(surah, safeAyah);

    return res.json({
      surah,
      ayah: safeAyah,
      surahNameArabic: surahMeta.name,
      surahNameEnglish: surahMeta.transliteration,
      totalVersesInSurah: surahMeta.totalVerses,
      revelationType: surahMeta.revelationType,
      arabicText: verseData?.arabicText || '',
      translation: verseData?.translation || '',
      translationAuthor: verseData?.translationAuthor || 'Authorized Translation',
      audioUrl: verseData?.audioUrl || '',
      tafsir: {
        id: bookId,
        name: tafsirData?.name || bookMeta.name,
        author: tafsirData?.author || bookMeta.author,
        language: tafsirData?.language || bookMeta.language,
        text: tafsirData?.text || 'Exegesis is being compiled from authentic scholarly editions.',
        cleanText: stripHtml(tafsirData?.text || ''),
      },
      tafheemVolume1Page: v1Ref?.page || null,
      volume1ScanUrl: v1Ref?.scanUrl || null,
    });
  } catch (err: any) {
    console.error('Error in /api/tafseer/verse:', err);
    res.status(500).json({ error: 'Failed to retrieve live Tafseer commentary.', details: err?.message });
  }
});

// API: Chat Endpoint with Gemini 3.8 Flash + RAG
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, language = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      ur: 'Urdu (اردو)',
      bn: 'Bangla / Bengali (বাংলা)',
      ta: 'Tamil (தமிழ்)',
      ml: 'Malayalam (മലയാളം)',
      kn: 'Kannada (ಕನ್ನಡ)',
    };

    let targetLangCode = String(language || 'en').toLowerCase();

    // Auto-detect script if user typed in a specific language script while language was default English
    const detectedScript = detectScriptFromText(message);
    if (targetLangCode === 'en' && detectedScript) {
      targetLangCode = detectedScript;
    }

    const targetLangName = languageNames[targetLangCode] || 'English';

    const { pages, contextStr } = retrieveContext(message, 4);

    // Live Tafseer API grounding: Query live Quran Tafseer API for relevant Ayah if referenced
    let liveTafseerContext = '';
    const tafseerCitations: any[] = [];
    
    // Check for verse pattern (e.g. "2:255", "2:30", "1:1", "3:103")
    const verseMatch = message.match(/(?:surah|sura)?\s*([1-3])\s*[:\s,-]\s*(\d{1,3})/i);
    let detectedSurah = verseMatch ? Number(verseMatch[1]) : 0;
    let detectedAyah = verseMatch ? Number(verseMatch[2]) : 0;

    if (!detectedSurah) {
      const lower = message.toLowerCase();
      if (lower.includes('kursi') || message.includes('कुर्सी') || message.includes('الکرسی')) {
        detectedSurah = 2;
        detectedAyah = 255;
      } else if (lower.includes('riba') || lower.includes('usury') || message.includes('सूद') || message.includes('سود')) {
        detectedSurah = 2;
        detectedAyah = 275;
      } else if (lower.includes('fatihah') || lower.includes('opening') || message.includes('फातिहा') || message.includes('فاتحہ')) {
        detectedSurah = 1;
        detectedAyah = 1;
      } else if (lower.includes('adam') || lower.includes('khalifah') || message.includes('आदम') || message.includes('آدم')) {
        detectedSurah = 2;
        detectedAyah = 30;
      }
    }

    if (detectedSurah && detectedAyah) {
      try {
        const bookId = targetLangCode === 'ur' ? '160' : targetLangCode === 'bn' ? '164' : '169';
        const [liveVerse, liveTafsir] = await Promise.all([
          fetchLiveVerseAndTranslation(detectedSurah, detectedAyah, targetLangCode),
          fetchLiveTafseer(detectedSurah, detectedAyah, bookId),
        ]);

        if (liveVerse && liveTafsir && liveTafsir.text) {
          const cleanTafsir = stripHtml(liveTafsir.text).slice(0, 1200);
          liveTafseerContext = `\n\n--- [LIVE QURAN TAFSEER API DATABASE GROUNDING - Surah ${detectedSurah}:${detectedAyah}] ---\nBook: ${liveTafsir.name} by ${liveTafsir.author}\nArabic Verse: ${liveVerse.arabicText}\nTranslation: ${liveVerse.translation}\nExegesis: ${cleanTafsir}\n--------------------------------------------------------------\n`;

          tafseerCitations.push({
            surah: detectedSurah,
            ayah: detectedAyah,
            bookName: liveTafsir.name,
            author: liveTafsir.author,
            arabicExcerpt: liveVerse.arabicText,
            translationExcerpt: liveVerse.translation,
            tafseerExcerpt: cleanTafsir.slice(0, 260) + '...',
          });
        }
      } catch (e: any) {
        console.warn('Live Tafseer API context fetch error:', e?.message);
      }
    }

    const systemInstruction = `You are a scholarly, reverent, and authoritative assistant specializing in Tafheem-ul-Quran (The Meaning of the Quran by Sayyid Abul A'la Maududi), Volume 1, enhanced with live authentic Quranic Tafseer databases (Ibn Kathir, Muyassar, Jalalayn, etc.).

Volume 1 Boundaries:
- Muqaddimah (Introduction to the Quran: Pages 1-32)
- Surah 1: Al-Fatihah (Verses 1-7: Pages 33-46)
- Surah 2: Al-Baqarah (Verses 1-286: Pages 47-320)
- Surah 3: Ali 'Imran (Verses 1-200: Pages 321-480)

ABSOLUTE STRICT ZERO-TOLERANCE LANGUAGE REQUIREMENT:
The user has selected the language: ${targetLangName} (Language Code: ${targetLangCode}).
You MUST formulate and write your entire response EXCLUSIVELY in ${targetLangName}.
- DO NOT answer in English unless the selected language is English!
- All explanations, headings, bullet points, conclusions, and commentary MUST be in ${targetLangName}.
- If the language is Hindi (हिन्दी), write entirely in Devanagari script and pure Hindi vocabulary.
- If the language is Urdu (اردو), write entirely in Arabic/Urdu script and pure Urdu vocabulary.
- If the language is Bangla (বাংলা), write entirely in Bengali script.
- If the language is Tamil (தமிழ்), write entirely in Tamil script.
- If the language is Malayalam (മലയാളം), write entirely in Malayalam script.
- If the language is Kannada (ಕನ್ನಡ), write entirely in Kannada script.
- Even if the context excerpts provided below are in English, you MUST translate and synthesize all commentary completely into ${targetLangName}.
- Quote Quranic verses in authentic Arabic script, followed by translation and explanation in ${targetLangName}.
- Always cite specific Volume 1 page references (e.g. "[Page 270]", "[صفحہ 270]", "[पृष्ठ 270]") and any live Tafseer database references.`;

    const userPromptWithContext = `[MANDATORY: Output response ONLY in ${targetLangName}. Do NOT use English unless ${targetLangName} is English.]

User Question (${targetLangName}):
"${message}"

Relevant Excerpts from Tafheem-ul-Quran Volume 1:
${contextStr}
${liveTafseerContext}

Please provide your complete scholarly response exclusively in ${targetLangName} with page citations.`;

    let answerText = '';

    if (ai) {
      try {
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 20000)
        );

        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPromptWithContext,
          config: {
            systemInstruction,
            temperature: 0.15,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        if (response && response.text) {
          answerText = response.text;
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API call skipped or timed out, generating localized exegesis:', geminiErr?.message);
      }
    }

    // Post-generation script check: verify if Gemini actually answered in the target language script
    if (answerText && targetLangCode !== 'en') {
      const scriptMatch = getScriptMatchCount(answerText, targetLangCode);
      if (scriptMatch < 25) {
        console.warn(`Gemini output failed script check for ${targetLangCode} (found ${scriptMatch} script characters). Running translation or fallback.`);
        if (ai) {
          try {
            const transTimeout = new Promise<null>((_, reject) =>
              setTimeout(() => reject(new Error('Translate timeout')), 12000)
            );
            const transPromise = ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: `Translate the following scholarly exegesis of Tafheem-ul-Quran completely and faithfully into ${targetLangName}. 
CRITICAL RULE: DO NOT use English. Output ONLY the translated text in ${targetLangName}. Preserve markdown headers, bullet points, and citations like [Page 270].

Text to translate:
${answerText}`,
            });
            const transRes: any = await Promise.race([transPromise, transTimeout]);
            if (transRes && transRes.text && getScriptMatchCount(transRes.text, targetLangCode) >= 25) {
              answerText = transRes.text;
            } else {
              answerText = generateLocalizedFallback(targetLangCode, message, pages);
            }
          } catch {
            answerText = generateLocalizedFallback(targetLangCode, message, pages);
          }
        } else {
          answerText = generateLocalizedFallback(targetLangCode, message, pages);
        }
      }
    }

    // Localized scholarly synthesis if API call is skipped, unavailable, or timed out
    if (!answerText) {
      answerText = generateLocalizedFallback(targetLangCode, message, pages);
    }

    // Prepare structured sources for rich UI buttons with full language localization
    const sources = pages.map((p) => {
      const loc = getLocalizedPage(p.page, targetLangCode as any);
      return {
        page: p.page,
        surah: loc.surahName || p.surahName || 'Muqaddimah',
        verse: p.verseRange || '',
        title: loc.sectionTitle || p.sectionTitle,
        excerpt: loc.tafseerExcerpt || p.tafseerExcerpt,
        scanUrl: p.scanUrl,
      };
    });

    return res.json({
      answer: answerText,
      sources,
      tafseerCitations,
      query: message,
      language: targetLangCode,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: 'An error occurred while formulating the scholarly response.',
      details: err?.message,
    });
  }
});

// In production serve static files; in dev use Vite middlewares
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tafheem-ul-Quran Q&A server listening on http://0.0.0.0:${PORT}`);
});
