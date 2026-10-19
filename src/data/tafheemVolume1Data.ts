export interface Volume1PageEntry {
  page: number;
  surahNumber?: number;
  surahName?: string;
  surahNameArabic?: string;
  verseRange?: string;
  sectionTitle: string;
  arabicSnippet?: string;
  summary: string;
  keyThemes: string[];
  tafseerExcerpt: string;
  scanUrl: string;
}

export interface SurahOverview {
  number: number;
  name: string;
  arabicName: string;
  englishMeaning: string;
  totalVerses: number;
  pageStart: number;
  pageEnd: number;
  period: 'Makkan' | 'Madinan';
  coreThemes: string[];
  historicalContext: string;
}

export const ARCHIVE_BASE_URL = "https://archive.org/details/tafheem-ul-quran-volume-1";
export const getScanUrl = (page: number) => `https://archive.org/details/tafheem-ul-quran-volume-1/page/n${page}/mode/2up`;

export const SURAH_OVERVIEWS: SurahOverview[] = [
  {
    number: 0,
    name: "Muqaddimah (Introduction to the Quran)",
    arabicName: "مقدمة تفهيم القرآن",
    englishMeaning: "Principles of Quranic Guidance & Study",
    totalVerses: 0,
    pageStart: 1,
    pageEnd: 32,
    period: "Makkan",
    coreThemes: [
      "The nature and central theme of the Quran",
      "Why the Quran is not organized like an ordinary textbook",
      "The divine purpose: Guidance (Hidayah) to righteous living",
      "Methodology of revelation across 23 years of prophetic struggle",
      "How to approach the commentary with an open and reflective heart"
    ],
    historicalContext: "Sayyid Abul A'la Maududi outlines the foundational approach to understanding the Quran as a revolutionary message revealed gradually to guide an active movement in history."
  },
  {
    number: 1,
    name: "Al-Fatihah",
    arabicName: "الفاتحة",
    englishMeaning: "The Opening",
    totalVerses: 7,
    pageStart: 33,
    pageEnd: 46,
    period: "Makkan",
    coreThemes: [
      "The essence of the entire Quranic message",
      "Bismillah: consecrating action in Allah's merciful name",
      "Tawhid of Lordship, Mercy, and Divine Judgment",
      "The Bilateral Covenant: 'You alone we worship and You alone we ask for help'",
      "Supplication for the Straight Path (Sirat al-Mustaqim)"
    ],
    historicalContext: "Revealed at the very onset of the Prophet's public mission in Makkah. It forms the preamble to the Quran; if Al-Fatihah is the prayer of the seeker, the rest of the Quran is the divine answer."
  },
  {
    number: 2,
    name: "Al-Baqarah",
    arabicName: "البقرة",
    englishMeaning: "The Cow",
    totalVerses: 286,
    pageStart: 47,
    pageEnd: 320,
    period: "Madinan",
    coreThemes: [
      "Classification of humanity: Muttaqin, Kafirin, and Munafiqin",
      "Creation of Adam and man's responsibility as Khalifah (vicegerent)",
      "Address to the Children of Israel: covenant, historical lapses, and the story of the Cow",
      "Ibrahim's legacy, the building of the Ka'bah, and shift of the Qiblah",
      "Legislation: Fasting in Ramadan, Qisas, Wills, Warfare, Hajj, Marriage & Divorce",
      "Ayat al-Kursi (2:255): Supreme declaration of Divine Sovereignty",
      "Infaq (charity) vs. total prohibition of Riba (Usury/Interest)",
      "The longest verse on documentation of debts (2:282) and the concluding supplication (2:284-286)"
    ],
    historicalContext: "Revealed primarily in the early Madinan period (1-2 A.H.) when the newly founded Muslim community in Madinah required civil laws, statecraft guidance, and ideological defense against hypocrisy and skepticism."
  },
  {
    number: 3,
    name: "Ali 'Imran",
    arabicName: "آل عمران",
    englishMeaning: "The Family of Imran",
    totalVerses: 200,
    pageStart: 321,
    pageEnd: 480,
    period: "Madinan",
    coreThemes: [
      "Clear verses (Muhkamat) vs allegorical verses (Mutashabihat)",
      "Dialogue with Christians of Najran: true nature of Maryam and Prophet Isa (Jesus)",
      "Refutation of Christian dogma of Trinity and Divine Incarnation",
      "Call to the Common Word (Kalimatin Sawa')",
      "The concept of 'Khayra Ummah' (Best Community) enjoining good and forbidding evil",
      "Comprehensive analysis of the Battle of Uhud: military discipline, testing of faith, divine forgiveness, and steadfastness (Sabr)",
      "The reflection of the People of Understanding (Ulul Albab) upon cosmic signs"
    ],
    historicalContext: "Revealed in Madinah between the Battle of Badr (2 A.H.) and the aftermath of the Battle of Uhud (3 A.H.), as well as following the visit of the Christian delegation from Najran (9-10 A.H.)."
  }
];

