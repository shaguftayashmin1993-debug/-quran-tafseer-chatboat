export type SupportedLanguage = 'en' | 'hi' | 'ur' | 'bn' | 'ta' | 'ml' | 'kn';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  fontFamily: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr', fontFamily: 'font-body' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr', fontFamily: "'Noto Sans Devanagari', sans-serif" },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', dir: 'rtl', fontFamily: "'Noto Nastaliq Urdu', 'Amiri', serif" },
  { code: 'bn', name: 'Bangla', nativeName: 'বাংলা', flag: '🇧🇩', dir: 'ltr', fontFamily: "'Noto Sans Bengali', sans-serif" },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr', fontFamily: "'Noto Sans Tamil', sans-serif" },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', dir: 'ltr', fontFamily: "'Noto Sans Malayalam', sans-serif" },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', dir: 'ltr', fontFamily: "'Noto Sans Kannada', sans-serif" },
];

export function getPagePrompt(lang: SupportedLanguage, page: number, title: string): string {
  switch (lang) {
    case 'hi':
      return `कृपया तफ़ीम-उल-क़ुरआन (खंड 1) के पृष्ठ ${page} (${title}) की विस्तृत तफ़सीर और मुख्य बिंदु समझाएं।`;
    case 'ur':
      return `براہ کرم تفہیم القرآن (جلد اول) کے صفحہ ${page} (${title}) کی تفصیلی تفسیر اور اہم نکات بیان کریں۔`;
    case 'bn':
      return `দয়া করে তাফহীমুল কুরআন (খণ্ড ১)-এর পৃষ্ঠা ${page} (${title})-এর বিস্তারিত তাফসীর ও মূল শিক্ষা ব্যাখ্যা করুন।`;
    case 'ta':
      return `தயவுசெய்து தஃப்ஹீமுல் குர்ஆன் (பாகம் 1) பக்கம் ${page} (${title}) இன் விரிவுரையையும் முக்கிய படிப்பினைகளையும் விளக்குக.`;
    case 'ml':
      return `ദയവായി തഫ്ഹീമുൽ ഖുർആൻ (വാല്യം 1) പേജ് ${page} (${title})-ന്റെ വിശദമായ വ്യാഖ്യാനവും പ്രധാന പാഠങ്ങളും വ്യക്തമാക്കുക.`;
    case 'kn':
      return `ದಯವಿಟ್ಟು ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್ (ಸಂಪುಟ 1) ಪುಟ ${page} (${title}) ರ ವಿವರವಾದ ತಫ್ಸೀರ್ ಮತ್ತು ಪ್ರಮುಖ ಪಾಠಗಳನ್ನು ವಿವರಿಸಿ.`;
    case 'en':
    default:
      return `Please provide a comprehensive scholarly breakdown of Page ${page} of Tafheem-ul-Quran (Volume 1), focusing on ${title}.`;
  }
}

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  volumeBadge: string;
  tabChat: string;
  tabExplorer: string;
  tabViewer: string;
  tabTafseer: string;
  tabBookmarks: string;
  tafseerDbTitle: string;
  tafseerDbSubtitle: string;
  selectSurahLabel: string;
  selectAyahLabel: string;
  selectTafseerBook: string;
  quickAyahsTitle: string;
  playRecitation: string;
  pauseRecitation: string;
  audioRecitation: string;
  arabicVerse: string;
  meaningTranslation: string;
  scholarlyCommentary: string;
  askAiAboutVerse: string;
  bookmarkTafseer: string;
  viewInVolume1Scan: string;
  loadingTafseer: string;
  liveApiStatus: string;
  previousAyah: string;
  nextAyah: string;
  statusEngine: string;
  newDiscussion: string;
  welcomeTitle: string;
  welcomeDesc: string;
  featuredQuestions: string;
  inputPlaceholder: string;
  sendBtn: string;
  inputNote: string;
  researching: string;
  analyzing: string;
  citedPagesTitle: string;
  inspectPage: string;
  openScan: string;
  copy: string;
  copied: string;
  listen: string;
  stopAudio: string;
  save: string;
  saved: string;
  page: string;
  pages: string;
  verses: string;
  resetFilters: string;
  searchPlaceholder: string;
  thematicOverview: string;
  commentaryNotes: string;
  textTranscript: string;
  scanViewer: string;
  openScanArchive: string;
  askAboutPage: string;
  bookmarkPage: string;
  goToPage: string;
  jumpBtn: string;
  savedNotesTitle: string;
  savedNotesSubtitle: string;
  noSavedNotes: string;
  noSavedNotesDesc: string;
  exportStudySheet: string;
  copiedStudySheet: string;
  myNote: string;
  addNote: string;
  editNote: string;
  saveReflections: string;
  cancel: string;
  languageSelect: string;
  sampleQuestions: {
    question: string;
    surah: string;
    pageRef: number;
    category: string;
  }[];
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    appTitle: "Tafheem-ul-Quran",
    appSubtitle: "Sayyid Abul A'la Maududi",
    volumeBadge: "Volume 1",
    tabChat: "Ask & Discuss",
    tabExplorer: "Volume 1 Explorer",
    tabViewer: "Scan Reader",
    tabTafseer: "Tafseer Database",
    tabBookmarks: "Saved Notes",
    tafseerDbTitle: "Online Quran Tafseer Database",
    tafseerDbSubtitle: "Explore classical and contemporary exegesis directly from live authentic scholarly API endpoints across all 114 Surahs.",
    selectSurahLabel: "Select Surah",
    selectAyahLabel: "Select Ayah",
    selectTafseerBook: "Exegesis (Tafseer Book)",
    quickAyahsTitle: "Notable & Frequent Ayahs",
    playRecitation: "Play Recitation",
    pauseRecitation: "Pause Recitation",
    audioRecitation: "Ayah Recitation (Mishary Alafasy)",
    arabicVerse: "Noble Quranic Verse (Uthmani)",
    meaningTranslation: "Translation of Meaning",
    scholarlyCommentary: "Scholarly Exegesis (Tafseer)",
    askAiAboutVerse: "Ask AI About This Ayah & Tafseer",
    bookmarkTafseer: "Bookmark Tafseer",
    viewInVolume1Scan: "View Scanned Manuscript (Volume 1)",
    loadingTafseer: "Retrieving exegesis from live Tafseer API...",
    liveApiStatus: "Live Tafseer API Connected (Quran.com & AlQuran Cloud)",
    previousAyah: "Previous Ayah",
    nextAyah: "Next Ayah",
    statusEngine: "Volume 1 Q&A Engine (Muqaddimah, Al-Fatihah, Al-Baqarah, Ali 'Imran)",
    newDiscussion: "New Discussion",
    welcomeTitle: "Tafheem-ul-Quran Q&A Assistant",
    welcomeDesc: "Dedicated scholarly assistant for Volume 1 of Sayyid Abul A'la Maududi's celebrated exegesis. Every answer draws strictly from authentic commentary and cites original scanned pages.",
    featuredQuestions: "Featured Questions from Volume 1",
    inputPlaceholder: "Ask anything about Volume 1 (e.g., Why was the cow commanded? What is Ayat al-Kursi's core message?)",
    sendBtn: "Send",
    inputNote: "Answers sourced exclusively from Tafheem-ul-Quran (Volume 1, pp. 1–480)",
    researching: "Researching exegesis...",
    analyzing: "Retrieving Volume 1 commentary & page citations...",
    citedPagesTitle: "Volume 1 Cited Pages & Scans",
    inspectPage: "Inspect Page",
    openScan: "Scan",
    copy: "Copy",
    copied: "Copied",
    listen: "Listen",
    stopAudio: "Stop",
    save: "Save",
    saved: "Saved",
    page: "Page",
    pages: "Pages",
    verses: "verses",
    resetFilters: "Reset Filters",
    searchPlaceholder: "Search by topic, verse (e.g. 2:255, Ayat al-Kursi, Riba, Uhud, Adam, Hidayah)...",
    thematicOverview: "Thematic Overview",
    commentaryNotes: "Commentary",
    textTranscript: "Text (.txt)",
    scanViewer: "Scan Viewer",
    openScanArchive: "Read on Archive.org",
    askAboutPage: "Ask AI About This Page",
    bookmarkPage: "Save Page",
    goToPage: "Go to Page:",
    jumpBtn: "Jump",
    savedNotesTitle: "Saved Volume 1 Notes & Bookmarks",
    savedNotesSubtitle: "Keep track of key exegesis passages, legal rulings, and answered questions.",
    noSavedNotes: "No Saved Notes Yet",
    noSavedNotesDesc: "While asking questions in the Q&A Chat or browsing the Volume 1 Explorer, click the Bookmark button on any response or page to save it to your personal study notebook.",
    exportStudySheet: "Export Study Sheet",
    copiedStudySheet: "Copied Study Sheet!",
    myNote: "My Note:",
    addNote: "Add Note",
    editNote: "Edit Note",
    saveReflections: "Save Reflections",
    cancel: "Cancel",
    languageSelect: "Language",
    sampleQuestions: [
      {
        question: "What is Maududi's commentary on Ayat al-Kursi (2:255) and its description of Allah's Sovereignty?",
        surah: "Al-Baqarah",
        pageRef: 270,
        category: "Theology & Tawhid"
      },
      {
        question: "How does Tafheem-ul-Quran explain the prohibition of Riba (Usury) vs. the institution of Zakat?",
        surah: "Al-Baqarah",
        pageRef: 302,
        category: "Economics & Ethics"
      },
      {
        question: "What are the core guidelines in the Muqaddimah (Introduction) for studying the Quran?",
        surah: "Muqaddimah",
        pageRef: 30,
        category: "Quranic Principles"
      },
      {
        question: "Why is Surah Al-Fatihah called the quintessence of the Quran and how is 'Iyyaka Na'budu' explained?",
        surah: "Al-Fatihah",
        pageRef: 40,
        category: "Surah Al-Fatihah"
      },
      {
        question: "What moral and strategic lessons does Maududi draw from the Battle of Uhud in Surah Ali 'Imran?",
        surah: "Ali 'Imran",
        pageRef: 445,
        category: "Historical Lessons"
      },
      {
        question: "What does the Quran mean by appointing man as 'Khalifah' (vicegerent) on earth in Surah Al-Baqarah?",
        surah: "Al-Baqarah",
        pageRef: 63,
        category: "Human Purpose"
      }
    ]
  },
  hi: {
    appTitle: "तफ़ीम-उल-क़ुरआन",
    appSubtitle: "सैयद अबुल आला मौदूदी",
    volumeBadge: "खंड 1",
    tabChat: "प्रश्न और चर्चा",
    tabExplorer: "खंड 1 अन्वेषक",
    tabViewer: "मूल पांडुलिपि रीडर",
    tabTafseer: "तफ़सीर डेटाबेस",
    tabBookmarks: "सहेजे गए नोट्स",
    tafseerDbTitle: "ऑनलाइन क़ुरआन तफ़सीर डेटाबेस",
    tafseerDbSubtitle: "सभी 114 सूरतों के लिए लाइव प्रामाणिक एपीआई (API) से प्राचीन एवं आधुनिक विद्वानों की तफ़सीर पढ़ें।",
    selectSurahLabel: "सूरत चुनें",
    selectAyahLabel: "आयत चुनें",
    selectTafseerBook: "तफ़सीर ग्रंथ चुनें",
    quickAyahsTitle: "प्रमुख एवं प्रसिद्ध आयतें",
    playRecitation: "क़िराअत सुनें",
    pauseRecitation: "रोकें",
    audioRecitation: "आयत तिलावत (मिशारी अल-अफ़ासी)",
    arabicVerse: "पवित्र क़ुरआनी आयत (उस्मानी लिपि)",
    meaningTranslation: "आयत का अर्थ व अनुवाद",
    scholarlyCommentary: "विद्वानों की प्रामाणिक तफ़सीर",
    askAiAboutVerse: "इस आयत व तफ़सीर पर AI से प्रश्न पूछें",
    bookmarkTafseer: "तफ़सीर सहेजें",
    viewInVolume1Scan: "खंड 1 मूल पांडुलिपि स्कैन देखें",
    loadingTafseer: "लाइव तफ़सीर एपीआई से व्याख्या लोड हो रही है...",
    liveApiStatus: "लाइव तफ़सीर एपीआई सक्रिय (Quran.com एवं AlQuran Cloud)",
    previousAyah: "पिछली आयत",
    nextAyah: "अगली आयत",
    statusEngine: "खंड 1 प्रश्नोत्तर इंजन (मुक़द्दमा, अल-फातिहा, अल-बक़रह, आले इमरान)",
    newDiscussion: "नई चर्चा",
    welcomeTitle: "तफ़ीम-उल-क़ुरआन प्रश्नोत्तर सहायक",
    welcomeDesc: "सैयद अबुल आला मौदूदी की प्रसिद्ध तफ़सीर के खंड 1 के लिए प्रामाणिक शोध सहायक। हर उत्तर प्रामाणिक तफ़सीर से उद्धृत है और मूल स्कैन किए गए पन्नों से जुड़ा है।",
    featuredQuestions: "खंड 1 से प्रमुख प्रश्न",
    inputPlaceholder: "खंड 1 के बारे में कोई भी प्रश्न पूछें (उदा. गाय की कुर्बानी का हुक्म क्यों दिया गया? आयत-उल-कुर्सी का मुख्य संदेश क्या है?)",
    sendBtn: "भेजें",
    inputNote: "उत्तर विशेष रूप से तफ़ीम-उल-क़ुरआन (खंड 1, पृष्ठ 1–480) से उद्धृत हैं",
    researching: "तफ़सीर खोजी जा रही है...",
    analyzing: "खंड 1 की व्याख्या और पृष्ठ संदर्भ निकाले जा रहे हैं...",
    citedPagesTitle: "खंड 1 उद्धृत पृष्ठ और स्कैन",
    inspectPage: "पृष्ठ देखें",
    openScan: "स्कैन",
    copy: "कॉपी",
    copied: "कॉपी हो गया",
    listen: "सुनें",
    stopAudio: "रोकें",
    save: "सहेजें",
    saved: "सहेजा गया",
    page: "पृष्ठ",
    pages: "पृष्ठ",
    verses: "आयतें",
    resetFilters: "फ़िल्टर हटाएं",
    searchPlaceholder: "विषय या आयत खोजें (उदा. 2:255, आयत-उल-कुर्सी, सूद, उहुद, आदम, हिदायत)...",
    thematicOverview: "विषयगत समीक्षा",
    commentaryNotes: "तफ़सीर नोट्स",
    textTranscript: "मूल पाठ (.txt)",
    scanViewer: "पांडुलिपि दृश्य",
    openScanArchive: "Archive.org पर पढ़ें",
    askAboutPage: "इस पृष्ठ के बारे में AI से पूछें",
    bookmarkPage: "पृष्ठ सहेजें",
    goToPage: "पृष्ठ संख्या:",
    jumpBtn: "जाएं",
    savedNotesTitle: "सहेजे गए नोट्स और बुकमार्क",
    savedNotesSubtitle: "महत्वपूर्ण व्याख्याओं, कानूनी हुक्मों और उत्तरों का अध्ययन संग्रह।",
    noSavedNotes: "अभी कोई सहेजा गया नोट नहीं है",
    noSavedNotesDesc: "प्रश्नोत्तर या खंड 1 अन्वेषक में किसी भी उत्तर या पृष्ठ पर बुकमार्क बटन दबाकर उसे अपनी अध्ययन नोटबुक में सहेजें।",
    exportStudySheet: "स्टडी शीट निर्यात करें",
    copiedStudySheet: "स्टडी शीट कॉपी हो गई!",
    myNote: "मेरी टिप्पणी:",
    addNote: "टिप्पणी जोड़ें",
    editNote: "टिप्पणी बदलें",
    saveReflections: "टिप्पणी सहेजें",
    cancel: "रद्द करें",
    languageSelect: "भाषा",
    sampleQuestions: [
      {
        question: "तफ़ीम-उल-क़ुरआन में आयत-उल-कुर्सी (2:255) और अल्लाह की संप्रभुता की क्या व्याख्या है?",
        surah: "अल-बक़रह",
        pageRef: 270,
        category: "तौहीद और अक़ीदा"
      },
      {
        question: "तफ़ीम-उल-क़ुरआन में रिबा (सूद) की पाबंदी और ज़कात के अंतर को कैसे समझाया गया है?",
        surah: "अल-बक़रह",
        pageRef: 302,
        category: "अर्थशास्त्र और न्याय"
      },
      {
        question: "मुक़द्दमा (भूमिका) में क़ुरआन के अध्ययन के लिए क्या बुनियादी निर्देश दिए गए हैं?",
        surah: "मुक़द्दमा",
        pageRef: 30,
        category: "क़ुरआनी उसूल"
      },
      {
        question: "सूरह अल-फातिहा को क़ुरआन का सार क्यों कहा जाता है और 'इय्याका नअबुदु' का क्या अर्थ है?",
        surah: "अल-फातिहा",
        pageRef: 40,
        category: "सूरह अल-फातिहा"
      },
      {
        question: "सूरह आले इमरान में जंग-ए-उहुद से मौदूदी साहब ने क्या सबक और हिकमतें बयान की हैं?",
        surah: "आले इमरान",
        pageRef: 445,
        category: "ऐतिहासिक सबक"
      },
      {
        question: "सूरह अल-बक़रह में इंसान को ज़मीन पर 'ख़लीफ़ा' बनाए जाने का क्या मतलब है?",
        surah: "अल-बक़रह",
        pageRef: 63,
        category: "मानव उद्देश्य"
      }
    ]
  },
  ur: {
    appTitle: "تفہیم القرآن",
    appSubtitle: "سید ابوالاعلیٰ مودودیؒ",
    volumeBadge: "جلد اول",
    tabChat: "سوال و جواب",
    tabExplorer: "جلد اول تفسیری جائزہ",
    tabViewer: "اسکین شدہ اوراق",
    tabTafseer: "تفسیر ڈیٹا بیس",
    tabBookmarks: "محفوظ نوٹس",
    tafseerDbTitle: "آن لائن قرآن تفسیر ڈیٹا بیس",
    tafseerDbSubtitle: "تمام 114 سورتوں کے لیے لائیو مستند علمی API سے قدیم و جدید ائمہ مفسرین کی تفاسیر کا مطالعہ کریں۔",
    selectSurahLabel: "سورت منتخب کریں",
    selectAyahLabel: "آیت نمبر",
    selectTafseerBook: "کتابِ تفسیر کا انتخاب",
    quickAyahsTitle: "اہم و مشہور قرآنی آیات",
    playRecitation: "تلاوت سنیں",
    pauseRecitation: "تلاوت روکیں",
    audioRecitation: "آڈیو تلاوت (قاری مشاری راشد العفاسی)",
    arabicVerse: "قرآنی آیت مبارکہ (عثمانی رسم الخط)",
    meaningTranslation: "ترجمہ و مفہوم",
    scholarlyCommentary: "مستند علمی تفسیر",
    askAiAboutVerse: "اس آیت و تفسیر پر AI سے سوال کریں",
    bookmarkTafseer: "تفسیر محفوظ کریں",
    viewInVolume1Scan: "جلد اول کے اصل اسکین شدہ اوراق دیکھیں",
    loadingTafseer: "لائیو تفسیر API سے تفسیر لوڈ ہو رہی ہے...",
    liveApiStatus: "لائیو تفسیر API فعال ہے (Quran.com و AlQuran Cloud)",
    previousAyah: "پچھلی آیت",
    nextAyah: "اگلی آیت",
    statusEngine: "تفہیم القرآن جلد اول معاون (مقدمہ، الفاتحہ، البقرہ، آل عمران)",
    newDiscussion: "نیا مکالمہ",
    welcomeTitle: "تفہیم القرآن علمی سوال و جواب معاون",
    welcomeDesc: "سید ابوالاعلیٰ مودودیؒ کی شہرہ آفاق تفسیر تفہیم القرآن (جلد اول) کا علمی و تحقیقی پلیٹ فارم۔ تمام جوابات مستند متن اور اصل اسکین شدہ صفحات کے حوالوں کے ساتھ۔",
    featuredQuestions: "جلد اول کے اہم تفسیری سوالات",
    inputPlaceholder: "جلد اول سے متعلق کوئی بھی سوال دریافت کریں (مثلاً: بقرہ کا واقعہ، آیت الکرسی کی تفسیر، سود کی حرمت)",
    sendBtn: "ارسال",
    inputNote: "جوابات خالصتاً تفہیم القرآن جلد اول (صفحات 1 تا 480) سے فراہم کیے جاتے ہیں",
    researching: "تفسیر تلاش کی جا رہی ہے...",
    analyzing: "جلد اول کے متعلقہ صفحات اور حواشی کا جائزہ...",
    citedPagesTitle: "جلد اول کے ماخذ اور اسکین شدہ صفحات",
    inspectPage: "صفحہ دیکھیں",
    openScan: "اصل اسکین",
    copy: "کاپی",
    copied: "کاپی ہو گیا",
    listen: "سنیں",
    stopAudio: "روکیں",
    save: "محفوظ کریں",
    saved: "محفوظ شدہ",
    page: "صفحہ",
    pages: "صفحات",
    verses: "آیات",
    resetFilters: "فلٹر ختم کریں",
    searchPlaceholder: "موضوع، آیت یا صفحہ تلاش کریں (مثلاً 2:255، آیت الکرسی، سود، احد، آدم، ہدایت)...",
    thematicOverview: "موضوعاتی خلاصہ",
    commentaryNotes: "تفسیری نکات",
    textTranscript: "متن (.txt)",
    scanViewer: "اسکین ویوور",
    openScanArchive: "آرکائیو پر پڑھیں",
    askAboutPage: "اس صفحے سے متعلق دریافت کریں",
    bookmarkPage: "صفحہ محفوظ کریں",
    goToPage: "صفحہ نمبر:",
    jumpBtn: "جائیں",
    savedNotesTitle: "محفوظ شدہ تفسیری نوٹس و حوالہ جات",
    savedNotesSubtitle: "اہم تفسیری مباحث، فقہی احکام اور سوالات کے جوابات کا ذاتی ذخیرہ۔",
    noSavedNotes: "ابھی کوئی نوٹ محفوظ نہیں کیا گیا",
    noSavedNotesDesc: "گفتگو یا جائزہ کے دوران کسی بھی جواب یا صفحے پر بک مارک کا بٹن دبا کر اسے اپنی ذاتی نوٹ بک میں محفوظ کریں۔",
    exportStudySheet: "اسٹڈی شیٹ ایکسپورٹ",
    copiedStudySheet: "اسٹڈی شیٹ کاپی ہو گئی!",
    myNote: "میرا نوٹ:",
    addNote: "نوٹ شامل کریں",
    editNote: "نوٹ تبدیل کریں",
    saveReflections: "نوٹ محفوظ کریں",
    cancel: "منسوخ",
    languageSelect: "زبان",
    sampleQuestions: [
      {
        question: "تفہیم القرآن میں آیت الکرسی (2:255) اور حاکمیت الٰہی کی کیا تشریح بیان کی گئی ہے؟",
        surah: "البقرہ",
        pageRef: 270,
        category: "توحید و عقیدہ"
      },
      {
        question: "تفہیم القرآن میں سود کی ممانعت اور زکوٰۃ کے معاشی نظام کا کیا موازنہ پیش کیا گیا ہے؟",
        surah: "البقرہ",
        pageRef: 302,
        category: "معاشیات و اخلاقیات"
      },
      {
        question: "قرآن فہمی کے لیے مقدمہ تفہیم القرآن میں کون سے بنیادی اصول بیان کیے گئے ہیں؟",
        surah: "مقدمہ",
        pageRef: 30,
        category: "قرآنی اصول"
      },
      {
        question: "سورۃ الفاتحہ کو پورے قرآن کا خلاصہ کیوں قرار دیا گیا ہے اور 'ایاک نعبد' کا اصل مفہوم کیا ہے؟",
        surah: "الفاتحہ",
        pageRef: 40,
        category: "سورۃ الفاتحہ"
      },
      {
        question: "سورۃ آل عمران میں غزوۂ احد کے نتائج اور شکست کے اسباب کا کیا تجزیہ کیا گیا ہے؟",
        surah: "آل عمران",
        pageRef: 445,
        category: "تاریخی اسباق"
      },
      {
        question: "سورۃ البقرہ میں انسان کو زمین پر 'خلیفہ' بنائے جانے کا کیا مفہوم بیان کیا گیا ہے؟",
        surah: "البقرہ",
        pageRef: 63,
        category: "مقصد تخلیق"
      }
    ]
  },
  bn: {
    appTitle: "তাফহীমুল কুরআন",
    appSubtitle: "সাইয়েদ আবুল আ'লা মওদূদী",
    volumeBadge: "খণ্ড ১",
    tabChat: "প্রশ্ন ও উত্তর",
    tabExplorer: "খণ্ড ১ অনুসন্ধান",
    tabViewer: "স্ক্যান রিডার",
    tabTafseer: "তাফসীর ডেটাবেস",
    tabBookmarks: "সংরক্ষিত নোট",
    tafseerDbTitle: "অনলাইন কুরআন তাফসীর ডেটাবেস",
    tafseerDbSubtitle: "লাইভ প্রামাণিক এপিআই (API) থেকে সকল ১১৪টি সূরার জন্য নির্ভরযোগ্য সনাতন ও আধুনিক তাফসীর পাঠ করুন।",
    selectSurahLabel: "সূরা নির্বাচন করুন",
    selectAyahLabel: "আয়াত নম্বর",
    selectTafseerBook: "তাফসীর গ্রন্থ",
    quickAyahsTitle: "গুরুত্বপূর্ণ ও প্রসিদ্ধ আয়াতসমূহ",
    playRecitation: "তিলাওয়াত শুনুন",
    pauseRecitation: "থামান",
    audioRecitation: "অডিও তিলাওয়াত (মিশারি আল-আফাসী)",
    arabicVerse: "পবিত্র কুরআনের আয়াত (উসমানী লিপি)",
    meaningTranslation: "অর্থ ও অনুবাদ",
    scholarlyCommentary: "প্রামাণ্য তাফসীর",
    askAiAboutVerse: "এই আয়াত ও তাফসীর নিয়ে AI-কে প্রশ্ন করুন",
    bookmarkTafseer: "তাফসীর সংরক্ষণ করুন",
    viewInVolume1Scan: "খণ্ড ১ মূল স্ক্যান কপি দেখুন",
    loadingTafseer: "লাইভ তাফসীর এপিআই থেকে তাফসীর সংগ্রহ করা হচ্ছে...",
    liveApiStatus: "লাইভ তাফসীর এপিআই সংযুক্ত (Quran.com ও AlQuran Cloud)",
    previousAyah: "পূর্ববর্তী আয়াত",
    nextAyah: "পরবর্তী আয়াত",
    statusEngine: "খণ্ড ১ প্রশ্নোত্তর ইঞ্জিন (মুকাদ্দিমাহ, আল-ফাতিহা, আল-বাকারা, আলে ইমরান)",
    newDiscussion: "নতুন আলোচনা",
    welcomeTitle: "তাফহীমুল কুরআন প্রশ্নোত্তর সহকারী",
    welcomeDesc: "সাইয়েদ আবুল আ'লা মওদূদীর বিশ্ববিখ্যাত তাফসির তাফহীমুল কুরআনের (খণ্ড ১) জন্য নিবেদিত গবেষক সহকারী। প্রতিটি উত্তর সরাসরি মূল তাফসির এবং আসল স্ক্যান করা পৃষ্ঠার রেফারেন্স সহ।",
    featuredQuestions: "খণ্ড ১ থেকে বাছাইকৃত প্রশ্নাবলী",
    inputPlaceholder: "খণ্ড ১ সম্পর্কিত যেকোনো প্রশ্ন লিখুন (যেমন: গাভীর ঘটনার তাৎপর্য কী? আয়াতুল কুরসীর মূল শিক্ষা কী?)",
    sendBtn: "পাঠান",
    inputNote: "উত্তরসমূহ কেবল তাফহীমুল কুরআন (খণ্ড ১, পৃষ্ঠা ১–৪৮০) থেকে সংকলিত",
    researching: "তাফসির অনুসন্ধান করা হচ্ছে...",
    analyzing: "খণ্ড ১-এর ব্যাখ্যা ও পৃষ্ঠা তথ্য সংগ্রহ করা হচ্ছে...",
    citedPagesTitle: "খণ্ড ১-এর উদ্ধৃত পৃষ্ঠা ও স্ক্যান",
    inspectPage: "পৃষ্ঠা দেখুন",
    openScan: "স্ক্যান",
    copy: "কপি",
    copied: "কপি হয়েছে",
    listen: "শুনুন",
    stopAudio: "থামান",
    save: "সংরক্ষণ",
    saved: "সংরক্ষিত",
    page: "পৃষ্ঠা",
    pages: "পৃষ্ঠা",
    verses: "আয়াত",
    resetFilters: "ফিল্টার মুছুন",
    searchPlaceholder: "বিষয় বা আয়াত খুঁজুন (যেমন: ২:২৫৫, আয়াতুল কুরসী, রিবা, ওহুদ, আদম)...",
    thematicOverview: "বিষয়ভিত্তিক সারসংক্ষেপ",
    commentaryNotes: "তাফসির নোট",
    textTranscript: "মূল টেক্সট (.txt)",
    scanViewer: "পাণ্ডুলিপি স্ক্যানার",
    openScanArchive: "Archive.org-এ পড়ুন",
    askAboutPage: "এই পৃষ্ঠা সম্পর্কে AI-কে জিজ্ঞাসা করুন",
    bookmarkPage: "পৃষ্ঠা সংরক্ষণ করুন",
    goToPage: "পৃষ্ঠা নম্বর:",
    jumpBtn: "যান",
    savedNotesTitle: "সংরক্ষিত নোট ও বুকমার্ক",
    savedNotesSubtitle: "গুরুত্বপূর্ণ তাফসির আলোচনা ও উত্তরের ব্যক্তিগত স্টাডি নোটবুক।",
    noSavedNotes: "এখনও কোনো নোট সংরক্ষিত নেই",
    noSavedNotesDesc: "চ্যাট বা অনুসন্ধানের সময় বুকমার্ক বাটনে ক্লিক করে যেকোনো উত্তর বা পৃষ্ঠা আপনার ব্যক্তিগত স্টাডি নোটে সংরক্ষণ করুন।",
    exportStudySheet: "স্টাডি শিট এক্সপোর্ট করুন",
    copiedStudySheet: "স্টাডি শিট কপি হয়েছে!",
    myNote: "আমার নোট:",
    addNote: "নোট যুক্ত করুন",
    editNote: "নোট সম্পাদনা",
    saveReflections: "নোট সংরক্ষণ করুন",
    cancel: "বাতিল",
    languageSelect: "ভাষা",
    sampleQuestions: [
      {
        question: "তাফহীমুল কুরআনে আয়াতুল কুরসী (২:২৫৫) এবং আল্লাহর সার্বভৌমত্বের কী ব্যাখ্যা দেওয়া হয়েছে?",
        surah: "আল-বাকারা",
        pageRef: 270,
        category: "তাওহীদ ও আকীদা"
      },
      {
        question: "তাফহীমুল কুরআনে রিবা (সুদ) নিষিদ্ধকরণ এবং যাকাত ব্যবস্থার অর্থনৈতিক পার্থক্য কীভাবে দেখানো হয়েছে?",
        surah: "আল-বাকারা",
        pageRef: 302,
        category: "অর্থনীতি ও নীতিশাস্ত্র"
      },
      {
        question: "কুরআন অধ্যয়নের জন্য মুকাদ্দিমায় (ভূমিকা) কী কী মৌলিক নির্দেশনা দেওয়া হয়েছে?",
        surah: "মুকাদ্দিমাহ",
        pageRef: 30,
        category: "কুরআনিক মূলনীতি"
      },
      {
        question: "সূরা আল-ফাতিহাকে কেন কুরআনের সারসংক্ষেপ বলা হয় এবং 'ইয়্যাকা না'বুদু'-র প্রকৃত অর্থ কী?",
        surah: "আল-ফাতিহা",
        pageRef: 40,
        category: "সূরা আল-ফাতিহা"
      },
      {
        question: "সূরা আলে ইমরানে ওহুদের যুদ্ধ এবং বিপর্যয় থেকে কী কী শিক্ষা বর্ণনা করা হয়েছে?",
        surah: "আলে ইমরান",
        pageRef: 445,
        category: "ঐতিহাসিক শিক্ষা"
      },
      {
        question: "সূরা আল-বাকারায় মানুষকে পৃথিবীতে 'খলিফা' বা প্রতিনিধি বানানোর তাৎপর্য কী?",
        surah: "আল-বাকারা",
        pageRef: 63,
        category: "সৃষ্টির উদ্দেশ্য"
      }
    ]
  },
  ta: {
    appTitle: "தஃப்ஹீமுல் குர்ஆன்",
    appSubtitle: "சையத் அபுல் அஃலா மௌதூதி",
    volumeBadge: "பாகம் 1",
    tabChat: "கேள்வி & பதில்",
    tabExplorer: "பாகம் 1 ஆய்வு",
    tabViewer: "ஏடு வாசிப்பான்",
    tabTafseer: "தஃப்ஸீர் ஏபிஐ",
    tabBookmarks: "சேமித்த குறிப்புகள்",
    tafseerDbTitle: "ஆன்லைன் குர்ஆன் தஃப்ஸீர் தரவுத்தளம்",
    tafseerDbSubtitle: "அனைத்து 114 சூராக்களுக்கும் நேரடி நம்பகமான ஏபிஐ மூலம் பேராசிரியர்களின் விரிவுரைகளைப் படியுங்கள்.",
    selectSurahLabel: "சூராவைத் தேர்ந்தெடுக்கவும்",
    selectAyahLabel: "வசன எண்",
    selectTafseerBook: "தஃப்ஸீர் நூல்",
    quickAyahsTitle: "முக்கிய வசனங்கள்",
    playRecitation: "ஓதுதலைக் கேளுங்கள்",
    pauseRecitation: "நிறுத்து",
    audioRecitation: "குர்ஆன் ஓதுதல் (மிஷாரி அல்-அஃபாஸி)",
    arabicVerse: "புனித குர்ஆன் வசனம் (உஸ்மானி வடிவம்)",
    meaningTranslation: "வசனத்தின் பொருள் விளக்கம்",
    scholarlyCommentary: "ஆய்வு விரிவுரை (தஃப்ஸீர்)",
    askAiAboutVerse: "இந்த வசனம் மற்றும் தஃப்ஸீர் பற்றி AI-யிடம் கேட்கவும்",
    bookmarkTafseer: "தஃப்ஸீரைச் சேமிக்கவும்",
    viewInVolume1Scan: "பாகம் 1 அசல் ஏட்டைப் பார்க்க",
    loadingTafseer: "நேரடி ஏபிஐயிலிருந்து தஃப்ஸீர் பெறப்படுகிறது...",
    liveApiStatus: "நேரடி தஃப்ஸீர் ஏபிஐ இணைக்கப்பட்டுள்ளது (Quran.com & AlQuran Cloud)",
    previousAyah: "முந்தைய வசனம்",
    nextAyah: "அடுத்த வசனம்",
    statusEngine: "பாகம் 1 கேள்வி-பதில் இயந்திரம் (முகத்திமா, அல்-ஃபாத்திஹா, அல்-பகரா, ஆல இம்ரான்)",
    newDiscussion: "புதிய உரையாடல்",
    welcomeTitle: "தஃப்ஹீமுல் குர்ஆன் ஆய்வு உதவியாளர்",
    welcomeDesc: "மௌலானா மௌதூதியின் தஃப்ஹீமுல் குர்ஆன் பாகம் 1 க்கான நம்பகமான ஆய்வு உதவியாளர். ஒவ்வொரு பதிலும் அசல் உரையாசிரியரின் விளக்கங்கள் மற்றும் மூல பக்கக் குறிப்புகளுடன் வழங்கப்படுகிறது.",
    featuredQuestions: "பாகம் 1 இன் முக்கிய வினாக்கள்",
    inputPlaceholder: "பாகம் 1 பற்றி ஏதேனும் கேட்கவும் (எ.கா: ஆயத்துல் குர்ஸியின் முக்கிய செய்தி என்ன? வட்டி ஏன் தடுக்கப்பட்டது?)",
    sendBtn: "அனுப்பு",
    inputNote: "பதில்கள் தஃப்ஹீமுல் குர்ஆன் (பாகம் 1, பக். 1–480) இலிருந்து மட்டுமே பெறப்படுகின்றன",
    researching: "விளக்கவுரை தேடப்படுகிறது...",
    analyzing: "பாகம் 1 இன் பக்கக் குறிப்புகள் திரட்டப்படுகின்றன...",
    citedPagesTitle: "பாகம் 1 இன் மேற்கோள் பக்கங்கள் & ஸ்கேன்கள்",
    inspectPage: "பக்கத்தை காண்க",
    openScan: "அசல் ஏடு",
    copy: "நகலெடு",
    copied: "நகலெடுக்கப்பட்டது",
    listen: "கேட்க",
    stopAudio: "நிறுத்து",
    save: "சேமிக்க",
    saved: "சேமிக்கப்பட்டது",
    page: "பக்கம்",
    pages: "பக்கங்கள்",
    verses: "வசனங்கள்",
    resetFilters: "வடிகட்டிகளை நீக்கு",
    searchPlaceholder: "தலைப்பு அல்லது வசனத்தை தேடுக (எ.கா. 2:255, ஆயத்துல் குர்ஸி, வட்டி, உஹுத், ஆதம்)...",
    thematicOverview: "கருப்பொருள் சுருக்கம்",
    commentaryNotes: "விரிவுரைக் குறிப்புகள்",
    textTranscript: "உரை வடிவம் (.txt)",
    scanViewer: "ஏடு பார்வை",
    openScanArchive: "Archive.org இல் வாசிக்க",
    askAboutPage: "இப்பக்கம் பற்றி AI-யிடம் கேட்கவும்",
    bookmarkPage: "பக்கத்தை சேமி",
    goToPage: "பக்க எண்:",
    jumpBtn: "செல்",
    savedNotesTitle: "சேமிக்கப்பட்ட குறிப்புகள்",
    savedNotesSubtitle: "முக்கிய தஃப்ஸீர் கருத்துக்கள் மற்றும் பதில்களைக் கொண்ட உங்கள் தனிப்பட்ட குறிப்பேடு.",
    noSavedNotes: "சேமிக்கப்பட்ட குறிப்புகள் ஏதுமில்லை",
    noSavedNotesDesc: "பக்கங்கள் அல்லது பதில்களில் உள்ள புக்மார்க் பொத்தானை அழுத்தி இங்கே சேமிக்கலாம்.",
    exportStudySheet: "ஆய்வுத்தாளாக மாற்றுக",
    copiedStudySheet: "ஆய்வுத்தாள் நகலெடுக்கப்பட்டது!",
    myNote: "என் குறிப்பு:",
    addNote: "குறிப்பு சேர்க்க",
    editNote: "குறிப்பை திருத்து",
    saveReflections: "குறிப்பை சேமி",
    cancel: "ரத்து செய்",
    languageSelect: "மொழி",
    sampleQuestions: [
      {
        question: "ஆயத்துல் குர்ஸியில் (2:255) இறைவனின் ஆதிக்கம் குறித்து மௌதூதி கூறும் விளக்கம் என்ன?",
        surah: "அல்-பகரா",
        pageRef: 270,
        category: "தவ்ஹீத் கொள்கை"
      },
      {
        question: "தஃப்ஹீமுல் குர்ஆனில் வட்டி (ரிபா) தடையையும் ஜகாத்தையும் எவ்வாறு ஒப்பிட்டு விளக்கியுள்ளார்?",
        surah: "அல்-பகரா",
        pageRef: 302,
        category: "பொருளாதாரம்"
      },
      {
        question: "முகத்திமாவில் (முன்னுரை) குர்ஆனைப் படிப்பதற்கான அடிப்படை வழிகாட்டுதல்கள் என்ன?",
        surah: "முகத்திமா",
        pageRef: 30,
        category: "குர்ஆன் விதிகள்"
      },
      {
        question: "அல்-ஃபாத்திஹா அத்தியாயம் குர்ஆனின் சாரம் என ஏன் அழைக்கப்படுகிறது? 'இய்யாக நஃபுது'வின் பொருள் என்ன?",
        surah: "அல்-ஃபாத்திஹா",
        pageRef: 40,
        category: "அல்-ஃபாத்திஹா"
      },
      {
        question: "ஆல இம்ரானில் உஹுத் போரின் படிப்பினைகளாக மௌதூதி எவற்றை விளக்குகிறார்?",
        surah: "ஆல இம்ரான்",
        pageRef: 445,
        category: "வரலாற்று படிப்பினை"
      },
      {
        question: "அல்-பகராவில் மனிதனை பூமியின் 'கலீஃபா' (பிரதிநிதி) ஆக்குவதன் நோக்கம் என்ன?",
        surah: "அல்-பகரா",
        pageRef: 63,
        category: "படைப்பின் நோக்கம்"
      }
    ]
  },
  ml: {
    appTitle: "തഫ്ഹീമുൽ ഖുർആൻ",
    appSubtitle: "സയ്യിദ് അബുൽ അഅ്ലാ മൗദൂദി",
    volumeBadge: "വാല്യം 1",
    tabChat: "ചോദ്യോത്തരങ്ങൾ",
    tabExplorer: "വാല്യം 1 വിശകലനം",
    tabViewer: "സ്കാൻ വായനശാല",
    tabTafseer: "തഫ്സീർ ഡാറ്റാബേസ്",
    tabBookmarks: "സൂക്ഷിച്ച കുറിപ്പുകൾ",
    tafseerDbTitle: "ഓൺലൈൻ ഖുർആൻ തഫ്സീർ ഡാറ്റാബേസ്",
    tafseerDbSubtitle: "എല്ലാ 114 സൂറത്തുകൾക്കുമായി ലൈവ് ആധികാരിക API വഴി പണ്ഡിത വ്യാഖ്യാനങ്ങൾ നേരിട്ട് വായിക്കാം.",
    selectSurahLabel: "സൂറത്ത് തിരഞ്ഞെടുക്കുക",
    selectAyahLabel: "സൂക്ത നമ്പർ",
    selectTafseerBook: "തഫ്സീർ ഗ്രന്ഥം",
    quickAyahsTitle: "പ്രധാനപ്പെട്ട സൂക്തങ്ങൾ",
    playRecitation: "പാരായണം കേൾക്കുക",
    pauseRecitation: "നിർത്തുക",
    audioRecitation: "ഖുർആൻ പാരായണം (മിശാരി അൽ-അഫാസി)",
    arabicVerse: "വിശുദ്ധ ഖുർആൻ സൂക്തം (ഉഥ്മാനി ലിപി)",
    meaningTranslation: "സൂക്തത്തിന്റെ അർത്ഥവിവരണങ്ങൾ",
    scholarlyCommentary: "ആധികാരിക തഫ്സീർ വ്യാഖ്യാനം",
    askAiAboutVerse: "ഈ സൂക്തത്തെയും തഫ്സീറിനെയും കുറിച്ച് AI-യോട് ചോദിക്കുക",
    bookmarkTafseer: "തഫ്സീർ സൂക്ഷിക്കുക",
    viewInVolume1Scan: "വാല്യം 1 മൂല സ്കാൻ കാണുക",
    loadingTafseer: "ലൈവ് തഫ്സീർ API-യിൽ നിന്ന് വ്യാഖ്യാനം ശേഖരിക്കുന്നു...",
    liveApiStatus: "ലൈവ് തഫ്സീർ API ലഭ്യമാണ് (Quran.com & AlQuran Cloud)",
    previousAyah: "മുൻപത്തെ സൂക്തം",
    nextAyah: "അടുത്ത സൂക്തം",
    statusEngine: "വാല്യം 1 ഖുർആൻ പഠന സഹായി (മുഖദ്ദിമ, അൽഫാതിഹ, അൽബഖറ, ആലുഇംറാൻ)",
    newDiscussion: "പുതിയ ചർച്ച",
    welcomeTitle: "തഫ്ഹീമുൽ ഖുർആൻ പഠന സഹായി",
    welcomeDesc: "സയ്യിദ് അബുൽ അഅ്ലാ മൗദൂദിയുടെ വിശ്വപ്രസിദ്ധ ഖുർആൻ വ്യാഖ്യാനമായ തഫ്ഹീമുൽ ഖുർആൻ വാല്യം 1 അടിസ്ഥാനമാക്കിയുള്ള സമഗ്ര സഹായി. എല്ലാ ഉത്തരങ്ങളും പേജ് നമ്പറുകളും മൂല ഗ്രന്ഥ സ്കാനുകളും സഹിതം ലഭ്യമാണ്.",
    featuredQuestions: "വാല്യം 1-ലെ പ്രധാന ചോദ്യങ്ങൾ",
    inputPlaceholder: "വാല്യം 1-നെ കുറിച്ച് എന്തും ചോദിക്കാം (ഉദാ: ആയത്തുൽ കുർസിയുടെ കാതൽ എന്താണ്? പലിശ നിരോധനം എങ്ങനെ വിശദീകരിക്കുന്നു?)",
    sendBtn: "അയക്കുക",
    inputNote: "ഉത്തരങ്ങൾ തഫ്ഹീമുൽ ഖുർആൻ (വാല്യം 1, പേജ് 1–480) അടിസ്ഥാനമാക്കി മാത്രം നൽകുന്നു",
    researching: "വ്യാഖ്യാനം തിരയുന്നു...",
    analyzing: "വാല്യം 1 ലെ പേജുകളും വ്യാഖ്യാനങ്ങളും പരിശോധിക്കുന്നു...",
    citedPagesTitle: "വാല്യം 1 ആധാരമാക്കിയ പേജുകൾ",
    inspectPage: "പേജ് കാണുക",
    openScan: "സ്കാൻ",
    copy: "പകർത്തുക",
    copied: "പകർത്തി",
    listen: "കേൾക്കുക",
    stopAudio: "നിർത്തുക",
    save: "സൂക്ഷിക്കുക",
    saved: "സൂക്ഷിച്ചു",
    page: "പേജ്",
    pages: "പേജുകൾ",
    verses: "സൂക്തങ്ങൾ",
    resetFilters: "ഫിൽട്ടറുകൾ മാറ്റുക",
    searchPlaceholder: "വിഷയമോ സൂക്തമോ തിരയുക (ഉദാ: 2:255, ആയത്തുൽ കുർസി, പലിശ, ഉഹുദ്, ആദം)...",
    thematicOverview: "വിഷയാധിഷ്ഠിത സംഗ്രഹം",
    commentaryNotes: "വ്യാഖ്യാന കുറിപ്പുകൾ",
    textTranscript: "ടെക്സ്റ്റ് രൂപം (.txt)",
    scanViewer: "സ്കാൻ കാഴ്ച",
    openScanArchive: "Archive.org-ൽ വായിക്കുക",
    askAboutPage: "ഈ പേജിനെക്കുറിച്ച് AI-യോട് ചോദിക്കുക",
    bookmarkPage: "പേജ് സൂക്ഷിക്കുക",
    goToPage: "പേജ് നമ്പർ:",
    jumpBtn: "പോകുക",
    savedNotesTitle: "സൂക്ഷിച്ച കുറിപ്പുകൾ",
    savedNotesSubtitle: "പ്രധാന തഫ്ഹീം വ്യാഖ്യാനങ്ങളും നിയമങ്ങളും ഉത്തരങ്ങളും അടങ്ങിയ നിങ്ങളുടെ നോട്ട്ബുക്ക്.",
    noSavedNotes: "കുറിപ്പുകളൊന്നും സൂക്ഷിച്ചിട്ടില്ല",
    noSavedNotesDesc: "ചോദ്യങ്ങൾ ചോദിക്കുമ്പോഴോ എക്സ്പ്ലോറർ കാണുമ്പോഴോ ബുക്ക്മാർക്ക് ബട്ടൺ അമർത്തി ഇവിടെ സൂക്ഷിക്കാം.",
    exportStudySheet: "പഠന ഷീറ്റ് പകർത്തുക",
    copiedStudySheet: "പഠന ഷീറ്റ് പകർത്തി!",
    myNote: "എന്റെ കുറിപ്പ്:",
    addNote: "കുറിപ്പ് ചേർക്കുക",
    editNote: "കുറിപ്പ് മാറ്റുക",
    saveReflections: "കുറിപ്പ് സൂക്ഷിക്കുക",
    cancel: "റദ്ദാക്കുക",
    languageSelect: "ഭാഷ",
    sampleQuestions: [
      {
        question: "തഫ്ഹീമുൽ ഖുർആനിൽ ആയത്തുൽ കുർസിയെയും (2:255) അല്ലാഹുവിന്റെ പരമാധികാരത്തെയും കുറിച്ച് മൗദൂദി എന്താണ് വിശദീകരിക്കുന്നത്?",
        surah: "അൽബഖറ",
        pageRef: 270,
        category: "തൗഹീദും വിശ്വാസവും"
      },
      {
        question: "പലിശ നിരോധനവും സകാത്തിന്റെ പങ്കും തമ്മിലുള്ള സാമ്പത്തിക വിവേചനം എങ്ങനെയാണ് തഫ്ഹീമിൽ വ്യക്തമാക്കുന്നത്?",
        surah: "അൽബഖറ",
        pageRef: 302,
        category: "സാമ്പത്തിക ശാസ്ത്രം"
      },
      {
        question: "ഖുർആൻ പഠനത്തിനായി മുഖദ്ദിമയിൽ നൽകിയിട്ടുള്ള അടിസ്ഥാന നിർദ്ദേശങ്ങൾ എന്തൊക്കെയാണ്?",
        surah: "മുഖദ്ദിമ",
        pageRef: 30,
        category: "ഖുർആനിക തത്ത്വങ്ങൾ"
      },
      {
        question: "സൂറതുൽ ഫാതിഹ ഖുർആന്റെ സംഗ്രഹമായി കണക്കാക്കപ്പെടുന്നത് എന്തുകൊണ്ട്? 'ഇയ്യാക നഅ്ബുദു' എന്നതിന്റെ അർത്ഥം എന്താണ്?",
        surah: "അൽഫാതിഹ",
        pageRef: 40,
        category: "സൂറതുൽ ഫാതിഹ"
      },
      {
        question: "സൂറത്തു ആലു ഇംറാനിൽ ഉഹുദ് യുദ്ധത്തിൽ നിന്ന് മൗദൂദി നൽകുന്ന ഗുണപാഠങ്ങൾ എന്തൊക്കെയാണ്?",
        surah: "ആലുഇംറാൻ",
        pageRef: 445,
        category: "ചരിത്ര പാഠങ്ങൾ"
      },
      {
        question: "അൽബഖറയിൽ മനുഷ്യനെ ഭൂമിയിലെ 'ഖലീഫ' (പ്രതിനിധി) ആക്കിയതിന്റെ അർത്ഥമെന്താണ്?",
        surah: "അൽബഖറ",
        pageRef: 63,
        category: "സൃഷ്ടി ഉദ്ദേശ്യം"
      }
    ]
  },
  kn: {
    appTitle: "ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್",
    appSubtitle: "ಸಯ್ಯಿದ್ ಅಬುಲ್ ಅಹ್ಲಾ ಮೌದೂದಿ",
    volumeBadge: "ಸಂಪುಟ 1",
    tabChat: "ಪ್ರಶ್ನೋತ್ತರ",
    tabExplorer: "ಸಂಪುಟ 1 ಅನ್ವೇಷಕ",
    tabViewer: "ಮೂಲ ಪುಟ ವಾಚಕ",
    tabTafseer: "ತಫ್ಸೀರ್ ಡೇಟಾಬೇಸ್",
    tabBookmarks: "ಉಳಿಸಿದ ಟಿಪ್ಪಣಿಗಳು",
    tafseerDbTitle: "ಆನ್‌ಲೈನ್ ಕುರ್ಆನ್ ತಫ್ಸೀರ್ ಡೇಟಾಬೇಸ್",
    tafseerDbSubtitle: "ಎಲ್ಲಾ 114 ಸೂರಾಗಳಿಗೆ ಲೈವ್ ಅಧಿಕೃತ API ಮೂಲಕ ವಿದ್ವಾಂಸರ ವಿವರಣೆಗಳನ್ನು ನೇರವಾಗಿ ಓದಿ.",
    selectSurahLabel: "ಸೂರಾ ಆಯ್ಕೆಮಾಡಿ",
    selectAyahLabel: "ಆಯತ್ ಸಂಖ್ಯೆ",
    selectTafseerBook: "ತಫ್ಸೀರ್ ಗ್ರಂಥ",
    quickAyahsTitle: "ಪ್ರಮುಖ ಆಯತ್‌ಗಳು",
    playRecitation: "ತಿಲಾವತ್ ಆಲಿಸಿ",
    pauseRecitation: "ನಿಲ್ಲಿಸಿ",
    audioRecitation: "ಆಯತ್ ಪಠಣ (ಮಿಶಾರಿ ಅಲ್-ಅಫಾಸಿ)",
    arabicVerse: "ಪವಿತ್ರ ಕುರ್ಆನ್ ಆಯತ್ (ಉಸ್ಮಾನಿ ಲಿಪಿ)",
    meaningTranslation: "ಆಯತ್‌ನ ಭಾವಾರ್ಥ ಮತ್ತು ಅನುವಾದ",
    scholarlyCommentary: "ಅಧಿಕೃತ ತಫ್ಸೀರ್ ವಿವರಣೆ",
    askAiAboutVerse: "ಈ ಆಯತ್ ಮತ್ತು ತಫ್ಸೀರ್ ಬಗ್ಗೆ AI ಗೆ ಪ್ರಶ್ನಿಸಿ",
    bookmarkTafseer: "ತಫ್ಸೀರ್ ಉಳಿಸಿ",
    viewInVolume1Scan: "ಸಂಪುಟ 1 ಮೂಲ ಸ್ಕ್ಯಾನ್ ನೋಡಿ",
    loadingTafseer: "ಲೈವ್ ತಫ್ಸೀರ್ API ನಿಂದ ವಿವರಣೆ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    liveApiStatus: "ಲೈವ್ ತಫ್ಸೀರ್ API ಸಕ್ರಿಯವಾಗಿದೆ (Quran.com & AlQuran Cloud)",
    previousAyah: "ಹಿಂದಿನ ಆಯತ್",
    nextAyah: "ಮುಂದಿನ ಆಯತ್",
    statusEngine: "ಸಂಪುಟ 1 ಅಧ್ಯಯನ ಸಹಾಯಕ (ಮುಖದ್ದಿಮಾ, ಅಲ್-ಫಾತಿಹಾ, ಅಲ್-ಬಖರಾ, ಆಲಿ ಇಮ್ರಾನ್)",
    newDiscussion: "ಹೊಸ ಚರ್ಚೆ",
    welcomeTitle: "ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್ ಪ್ರಶ್ನೋತ್ತರ ಸಹಾಯಕ",
    welcomeDesc: "ಸಯ್ಯಿದ್ ಅಬುಲ್ ಅಹ್ಲಾ ಮೌದೂದಿಯವರ ಜಗತ್ಪ್ರಸಿದ್ಧ ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್ ಸಂಪುಟ 1 ರ ಅಧಿಕೃತ ಅಧ್ಯಯನ ಸಹಾಯಕ. ಪ್ರತಿಯೊಂದು ಉತ್ತರವೂ ಮೂಲ ವಿವರಣೆ ಮತ್ತು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಪುಟಗಳ ಆಧಾರದ ಮೇಲೆ ಲಭ್ಯವಿದೆ.",
    featuredQuestions: "ಸಂಪುಟ 1 ರ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳು",
    inputPlaceholder: "ಸಂಪುಟ 1 ರ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ (ಉದಾ: ಆಯತುಲ್ ಕುರ್ಸಿಯ ಸಂದೇಶವೇನು? ಬಡ್ಡಿ ನಿಷೇಧವನ್ನು ಹೇಗೆ ವಿವರಿಸಲಾಗಿದೆ?)",
    sendBtn: "ಕಳುಹಿಸಿ",
    inputNote: "ಉತ್ತರಗಳು ಕೇವಲ ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್ (ಸಂಪುಟ 1, ಪುಟ 1–480) ಆಧರಿಸಿವೆ",
    researching: "ವಿವರಣೆ ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    analyzing: "ಪುಟ ಉಲ್ಲೇಖಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    citedPagesTitle: "ಸಂಪುಟ 1 ರ ಉಲ್ಲೇಖಿತ ಪುಟಗಳು",
    inspectPage: "ಪುಟ ಪರಿಶೀಲಿಸಿ",
    openScan: "ಸ್ಕ್ಯಾನ್",
    copy: "ನಕಲಿಸಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ",
    listen: "ಕೇಳಿ",
    stopAudio: "ನಿಲ್ಲಿಸಿ",
    save: "ಉಳಿಸಿ",
    saved: "ಉಳಿಸಲಾಗಿದೆ",
    page: "ಪುಟ",
    pages: "ಪುಟಗಳು",
    verses: "ವಾಕ್ಯಗಳು",
    resetFilters: "ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ",
    searchPlaceholder: "ವಿಷಯ ಅಥವಾ ವಾಕ್ಯ ಹುಡುಕಿ (ಉದಾ: 2:255, ಆಯತುಲ್ ಕುರ್ಸಿ, ಬಡ್ಡಿ, ಉಹುದ್, ಆದಮ್)...",
    thematicOverview: "ವಿಷಯಾವಲೋಕನ",
    commentaryNotes: "ವಿವರಣಾ ಟಿಪ್ಪಣಿ",
    textTranscript: "ಪಠ್ಯ ರೂಪ (.txt)",
    scanViewer: "ಪುಟ ವೀಕ್ಷಕ",
    openScanArchive: "Archive.org ನಲ್ಲಿ ಓದಿ",
    askAboutPage: "ಈ ಪುಟದ ಬಗ್ಗೆ AI ಗೆ ಕೇಳಿ",
    bookmarkPage: "ಪುಟ ಉಳಿಸಿ",
    goToPage: "ಪುಟ ಸಂಖ್ಯೆ:",
    jumpBtn: "ಹೋಗಿ",
    savedNotesTitle: "ಉಳಿಸಿದ ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು",
    savedNotesSubtitle: "ಪ್ರಮುಖ ತಫ್ಸೀರ್ ಭಾಗಗಳು ಮತ್ತು ಉತ್ತರಗಳ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿ ಪುಸ್ತಕ.",
    noSavedNotes: "ಯಾವುದೇ ಟಿಪ್ಪಣಿಗಳನ್ನು ಉಳಿಸಲಾಗಿಲ್ಲ",
    noSavedNotesDesc: "ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುವಾಗ ಅಥವಾ ಅನ್ವೇಷಿಸುವಾಗ ಬುಕ್‌ಮಾರ್ಕ್ ಬಟನ್ ಒತ್ತಿ ಇಲ್ಲಿ ಉಳಿಸಿಕೊಳ್ಳಬಹುದು.",
    exportStudySheet: "ಅಧ್ಯಯನ ಶೀಟ್ ರಫ್ತು ಮಾಡಿ",
    copiedStudySheet: "ಅಧ್ಯಯನ ಶೀಟ್ ನಕಲಿಸಲಾಗಿದೆ!",
    myNote: "ನನ್ನ ಟಿಪ್ಪಣಿ:",
    addNote: "ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ",
    editNote: "ಟಿಪ್ಪಣಿ ತಿದ್ದಿ",
    saveReflections: "ಟಿಪ್ಪಣಿ ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    languageSelect: "ಭಾಷೆ",
    sampleQuestions: [
      {
        question: "ತಫ್ಹೀಮುಲ್ ಕುರ್ಆನ್‌ನಲ್ಲಿ ಆಯತುಲ್ ಕುರ್ಸಿ (2:255) ಮತ್ತು ಅಲ್ಲಾಹನ ಸಾರ್ವಭೌಮತ್ವದ ಕುರಿತು ಮೌದೂದಿ ಅವರ ವಿವರಣೆ ಏನು?",
        surah: "ಅಲ್-ಬಖರಾ",
        pageRef: 270,
        category: "ತೌಹೀದ್ ಮತ್ತು ನಂಬಿಕೆ"
      },
      {
        question: "ಬಡ್ಡಿ (ರಿಬಾ) ನಿಷೇಧ ಮತ್ತು ಝಕಾತ್ ಆರ್ಥಿಕತೆಯ ಮಹತ್ವವನ್ನು ತಫ್ಹೀಮ್‌ನಲ್ಲಿ ಹೇಗೆ ವಿವರಿಸಲಾಗಿದೆ?",
        surah: "ಅಲ್-ಬಖರಾ",
        pageRef: 302,
        category: "ಅರ್ಥಶಾಸ್ತ್ರ"
      },
      {
        question: "ಕುರ್ಆನ್ ಅಧ್ಯಯನಕ್ಕಾಗಿ ಮುಖದ್ದಿಮಾದಲ್ಲಿ (ಮುನ್ನುಡಿ) ನೀಡಿರುವ ಮೂಲಭೂತ ಮಾರ್ಗದರ್ಶಿ ಸೂತ್ರಗಳೇನು?",
        surah: "ಮುಖದ್ದಿಮಾ",
        pageRef: 30,
        category: "ಕುರ್ಆನಿಕ್ ತತ್ವಗಳು"
      },
      {
        question: "ಸೂರಾ ಅಲ್-ಫಾತಿಹಾವನ್ನು ಕುರ್ಆನ್‌ನ ಸಾರಾಂಶ ಎಂದು ಏಕೆ ಕರೆಯಲಾಗುತ್ತದೆ? 'ಇಯ್ಯಾಕ ನಅ್ಬುದು' ನ ಅರ್ಥವೇನು?",
        surah: "ಅಲ್-ಫಾತಿಹಾ",
        pageRef: 40,
        category: "ಸೂರಾ ಅಲ್-ಫಾತಿಹಾ"
      },
      {
        question: "ಸೂರಾ ಆಲಿ ಇಮ್ರಾನ್‌ನಲ್ಲಿ ಉಹುದ್ ಕದನದ ಪಾಠಗಳ ಕುರಿತು ಮೌದೂದಿ ಅವರು ನೀಡುವ ವಿಶ್ಲೇಷಣೆ ಏನು?",
        surah: "ಆಲಿ ಇಮ್ರಾನ್",
        pageRef: 445,
        category: "ಐತಿಹಾಸಿಕ ಪಾಠಗಳು"
      },
      {
        question: "ಅಲ್-ಬಖರಾದಲ್ಲಿ ಮನುಷ್ಯನನ್ನು ಭೂಮಿಯ 'ಖಲೀಫ' (ಪ್ರತಿನಿಧಿ) ಎಂದು ನೇಮಿಸುವ ಉದ್ದೇಶವೇನು?",
        surah: "ಅಲ್-ಬಖರಾ",
        pageRef: 63,
        category: "ಮಾನವ ಉದ್ದೇಶ"
      }
    ]
  }
};
