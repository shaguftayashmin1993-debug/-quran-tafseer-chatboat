import React, { useState } from 'react';
import { Bookmark, Trash2, ExternalLink, BookOpen, Sparkles, Copy, Check, Edit3 } from 'lucide-react';
import { BookmarkedItem } from '../types';
import { getScanUrl } from '../data/tafheemVolume1Data';
import { SupportedLanguage, TranslationStrings } from '../data/translations';

interface BookmarksViewProps {
  bookmarks: BookmarkedItem[];
  onRemoveBookmark: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onInspectPage: (pageNumber: number) => void;
  onAskAboutPage: (pageNumber: number, prompt: string) => void;
  language: SupportedLanguage;
  t: TranslationStrings;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onRemoveBookmark,
  onUpdateNotes,
  onInspectPage,
  onAskAboutPage,
  language,
  t,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const isRTL = language === 'ur';

  const handleStartEdit = (item: BookmarkedItem) => {
    setEditingId(item.id);
    setNotesDraft(item.userNotes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, notesDraft);
    setEditingId(null);
  };

  const handleCopyAll = () => {
    if (bookmarks.length === 0) return;
    const compiled = bookmarks
      .map(
        (b, i) =>
          `### ${i + 1}. ${b.title}\nSaved: ${b.savedAt}\n${b.page ? `${t.page}: ${b.page} (${getScanUrl(b.page)})\n` : ''}${b.userNotes ? `\n${t.myNote}\n${b.userNotes}\n` : ''}\nContent:\n${b.content}\n\n---\n`
      )
      .join('\n');

    navigator.clipboard.writeText(compiled);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            {t.tabBookmarks}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-emerald-950">
            {t.savedNotesTitle}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            {t.savedNotesSubtitle}
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 text-amber-100 text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copiedAll ? t.copiedStudySheet : t.exportStudySheet}</span>
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-amber-900/15 p-8 max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-bold text-lg text-emerald-950">
            {t.noSavedNotes}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.noSavedNotesDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-amber-900/15 shadow-xs space-y-4"
            >
              {/* Item Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                      {item.type === 'page' ? t.page : item.type === 'tafseer' ? t.tabTafseer : 'Q&A'}
                    </span>
                    {item.page && (
                      <span className="text-xs font-mono font-semibold text-emerald-900">
                        {t.page} {item.page}
                      </span>
                    )}
                    {item.surah && (
                      <span className="text-xs text-stone-500">
                        • {item.surah}
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-emerald-950">
                    {item.title}
                  </h4>
                </div>

                <button
                  onClick={() => onRemoveBookmark(item.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title={language === 'hi' ? 'बुकमार्क हटाएं' : language === 'ur' ? 'بک مارک ہٹائیں' : language === 'bn' ? 'বুকমার্ক সরান' : language === 'ta' ? 'புக்மார்க்கை நீக்கு' : language === 'ml' ? 'ബുക്ക്മാർക്ക് നീക്കം ചെയ്യുക' : language === 'kn' ? 'ಬುಕ್‌ಮಾರ್ಕ್ ತೆಗೆದುಹಾಕಿ' : 'Remove bookmark'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto p-3 rounded-xl bg-stone-50 border border-stone-200">
                {item.content}
              </div>

              {/* Student Reflections / User Notes */}
              <div className="pt-2 border-t border-stone-100">
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-emerald-900">
                      {t.myNote}
                    </label>
                    <textarea
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder={t.addNote}
                      rows={3}
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-700 outline-none text-xs text-stone-900"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={() => handleSaveNotes(item.id)}
                        className="px-3 py-1 bg-emerald-900 text-amber-200 text-xs font-semibold rounded-lg hover:bg-emerald-800"
                      >
                        {t.saveReflections}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-stone-600">
                      {item.userNotes ? (
                        <p className="italic text-emerald-950">
                          <strong>{t.myNote}</strong> {item.userNotes}
                        </p>
                      ) : (
                        <span className="text-stone-400 italic">
                          {language === 'hi' ? 'कोई टिप्पणी नहीं' : language === 'ur' ? 'کوئی نوٹ نہیں' : language === 'bn' ? 'কোনো মন্তব্য নেই' : language === 'ta' ? 'குறிப்பு இல்லை' : language === 'ml' ? 'കുറിപ്പില്ല' : language === 'kn' ? 'ಟಿಪ್ಪಣಿ ಇಲ್ಲ' : 'No note added yet.'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-medium"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{item.userNotes ? t.editNote : t.addNote}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                <span>
                  {language === 'hi' ? `सहेजा गया: ${item.savedAt}` : language === 'ur' ? `محفوظ کیا گیا: ${item.savedAt}` : language === 'bn' ? `সংরক্ষিত: ${item.savedAt}` : language === 'ta' ? `சேமிக்கப்பட்டது: ${item.savedAt}` : language === 'ml' ? `സൂക്ഷിച്ചത്: ${item.savedAt}` : language === 'kn' ? `ಉಳಿಸಲಾಗಿದೆ: ${item.savedAt}` : `Saved on ${item.savedAt}`}
                </span>
                <div className="flex items-center gap-2">
                  {item.page && (
                    <button
                      onClick={() => onInspectPage(item.page!)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900 text-amber-200 hover:bg-emerald-800 font-medium transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.inspectPage}</span>
                    </button>
                  )}
                  {item.scanUrl && (
                    <a
                      href={item.scanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
                    >
                      <span>{t.openScan}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