export const VOLUME_1_PAGES: Volume1PageEntry[] = [
  {
    page: 5,
    sectionTitle: "Muqaddimah: Nature and Central Theme of the Quran",
    summary: "Maududi clarifies that the Quran is not a textbook on religion, law, or science, but a Book of Guidance (Hidayah) addressed directly to human consciousness.",
    keyThemes: ["Quranic Guidance", "Methodology", "Divine Communication", "Hidayah"],
    tafseerExcerpt: "The reader must grasp from the beginning that the Quran does not treat subjects in the manner of ordinary treatises with sequential chapters on dogmas, morals, and laws. Its central theme is Man: his real position in the universe, his deviation from the truth, and the guidance sent by the Creator to restore his balance.",
    scanUrl: getScanUrl(5)
  },
  {
    page: 18,
    sectionTitle: "Muqaddimah: Why the Quran was Revealed in Stages over 23 Years",
    summary: "Explains the dynamic, revolutionary nature of revelation accompanying the physical struggles, crises, and victories of the Prophet and early believers.",
    keyThemes: ["Gradual Revelation", "Prophetic Struggle", "Historic Context", "Movement"],
    tafseerExcerpt: "The Quran was not delivered as an encyclopedia dropped all at once from heaven. It was revealed in response to living situations as the Islamic movement fought against jahiliyyah, step by step, shaping characters, directing battles, and reforming society in real time.",
    scanUrl: getScanUrl(18)
  },
  {
    page: 30,
    sectionTitle: "Muqaddimah: Guidelines for the Student of Tafheem-ul-Quran",
    summary: "How a sincere student should approach the study of the Quran without preconceived sectarian biases, seeking sincere understanding and practical action.",
    keyThemes: ["Method of Study", "Sincerity", "Avoiding Dogmatism", "Practical Faith"],
    tafseerExcerpt: "To comprehend the Quran, one must discard mental reservations and sectarian lenses. One should approach it as a thirsty traveler seeking clean water, reflecting deeply on how each injunction applies to modern human dignity and societal justice.",
    scanUrl: getScanUrl(30)
  },
  {
    page: 35,
    surahNumber: 1,
    surahName: "Al-Fatihah",
    surahNameArabic: "الفاتحة",
    verseRange: "1:1-2",
    arabicSnippet: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    sectionTitle: "Al-Fatihah: Consecration and Universal Praise of the Sustainer",
    summary: "Commentary on Bismillah and Rabb al-Alamin. Maududi explains 'Rabb' as not merely Creator, but Sovereign Nourisher, Master, and Sustainer of all existence.",
    keyThemes: ["Bismillah", "Rabb al-Alamin", "Divine Mercy", "Tawhid of Lordship"],
    tafseerExcerpt: "The word 'Rabb' encompasses the idea of bringing up, cherishing, maintaining, educating, and exercising absolute sovereignty. When man proclaims 'Alhamdu lillahi Rabbil-'Alamin', he acknowledges that all praise, gratitude, and obedience belong unconditionally to the One who sustains every realm.",
    scanUrl: getScanUrl(35)
  },
  {
    page: 40,
    surahNumber: 1,
    surahName: "Al-Fatihah",
    surahNameArabic: "الفاتحة",
    verseRange: "1:4-6",
    arabicSnippet: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    sectionTitle: "Al-Fatihah: The Core Covenant and Request for the Straight Path",
    summary: "Exegesis of 'Iyyaka Na'budu' (You alone we worship) and 'Ihdina as-Sirat al-Mustaqim'. The rejection of all servitude to tyrants and false gods.",
    keyThemes: ["Iyyaka Na'budu", "Exclusive Worship", "Sirat al-Mustaqim", "Supplication"],
    tafseerExcerpt: "This verse is the central pivot of the entire Quranic message. By saying 'You alone we worship', the believer declares total liberation from all earthly tyrannies, superstitions, and self-made deities. 'Ibadah' here signifies total surrender and obedience in every department of life.",
    scanUrl: getScanUrl(40)
  },
  {
    page: 44,
    surahNumber: 1,
    surahName: "Al-Fatihah",
    surahNameArabic: "الفاتحة",
    verseRange: "1:7",
    arabicSnippet: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    sectionTitle: "Al-Fatihah: The Favored Path vs. The Incurred Wrath and Astray",
    summary: "Analysis of the path of the Prophets, truthful, martyrs, and righteous, contrasted with those who knew the truth but rebelled, or who drifted into emotional deviation.",
    keyThemes: ["Righteous Path", "Maghdub 'Alayhim", "Dallin", "Historical Lessons"],
    tafseerExcerpt: "The 'favored path' is that walked by the Prophets, the truthful (Siddiqin), the martyrs (Shuhada), and the righteous (Salihin). 'Those who incurred wrath' are those who possess knowledge but corrupt it for worldly gain, while 'the lost' are those who lack authentic knowledge and invent fanciful dogmas in religion.",
    scanUrl: getScanUrl(44)
  },
  {
    page: 50,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:1-5",
    arabicSnippet: "الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    sectionTitle: "Al-Baqarah: Characteristics of the Muttaqin (God-Conscious)",
    summary: "Exposition of Taqwa: belief in the Unseen (Ghayb), establishing regular prayer (Salah), spending out of divine bounty (Infaq), and certainty in the Hereafter.",
    keyThemes: ["Taqwa", "Belief in Ghayb", "Prayer and Infaq", "Divine Guidance"],
    tafseerExcerpt: "Taqwa is not passive asceticism; it is moral alertness, the state of vigilance in which one guards oneself against offending Allah, walking through the thorny path of life with garments carefully gathered.",
    scanUrl: getScanUrl(50)
  },
  {
    page: 56,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:8-16",
    arabicSnippet: "وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ",
    sectionTitle: "Al-Baqarah: The Psychology and Deception of Hypocrisy (Nifaq)",
    summary: "Maududi's famous psychological dissection of hypocrites: claiming to make peace while causing corruption, cowardice, and inner intellectual disease.",
    keyThemes: ["Munafiqin", "Hypocrisy", "Psychological Analysis", "Fasad (Corruption)"],
    tafseerExcerpt: "Maududi observes that the hypocrite is torn by split loyalty: he wishes to reap the benefits of belonging to the community of faith without bearing the sacrifices, risk, and moral discipline demanded by sincere conviction.",
    scanUrl: getScanUrl(56)
  },
  {
    page: 63,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:30-34",
    arabicSnippet: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
    sectionTitle: "Al-Baqarah: The Appointment of Man as Khalifah (Vicegerent)",
    summary: "The dialogue between Allah and the angels regarding the creation of Adam; the meaning of Khalifah and the test of moral autonomy.",
    keyThemes: ["Khalifah", "Creation of Adam", "Angels' Question", "Knowledge of Names"],
    tafseerExcerpt: "Vicegerency (Khilafah) does not mean sovereignty; man is an authorized deputy with delegated authority on earth, given the faculties of intellect, speech, and moral choice to implement the Sovereign Creator's will on earth.",
    scanUrl: getScanUrl(63)
  },
  {
    page: 68,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:34-39",
    arabicSnippet: "وَإِذْ قُلْنَا لِلْمَلَائِكَةِ اسْجُدُوا لِآدَمَ فَسَجَدُوا إِلَّا إِبْلِيسَ أَبَىٰ وَاسْتَكْبَرَ",
    sectionTitle: "Al-Baqarah: The Arrogance of Iblis and the Descent to Earth",
    summary: "The refusal of Iblis to prostrate out of racial superiority ('I am made of fire, he of clay'); the deception in the garden and divine repentance accepted from Adam.",
    keyThemes: ["Iblis", "Kibr (Arrogance)", "Tawbah (Repentance)", "Human Dignity"],
    tafseerExcerpt: "Iblis became the premier rebel not through ignorance of God's existence, but through self-righteous pride and disobedience to a direct divine command. Contrast this with Adam, who acknowledged his slip and sought forgiveness immediately.",
    scanUrl: getScanUrl(68)
  },
  {
    page: 84,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:40-48",
    arabicSnippet: "يَا بَنِي إِسْرَائِيلَ اذْكُرُوا نِعْمَتِيَ الَّتِي أَنْعَمْتُ عَلَيْكُمْ",
    sectionTitle: "Al-Baqarah: Direct Call to the Children of Israel (Bani Isra'il)",
    summary: "Reminding Bani Isra'il of their historical election, divine favors, liberation from Pharaoh, and the danger of concealing prophetic signs for small monetary gains.",
    keyThemes: ["Bani Isra'il", "Covenant", "Concealing Truth", "Historical Election"],
    tafseerExcerpt: "Maududi highlights that the reprimands directed at the Jews of Madinah are equally warnings to the Muslim Ummah: when a religious community falls into clericalism, scholastic hair-splitting, and moral compromise, divine favor turns to censure.",
    scanUrl: getScanUrl(84)
  },
  {
    page: 98,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:67-74",
    arabicSnippet: "وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِ إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تَذْبَحُوا بَقَرَةً",
    sectionTitle: "Al-Baqarah: The Parable of the Slaughtered Cow and Evasion of Duty",
    summary: "The historical episode giving the Surah its name: the Israelites asked repeatedly for trivial details to delay obeying Musa's simple command.",
    keyThemes: ["Story of the Cow", "Legal Evasion", "Hardened Hearts", "Pure Obedience"],
    tafseerExcerpt: "The story of the cow serves as a profound psychological lesson on how a degenerate community invents unnecessary legalistic technicalities to escape the spirit of an ethical command, ultimately making religion burdensome for itself.",
    scanUrl: getScanUrl(98)
  },
  {
    page: 142,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:124-130",
    arabicSnippet: "وَإِذِ ابْتَلَىٰ إِبْرَاهِيمَ رَبُّهُ بِكَلِمَاتٍ فَأَتَمَّهُنَّ ۖ قَالَ إِنِّي جَاعِلُكَ لِلنَّاسِ إِمَامًا",
    sectionTitle: "Al-Baqarah: The Testing of Ibrahim and Building of the Ka'bah",
    summary: "Prophet Ibrahim completes every trial and is crowned Imam of mankind; building the House of Allah in Makkah with Ismail, praying for the final Messenger.",
    keyThemes: ["Ibrahim (Abraham)", "Imam of Mankind", "Building Ka'bah", "Supplication for Prophet"],
    tafseerExcerpt: "Ibrahim's leadership was granted not on grounds of race or genealogy, but on the basis of absolute moral fidelity and unhesitating readiness to sacrifice everything for the Creator.",
    scanUrl: getScanUrl(142)
  },
  {
    page: 154,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:142-150",
    arabicSnippet: "سَيَقُولُ السُّفَهَاءُ مِنَ النَّاسِ مَا وَلَّاهُمْ عَن قِبْلَتِهِمُ الَّتِي كَانُوا عَلَيْهَا",
    sectionTitle: "Al-Baqarah: The Change of the Qiblah and the 'Middle Nation' (Ummatan Wasata)",
    summary: "The reorientation of prayer from Jerusalem to Makkah symbolizing the transfer of spiritual stewardship to the Muslim community as witnesses to humanity.",
    keyThemes: ["Change of Qiblah", "Ummatan Wasata", "Spiritual Stewardship", "Universal Mission"],
    tafseerExcerpt: "The change of Qiblah was not a geographic dispute; it signified the decisive end of Jewish spiritual monopoly and the establishment of an independent, universal center of unity for the global fraternity of believers.",
    scanUrl: getScanUrl(154)
  },
  {
    page: 180,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:177",
    arabicSnippet: "لَّيْسَ الْبِرَّ أَن تُوَلُّوا وُجُوهَكُمْ قِبَلَ الْمَشْرِقِ وَالْمَغْرِبِ وَلَٰكِنَّ الْبِرَّ مَنْ آمَنَ بِاللَّهِ",
    sectionTitle: "Al-Baqarah: The Comprehensive Definition of Righteousness (Al-Birr)",
    summary: "Righteousness is not mere ritual mechanics: it combines sound faith in Allah, Angels, Books, Prophets, spending beloved wealth on relatives, orphans, the poor, and honoring treaties.",
    keyThemes: ["Ayat al-Birr", "True Righteousness", "Social Justice", "Integrity of Character"],
    tafseerExcerpt: "Verse 177 demolishes ritual formalism. Turning one's face toward the east or west is an external orientation; genuine piety lies in living faith combined with open-handed charity, justice, patience under trial, and steadfast integrity.",
    scanUrl: getScanUrl(180)
  },
  {
    page: 194,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:183-187",
    arabicSnippet: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    sectionTitle: "Al-Baqarah: Injunctions and Spiritual Philosophy of Ramadan Fasting",
    summary: "Fasting prescribed to cultivate Taqwa (self-mastery and God-consciousness); celebration of the month in which the Quran was revealed.",
    keyThemes: ["Ramadan Fasting", "Taqwa", "Revelation of Quran", "Spiritual Discipline"],
    tafseerExcerpt: "Fasting trains the believer in moral willpower. By abstaining from lawful food, drink, and intimacy from dawn to dusk for a month, one builds the moral resistance required to shun unlawful desires throughout the remaining eleven months.",
    scanUrl: getScanUrl(194)
  },
  {
    page: 203,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:190-194",
    arabicSnippet: "وَقَاتِلُوا فِي سَبِيلِ اللَّهِ الَّذِينَ يُقَاتِلُونَكُمْ وَلَا تَعْتَدُوا ۚ إِنَّ اللَّهَ لَا يُحِبُّ الْمُعْتَدِينَ",
    sectionTitle: "Al-Baqarah: Rules of Warfare and Fighting against Oppression",
    summary: "War is permitted solely in self-defense and to eliminate religious persecution (Fitnah). Strict prohibition of aggression and excess.",
    keyThemes: ["Rules of Jihad", "Prohibition of Aggression", "Ending Fitnah", "Defensive War"],
    tafseerExcerpt: "Islam permits the sword only as a scalpel in the surgeon's hand: to excise oppression and safeguard religious freedom. Fighting is bounded strictly by ethics; non-combatants, property, and natural resources must never be harmed.",
    scanUrl: getScanUrl(203)
  },
  {
    page: 235,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:228-232",
    arabicSnippet: "وَالْمُطَلَّقَاتُ يَتَرَبَّصْنَ بِأَنفُسِهِنَّ ثَلَاثَةَ قُرُوءٍ",
    sectionTitle: "Al-Baqarah: Marital Ethics, Divorce (Talaq), and Protection of Women",
    summary: "Maududi explains the phased, compassionate nature of divorce in Islam: preservation of dignity, three menstrual waiting periods, prohibition of revoking gifts.",
    keyThemes: ["Family Law", "Talaq (Divorce)", "Rights of Women", "Reconciliation"],
    tafseerExcerpt: "Islamic law structures divorce to prevent impulsive breakups and protect women from economic exploitation. The waiting period (Iddah) provides a sober window for reconciliation while guaranteeing the lineage of unborn children.",
    scanUrl: getScanUrl(235)
  },
  {
    page: 260,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:246-251",
    arabicSnippet: "كَم مِّن فِئَةٍ قَلِيلَةٍ غَلَبَتْ فِئَةً كَثِيرَةً بِإِذْنِ اللَّهِ ۗ وَاللَّهُ مَعَ الصَّابِرِينَ",
    sectionTitle: "Al-Baqarah: Talut (Saul), Jalut (Goliath), and the Test of Faith",
    summary: "The small disciplined company of believers defeats an overwhelmingly larger host through steadfast patience (Sabr) and divine backing; young Dawud slays Jalut.",
    keyThemes: ["Talut and Jalut", "Quality over Quantity", "Moral Endurance", "Dawud (David)"],
    tafseerExcerpt: "Victory in the divine scale does not depend on numbers or material superiority. A small band of morally disciplined, God-conscious believers can overturn massive armies when sustained by genuine conviction and reliance on Allah.",
    scanUrl: getScanUrl(260)
  },
  {
    page: 270,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:255",
    arabicSnippet: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    sectionTitle: "Al-Baqarah: Ayat al-Kursi (The Throne Verse) - Exegesis of Tawhid",
    summary: "Maududi's profound commentary on Ayat al-Kursi: Allah's self-subsistence (Al-Hayy, Al-Qayyum), sovereign mastery over the heavens and earth, and rejection of all autonomous intercession.",
    keyThemes: ["Ayat al-Kursi", "Al-Hayy Al-Qayyum", "The Throne", "Cosmic Sovereignty"],
    tafseerExcerpt: "Ayat al-Kursi is the supreme proclamation of pure monotheism. Allah alone is Self-Existent and Sustainer of all existence. His knowledge encompasses the entirety of the past, present, and future, without the slightest fatigue or slumber. His Kursi (Throne) represents His encompassing power and administrative dominion over the cosmos.",
    scanUrl: getScanUrl(270)
  },
  {
    page: 274,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:256",
    arabicSnippet: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
    sectionTitle: "Al-Baqarah: 'No Compulsion in Religion' (La Ikraha fid-Din)",
    summary: "The absolute prohibition of forcing anyone to accept Islam; faith must be based on conviction, free will, and rational discernment.",
    keyThemes: ["No Compulsion", "Freedom of Conscience", "Taghut", "Firmest Handhold"],
    tafseerExcerpt: "Truth is fundamentally distinct from error. Compelling someone to accept Islam produces only hypocrites, which Islam detests. Faith is an act of the heart that cannot be hammered into human beings by force.",
    scanUrl: getScanUrl(274)
  },
  {
    page: 288,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:261-267",
    arabicSnippet: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ",
    sectionTitle: "Al-Baqarah: The Ethics of Infaq (Spending in the Cause of Allah)",
    summary: "The parable of the grain yielding seven hundred grains; severe warning against ruining charity through reminders of generosity (Mann) or insult (Aza).",
    keyThemes: ["Infaq", "Charity", "Mann wa Aza", "Multiplying Reward"],
    tafseerExcerpt: "Charity must be given with genuine humility. If a giver reminds the recipient of his favor or injures his self-respect, the spiritual value of the charity is utterly wiped out, like dust washed away from a barren rock.",
    scanUrl: getScanUrl(288)
  },
  {
    page: 302,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:275-280",
    arabicSnippet: "الَّذِينَ يَأْكُلُونَ الرِّبَا لَا يَقُومُونَ إِلَّا كَمَا يَقُومُ الَّذِي يَتَخَبَّطُهُ الشَّيْطَانُ مِنَ الْمَسِّ",
    sectionTitle: "Al-Baqarah: Total Prohibition and Condemnation of Riba (Usury/Interest)",
    summary: "Maududi's detailed socioeconomic analysis comparing Zakat (cooperative compassion) with Riba (predatory exploitation). The declaration of war from Allah and His Messenger against lenders who refuse to drop interest.",
    keyThemes: ["Prohibition of Riba", "Economic Justice", "Zakat vs Interest", "Exploitation"],
    tafseerExcerpt: "Maududi writes that interest-based capitalism concentrates wealth in few hands, crushes productive labor, and breeds selfishness. Zakat distributes wealth downward to stimulate welfare, while Riba sucks capital upward, creating social tension and economic collapse.",
    scanUrl: getScanUrl(302)
  },
  {
    page: 312,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:282-283",
    arabicSnippet: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ",
    sectionTitle: "Al-Baqarah: The Verse of Financial Contracts (Ayat al-Mudayanah)",
    summary: "The longest verse in the Quran prescribing the recording of debts, independent scribes, qualified witnesses, and security deposits (pledges) to preserve business trust.",
    keyThemes: ["Financial Law", "Written Contracts", "Commercial Ethics", "Witnesses"],
    tafseerExcerpt: "This verse illustrates the pragmatic thoroughness of the Quran. Spiritual piety is directly coupled with meticulous legal documentation to eliminate disputes, protect the vulnerable, and establish commercial transparency.",
    scanUrl: getScanUrl(312)
  },
  {
    page: 318,
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    verseRange: "2:284-286",
    arabicSnippet: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ ... لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    sectionTitle: "Al-Baqarah: The Closing Creed and Universal Supplication",
    summary: "The affirmation of faith by the Messenger and believers; 'Allah does not charge a soul except with what is within its capacity'; earnest prayer for pardon, mercy, and victory over disbelief.",
    keyThemes: ["Amanar-Rasul", "Human Capacity", "Pardon and Mercy", "Closing Dua"],
    tafseerExcerpt: "The climax of Al-Baqarah is a magnificent prayer of humility. The believer realizes his shortcomings, asks that Allah not lay upon him burdens too heavy to bear, and seeks divine grace to overcome the forces of disbelief and injustice.",
    scanUrl: getScanUrl(318)
  },
  {
    page: 326,
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    verseRange: "3:7-9",
    arabicSnippet: "هُوَ الَّذِي أَنزَلَ عَلَيْكَ الْكِتَابَ مِنْهُ آيَاتٌ مُّحْكَمَاتٌ هُنَّ أُمُّ الْكِتَابِ وَأُخَرُ مُتَشَابِهَاتٌ",
    sectionTitle: "Ali 'Imran: Clear Verses (Muhkamat) vs. Allegorical Verses (Mutashabihat)",
    summary: "The methodology of interpreting the Quran: fundamental, definitive laws form the 'Mother of the Book' (Umm al-Kitab); warning against pursuing ambiguities for discord.",
    keyThemes: ["Muhkamat and Mutashabihat", "Quranic Hermeneutics", "Rasikhun fil-'Ilm", "Avoiding Discord"],
    tafseerExcerpt: "Maududi explains that the Muhkamat are the foundational pillars of belief and law which are clear to all. Those with crooked hearts ignore these clear commands and pursue obscure allegories to sow doctrinal strife.",
    scanUrl: getScanUrl(326)
  },
  {
    page: 350,
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    verseRange: "3:33-41",
    arabicSnippet: "إِنَّ اللَّهَ اصْطَفَىٰ آدَمَ وَنُوحًا وَآلَ إِبْرَاهِيمَ وَآلَ عِمْرَانَ عَلَى الْعَالَمِينَ",
    sectionTitle: "Ali 'Imran: Maryam (Mary), Zakariya, and the Birth of Yahya",
    summary: "The dedication of Maryam by the wife of Imran; Zakariya's prayer in the sanctuary (Mihrab) and the glad tidings of Yahya (John the Baptist).",
    keyThemes: ["Family of Imran", "Maryam", "Zakariya and Yahya", "Divine Miracles"],
    tafseerExcerpt: "The Quran honors Maryam and her family with deep veneration, presenting her as an exemplar of devotion, prayer, and purity, preparing the historical canvas for the birth of Prophet Isa.",
    scanUrl: getScanUrl(350)
  },
  {
    page: 364,
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    verseRange: "3:45-51",
    arabicSnippet: "إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ يُبَشِّرُكِ بِكَلِمَةٍ مِّنْهُ اسْمُهُ الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ",
    sectionTitle: "Ali 'Imran: The Miraculous Birth and Mission of Prophet Isa (Jesus)",
    summary: "The angels announce to Maryam the birth of the Messiah Isa son of Maryam; his speech in the cradle, miracles by Allah's leave, and reaffirmation of Tawhid.",
    keyThemes: ["Prophet Isa (Jesus)", "Word from Allah", "Miracles by Divine Leave", "Tawhid"],
    tafseerExcerpt: "Isa's virgin birth does not make him divine; the Quran states 'The likeness of Isa before Allah is as the likeness of Adam' (3:59). He was created by divine command 'Kun' (Be), and his miracles were performed strictly 'bi-idhni-Llah' (by Allah's leave).",
    scanUrl: getScanUrl(364)
  },
  {
    page: 390,
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    verseRange: "3:64-68",
    arabicSnippet: "قُلْ يَا أَهْلَ الْكِتَابِ تَعَالَوْا إِلَىٰ كَلِمَةٍ سَوَاءٍ بَيْنَنَا وَبَيْنَكُمْ أَلَّا نَعْبُدَ إِلَّا اللَّهَ",
    sectionTitle: "Ali 'Imran: The Call to Common Ground (Kalimatin Sawa')",
    summary: "The universal invitation extended to Jews and Christians: unite on that which is common — worshiping none but Allah and taking no lords from among mortals.",
    keyThemes: ["People of the Book", "Common Ground", "Ibrahim's Pure Faith", "Interfaith Dialogue"],
    tafseerExcerpt: "This verse lays down the bedrock for genuine interfaith dialogue: an earnest plea to return to the pristine, uncorrupted monotheism of Ibrahim, who was neither Jew nor Christian, but a pure Muslim devoted to God.",
    scanUrl: getScanUrl(390)
  },
  {
    page: 422,
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    verseRange: "3:102-110",
    arabicSnippet: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا ۚ ... كُنتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ",
    sectionTitle: "Ali 'Imran: Holding Fast to the Rope of Allah and the 'Best Community'",
    summary: "The obligation to maintain communal unity through holding the rope of Allah; definition of the 'Best Community' whose sole justification for existence is enjoining good and forbidding evil.",
    keyThemes: ["Hablillah (Rope of Allah)", "Unity", "Khayra Ummah", "Amr bil-Ma'ruf"],
    tafseerExcerpt: "Maududi emphasizes that the Muslim community is not a privileged racial tribe. It is titled 'Khayra Ummah' solely because it carries a universal moral responsibility: to actively foster virtue, combat oppression, and embody justice before the eyes of the world.",
    scanUrl: getScanUrl(422)
  },
  {
    page: 445,
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    verseRange: "3:121-144",
    arabicSnippet: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    sectionTitle: "Ali 'Imran: The Battle of Uhud: Analysis of Setback and Moral Healing",
    summary: "Maududi's celebrated analysis of the Battle of Uhud: archers leaving their post on the hill, panic after rumors of the Prophet's death, and divine lessons in discipline and resilience.",
    keyThemes: ["Battle of Uhud", "Do Not Falter", "Spiritual Trial", "Discipline in Struggle"],
    tafseerExcerpt: "Maududi observes that the reverse at Uhud was an essential training trial. It sifted sincere believers from opportunists, demonstrated that spiritual victory requires absolute adherence to prophetic discipline, and reminded the Ummah that Islam is centered on Allah, not merely on the mortal presence of individuals.",
    scanUrl: getScanUrl(445)
  },
  {
    page: 458,
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    verseRange: "3:159-160",
    arabicSnippet: "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ",
    sectionTitle: "Ali 'Imran: Prophetic Compassion, Consultation (Shura), and Reliance on Allah",
    summary: "The Prophet's gentle temperament following the Uhud ordeal; divine command to consult companions in affairs and then commit firmly with trust in Allah (Tawakkul).",
    keyThemes: ["Shura (Consultation)", "Mercy of Leadership", "Tawakkul", "Decisive Action"],
    tafseerExcerpt: "Even after the costly mistake of some companions at Uhud, Allah commanded the Prophet to treat them with leniency, forgive them, and continue consulting them in council (Shura). This establishes the enduring democratic ethos and empathetic leadership required of Islamic leaders.",
    scanUrl: getScanUrl(458)
  },
  {
    page: 476,
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    verseRange: "3:190-195",
    arabicSnippet: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ",
    sectionTitle: "Ali 'Imran: The Contemplation of the People of Intellect (Ulul Albab)",
    summary: "Those who remember Allah standing, sitting, and reclining, contemplating the creation of heavens and earth, concluding 'Our Lord! You have not created this in vain!'",
    keyThemes: ["Ulul Albab", "Cosmic Reflection", "Scientific & Spiritual Vision", "Conscientious Living"],
    tafseerExcerpt: "The Quran does not divorce intellectual inquiry from spiritual devotion. The 'Ulul Albab' combine rigorous scientific observation of the physical universe with heartfelt moral awareness, recognizing that the purposeful design of nature implies an ultimate moral accountability.",
    scanUrl: getScanUrl(476)
  }
];

