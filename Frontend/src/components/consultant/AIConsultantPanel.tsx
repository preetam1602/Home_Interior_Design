import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askConsultant, ChatTurn } from '../../api';
import { findProduct } from '../../data';
import { RecommendedProducts } from './RecommendedProducts';
import { AvatarStage } from './AvatarStage';
import { useLiveAvatar } from '../../hooks/useLiveAvatar';

interface ConsultantMessage {
  role: 'user' | 'assistant';
  content: string;
  spokenSummary?: string; // short version the video avatar reads out
  productIds?: number[];
  estimatedTotal?: number | null;
}

interface AIConsultantPanelProps {
  open: boolean;
  showLauncher: boolean; // the floating button is hidden where it would cover page content (home hero)
  onOpen: () => void;
  onClose: () => void;
  currentView: string;
  savedDesigns: number[];
  onToggleSave: (id: number) => void;
  focusedProductId: number | null;
  onClearFocus: () => void;
}

const STARTER_QUESTIONS = [
  'Ideas for a cozy modern bedroom under ₹1 lakh',
  'What paint colour goes with walnut furniture?',
  'Help me furnish a small living room',
];

const GREETING_FIRST =
  "Hi, I'm your interior design consultant. Tell me about the room you're planning, the style you like and your budget.";
const GREETING_RETURNING = "I'm here. Go ahead with your question and I'll talk you through it.";

const PRODUCT_QUESTIONS = [
  'Is this a good fit for a small apartment?',
  'What goes well with this?',
  'Suggest a matching paint colour',
];

export function AIConsultantPanel({
  open,
  showLauncher,
  onOpen,
  onClose,
  currentView,
  savedDesigns,
  onToggleSave,
  focusedProductId,
  onClearFocus,
}: AIConsultantPanelProps) {
  const [messages, setMessages] = useState<ConsultantMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const avatar = useLiveAvatar();
  const { enabled: avatarEnabled, status: avatarStatus, speak: speakAvatar, start: startAvatar, stop: stopAvatar } = avatar;
  // Set when the visitor clicks "End video", so typing doesn't restart it until the panel is reopened.
  const videoDismissedRef = useRef(false);

  const focusedProduct = focusedProductId !== null ? findProduct(focusedProductId) : undefined;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, focusedProductId]);

  // Closing the panel ends the video session so it stops using credits.
  useEffect(() => {
    if (!open) {
      stopAvatar();
      videoDismissedRef.current = false;
    }
  }, [open, stopAvatar]);

  const greeting = messages.length === 0 ? GREETING_FIRST : GREETING_RETURNING;

  // The video designer joins as soon as the visitor starts typing (or picks a suggestion), so the
  // connection (~8s) overlaps with typing and the AI answer instead of adding to the wait.
  // Not retried automatically after an error, or after the visitor ended the video.
  const autoStartVideo = () => {
    if (avatarEnabled && avatarStatus === 'off' && !videoDismissedRef.current) startAvatar(greeting);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;

    const history: ChatTurn[] = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setInput('');
    setError('');
    setLoading(true);
    autoStartVideo();
    // A question is on its way, so skip the greeting: the avatar will say the answer as soon as it connects.
    avatar.cancelPendingSpeech();

    try {
      const res = await askConsultant(question, history, {
        current_view: currentView,
        focused_product_id: focusedProductId,
        saved_product_ids: savedDesigns,
      });
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.display_text,
          spokenSummary: res.spoken_summary,
          productIds: res.product_ids,
          estimatedTotal: res.estimated_total,
        },
      ]);
      speakAvatar(res.spoken_summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      // Put the question back so the visitor can retry without retyping.
      setMessages(prev => prev.slice(0, -1));
      setInput(question);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = focusedProduct ? PRODUCT_QUESTIONS : STARTER_QUESTIONS;

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && showLauncher && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={onOpen}
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-strong)] text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Ask AI Interior Designer
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop: dims the page behind the panel so the two don't visually collide; click to close */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="consultant-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-x-0 top-20 bottom-0 z-40 bg-slate-900/35 backdrop-blur-[2px] cursor-pointer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-20 bottom-0 right-0 z-50 w-full sm:w-[420px] bg-[var(--theme-bg)] border-l border-[var(--theme-border)] shadow-2xl flex flex-col"
            aria-label="AI interior design consultant"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--theme-accent-soft)]/20 text-[var(--theme-accent)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-[var(--theme-text)] leading-tight">AI Interior Designer</h2>
                  <p className="text-[11px] text-[var(--theme-muted)]">Ideas from our catalog, by room, style and budget</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-[var(--theme-muted)] hover:text-[var(--theme-text)] cursor-pointer" title="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {avatar.enabled && (
              <AvatarStage
                status={avatar.status}
                error={avatar.error}
                videoRef={avatar.videoRef}
                videoDismissed={videoDismissedRef.current}
                onStart={() => {
                  videoDismissedRef.current = false;
                  startAvatar(greeting);
                }}
                onStop={() => {
                  videoDismissedRef.current = true;
                  stopAvatar();
                }}
              />
            )}

            {/* Conversation */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-sm text-[var(--theme-muted)] leading-relaxed">
                  <p className="mb-3">
                    Hi! Tell me about the room you're planning — the style you like and your budget — and I'll suggest colours,
                    materials, furniture and decor from our collection.
                  </p>
                </div>
              )}

              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] bg-[var(--theme-accent)] text-white text-sm rounded-2xl rounded-br-md px-4 py-2.5 whitespace-pre-wrap">
                      {m.content}
                    </p>
                  </div>
                ) : (
                  <div key={i}>
                    <p className="bg-white/70 border border-[var(--theme-border)] text-sm text-[var(--theme-text)] rounded-2xl rounded-bl-md px-4 py-3 leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </p>
                    <RecommendedProducts
                      productIds={m.productIds ?? []}
                      estimatedTotal={m.estimatedTotal ?? null}
                      savedDesigns={savedDesigns}
                      onToggleSave={onToggleSave}
                    />
                  </div>
                ),
              )}

              {loading && (
                <div className="inline-flex items-center gap-2 text-xs text-[var(--theme-muted)]">
                  <Loader2 className="w-4 h-4 animate-spin" /> Putting together ideas…
                </div>
              )}

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
            </div>

            {/* Composer */}
            <div className="border-t border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 pt-3 pb-4 space-y-2.5">
              {focusedProduct && (
                <div className="inline-flex items-center gap-2 max-w-full text-xs bg-[var(--theme-accent-soft)]/20 text-[var(--theme-text)] border border-[var(--theme-border)] rounded-full pl-1 pr-2 py-1">
                  <img src={focusedProduct.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <span className="truncate">Asking about: <strong>{focusedProduct.name}</strong></span>
                  <button onClick={onClearFocus} className="text-[var(--theme-muted)] hover:text-[var(--theme-text)] cursor-pointer" title="Stop asking about this product">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {!loading && (messages.length === 0 || focusedProduct) && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs text-left px-3 py-1.5 rounded-full border border-[var(--theme-border)] bg-white/60 text-[var(--theme-text)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={e => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    if (e.target.value.trim()) autoStartVideo();
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  maxLength={1000}
                  placeholder="Ask about a room, style or budget…"
                  className="flex-grow resize-none max-h-32 rounded-xl border border-[var(--theme-border)] bg-white/80 px-3.5 py-2.5 text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-muted)]/70 focus:outline-none focus:border-[var(--theme-accent)]"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-3 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-strong)] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
