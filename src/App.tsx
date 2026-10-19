import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatView } from './components/ChatView';
import { VolumeExplorer } from './components/VolumeExplorer';
import { PageScanViewer } from './components/PageScanViewer';
import { BookmarksView } from './components/BookmarksView';
import { TafseerView } from './components/TafseerView';
import { PageReaderModal } from './components/PageReaderModal';
import { ChatMessage, BookmarkedItem } from './types';
import { Volume1PageEntry } from './data/tafheemVolume1Data';
import { getLocalizedPage } from './data/localizedVolume1';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
} from './data/translations';

const LOCAL_STORAGE_MESSAGES_KEY = 'tafheem_v1_chat_history';
const LOCAL_STORAGE_BOOKMARKS_KEY = 'tafheem_v1_bookmarks';
const LOCAL_STORAGE_LANG_KEY = 'tafheem_v1_language';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'explorer' | 'viewer' | 'tafseer' | 'bookmarks'>('chat');
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      const savedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY) as SupportedLanguage;
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        return savedLang;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [inspectPageNumber, setInspectPageNumber] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, language);
    } catch (e) {
      console.error('Failed to save language to local storage:', e);
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages to local storage:', e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to local storage:', e);
    }
  }, [bookmarks]);

  // Send message to backend with language parameter
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error status ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'No response returned from commentary engine.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `### ${t.appTitle} (${t.volumeBadge})\n\n${t.researching}\n\n• **Muqaddimah**: pp. 1–32\n• **Surah Al-Fatihah**: pp. 33–46\n• **Surah Al-Baqarah**: pp. 47–320\n• **Surah Ali 'Imran**: pp. 321–480\n\n${t.welcomeDesc}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  // Inspect page modal handler
  const handleInspectPage = (pageNumber: number) => {
    setInspectPageNumber(pageNumber);
  };

  // Ask about a specific page from modal or explorer
  const handleAskAboutPage = (pageNumber: number, prompt: string) => {
    setActiveTab('chat');
    handleSendMessage(prompt);
  };

  // Bookmark handlers
  const handleBookmarkMessage = (msg: ChatMessage) => {
    const existing = bookmarks.find((b) => b.id === msg.id);
    if (existing) {
      setBookmarks((prev) => prev.filter((b) => b.id !== msg.id));
      return;
    }

    const firstSource = msg.sources?.[0];
    const newBookmark: BookmarkedItem = {
      id: msg.id,
      type: 'message',
      title: firstSource ? `${t.tabChat}: ${firstSource.title}` : `${t.appTitle} Q&A`,
      content: msg.content,
      page: firstSource?.page,
      surah: firstSource?.surah,
      scanUrl: firstSource?.scanUrl,
      savedAt: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleBookmarkPage = (pageData: Volume1PageEntry) => {
    const bookmarkId = `page-${pageData.page}`;
    const existing = bookmarks.find((b) => b.id === bookmarkId);
    if (existing) {
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      return;
    }

    const loc = getLocalizedPage(pageData.page, language);
    const newBookmark: BookmarkedItem = {
      id: bookmarkId,
      type: 'page',
      title: `${t.page} ${pageData.page}: ${loc.sectionTitle}`,
      content: `${loc.summary}\n\n${t.commentaryNotes}:\n"${loc.tafseerExcerpt}"`,
      page: pageData.page,
      surah: loc.surahName,
      scanUrl: pageData.scanUrl,
      savedAt: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleBookmarkTafseer = (item: {
    surah: number;
    ayah: number;
    surahName: string;
    bookName: string;
    arabicText: string;
    translation: string;
    tafseerText: string;
    scanUrl?: string;
  }) => {
    const id = `tafseer-${item.surah}-${item.ayah}-${Date.now()}`;
    const newBookmark: BookmarkedItem = {
      id,
      type: 'tafseer',
      title: `${item.surahName} : ${t.selectAyahLabel} ${item.ayah} (${item.bookName})`,
      content: `${item.arabicText}\n\n"${item.translation}"\n\n${item.tafseerText.slice(0, 500)}...`,
      surah: item.surahName,
      ayah: item.ayah,
      scanUrl: item.scanUrl,
      savedAt: new Date().toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, userNotes: notes } : b))
    );
  };

  const savedMessageIds = new Set(bookmarks.map((b) => b.id));

  return (
    <div
      className={`min-h-screen bg-[#faf7f0] text-stone-900 flex flex-col selection:bg-emerald-800 selection:text-amber-100 ${
        language === 'ur' ? 'font-arabic' : 'font-body'
      }`}
      style={{ fontFamily: currentLangConfig.fontFamily }}
    >
      {/* Navbar Header with Multi-Language Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarksCount={bookmarks.length}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onOpenQuickScan={(p) => setInspectPageNumber(p)}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onInspectPage={handleInspectPage}
            onBookmarkMessage={handleBookmarkMessage}
            fontSize={fontSize}
            savedMessageIds={savedMessageIds}
            language={language}
            setLanguage={setLanguage}
            t={t}
          />
        )}

        {activeTab === 'explorer' && (
          <VolumeExplorer
            onInspectPage={handleInspectPage}
            onAskAboutPage={handleAskAboutPage}
            language={language}
            t={t}
          />
        )}

        {activeTab === 'viewer' && (
          <PageScanViewer
            onAskAboutPage={handleAskAboutPage}
            onBookmarkPage={handleBookmarkPage}
            language={language}
            t={t}
          />
        )}

        {activeTab === 'tafseer' && (
          <TafseerView
            language={language}
            t={t}
            onAskAboutTafseer={(prompt) => {
              setActiveTab('chat');
              handleSendMessage(prompt);
            }}
            onBookmarkTafseer={handleBookmarkTafseer}
            onInspectVolume1Page={(page) => setInspectPageNumber(page)}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onUpdateNotes={handleUpdateNotes}
            onInspectPage={handleInspectPage}
            onAskAboutPage={handleAskAboutPage}
            language={language}
            t={t}
          />
        )}
      </main>

      {/* Page Reader Modal */}
      {inspectPageNumber !== null && (
        <PageReaderModal
          pageNumber={inspectPageNumber}
          onClose={() => setInspectPageNumber(null)}
          onAskAboutPage={handleAskAboutPage}
          onBookmarkPage={handleBookmarkPage}
          isBookmarked={savedMessageIds.has(`page-${inspectPageNumber}`)}
          language={language}
          t={t}
        />
      )}
    </div>
  );
}