export const SAMPLE_QUESTIONS = [
  {
    category: "Theology & Tawhid",
    question: "What is Maududi's commentary on Ayat al-Kursi (2:255) and its description of Allah's Sovereignty?",
    pageRef: 270,
    surah: "Al-Baqarah"
  },
  {
    category: "Economics & Ethics",
    question: "How does Tafheem-ul-Quran explain the prohibition of Riba (Usury) vs. the institution of Zakat?",
    pageRef: 302,
    surah: "Al-Baqarah"
  },
  {
    category: "Quranic Principles",
    question: "What are the core guidelines in the Muqaddimah (Introduction) for studying the Quran?",
    pageRef: 30,
    surah: "Muqaddimah"
  },
  {
    category: "Surah Al-Fatihah",
    question: "Why is Surah Al-Fatihah called the quintessence of the Quran and how is 'Iyyaka Na'budu' explained?",
    pageRef: 40,
    surah: "Al-Fatihah"
  },
  {
    category: "Historical Lessons",
    question: "What moral and strategic lessons does Maududi draw from the Battle of Uhud in Surah Ali 'Imran?",
    pageRef: 445,
    surah: "Ali 'Imran"
  },
  {
    category: "Prophethood & Christology",
    question: "How does Surah Ali 'Imran address the Christian delegation of Najran regarding Prophet Isa (Jesus)?",
    pageRef: 364,
    surah: "Ali 'Imran"
  },
  {
    category: "Human Purpose",
    question: "What does the Quran mean by appointing man as 'Khalifah' (vicegerent) on earth in Surah Al-Baqarah?",
    pageRef: 63,
    surah: "Al-Baqarah"
  },
  {
    category: "Social Law",
    question: "How does verse 2:177 (Ayat al-Birr) define true righteousness beyond external rituals?",
    pageRef: 180,
    surah: "Al-Baqarah"
  }
];
