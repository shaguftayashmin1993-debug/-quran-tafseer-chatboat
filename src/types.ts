export interface MessageSource {
  page: number;
  surah: string;
  verse?: string;
  title: string;
  excerpt: string;
  scanUrl: string;
}

export interface TafseerApiCitation {
  surah: number;
  ayah: number;
  bookName: string;
  author: string;
  arabicExcerpt?: string;
  translationExcerpt?: string;
  tafseerExcerpt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: MessageSource[];
  tafseerCitations?: TafseerApiCitation[];
  isStreaming?: boolean;
}

export interface BookmarkedItem {
  id: string;
  type: 'message' | 'page' | 'tafseer';
  title: string;
  content: string;
  page?: number;
  surah?: string | number;
  ayah?: number;
  scanUrl?: string;
  savedAt: string;
  userNotes?: string;
}

export interface TafseerVerseResponse {
  surah: number;
  ayah: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  totalVersesInSurah: number;
  arabicText: string;
  translation: string;
  translationAuthor: string;
  tafsir: {
    id: string;
    name: string;
    author: string;
    language: string;
    text: string;
    cleanText?: string;
  };
  audioUrl?: string;
  tafheemVolume1Page?: number;
  volume1ScanUrl?: string;
}
