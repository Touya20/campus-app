import { Component, useEffect, useRef, useState, type ErrorInfo, type FormEvent, type ReactNode } from 'react';
import { Bot, BookOpen, MessageCircle, Send, UserRound, X } from 'lucide-react';
import { answerOfflineQuestion } from '../lib/offlineChat';

type ChatMessage = { role: 'user' | 'assistant'; content: string };
const welcome: ChatMessage = {
  role: 'assistant',
  content: 'Hi! I’m Campus Helper. I work offline with prepared study explanations and your Campus portal data. Ask about your courses, assignments, weekly schedule, released grades, announcements, or a supported lesson topic.',
};
const suggestions = ['Show my courses', 'When is my next assignment?', 'Explain arrays'];

type BoundaryState = { failed: boolean; message: string };
class ChatAssistantBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false, message: '' };

  static getDerivedStateFromError(error: unknown): BoundaryState {
    return { failed: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Campus Helper display error:', error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return <div role="alert" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-amber-200 bg-white p-4 text-sm text-slate-700 shadow-xl"><p>Campus Helper had a display problem. The rest of the portal is still available.</p><p className="mt-2 rounded bg-amber-50 p-2 font-mono text-xs text-amber-950">{this.state.message || 'No error detail was provided.'}</p><button type="button" className="mt-2 font-semibold text-[#2b5078] underline" onClick={() => window.location.reload()}>Refresh the page</button></div>;
    }
    return this.props.children;
  }
}

function ChatAssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, busy, open]);

  async function sendMessage(event?: FormEvent, suggested?: string) {
    event?.preventDefault();
    const content = (suggested ?? draft).trim();
    if (!content || busy) return;
    setMessages((current) => [...current, { role: 'user', content }]);
    setDraft('');
    setBusy(true);
    try {
      const reply = await answerOfflineQuestion(content);
      setMessages((current) => [...current, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: 'I could not load that Campus information right now. You can still ask me about the prepared lesson topics.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} aria-label="Open Campus Helper" className="fixed bottom-5 right-5 z-40 inline-flex min-h-14 items-center gap-2.5 rounded-full bg-[#2b5078] px-5 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#234465] focus:outline-none focus:ring-4 focus:ring-blue-200">
          <MessageCircle size={20} aria-hidden="true" /> Ask Campus
        </button>
      )}

      {open && (
        <section aria-label="Campus Helper" className="fixed inset-x-3 bottom-3 z-50 flex h-[min(690px,calc(100dvh-24px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[min(690px,calc(100dvh-40px))] sm:w-[min(420px,calc(100vw-40px))]">
          <header className="flex items-center gap-3 bg-[#2b5078] px-4 py-4 text-white">
            <span className="grid size-10 place-items-center rounded-xl bg-white/15"><BookOpen size={20} aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold">Campus Helper</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Campus Helper" className="rounded-lg p-2 text-white/90 transition hover:bg-white/15"><X size={19} /></button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 px-4 py-5" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex items-start gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${message.role === 'assistant' ? 'bg-blue-100 text-[#2b5078]' : 'bg-slate-200 text-slate-700'}`}>
                  {message.role === 'assistant' ? <Bot size={17} aria-hidden="true" /> : <UserRound size={16} aria-hidden="true" />}
                </span>
                <p className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-3 text-sm leading-6 ${message.role === 'assistant' ? 'rounded-tl-sm border border-slate-200 bg-white text-slate-700' : 'rounded-tr-sm bg-[#2b5078] text-white'}`}>
                  {message.content}
                </p>
              </div>
            ))}
            {messages.length === 1 && !busy && (
              <div className="ml-10 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void sendMessage(undefined, suggestion)} className="rounded-full border border-blue-200 bg-white px-3 py-2 text-left text-xs font-medium text-[#2b5078] transition hover:bg-blue-50">{suggestion}</button>)}
              </div>
            )}
            {busy && <div className="ml-10 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">Checking your saved Campus information…</div>}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <form onSubmit={(event) => void sendMessage(event)} className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
              <label className="sr-only" htmlFor="campus-chat-message">Your message</label>
              <textarea id="campus-chat-message" rows={1} maxLength={1000} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Ask about Campus or a lesson…" className="max-h-28 min-h-10 flex-1 resize-y border-0 bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
              <button type="submit" disabled={!draft.trim() || busy} aria-label="Send message" className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#2b5078] text-white transition hover:bg-[#234465] disabled:cursor-not-allowed disabled:opacity-40"><Send size={17} aria-hidden="true" /></button>
            </form>
            <p className="mt-2 px-1 text-[10px] leading-4 text-slate-400">Uses prepared answers and Campus data. No AI provider or API key is used.</p>
          </div>
        </section>
      )}
    </>
  );
}

export function ChatAssistant() {
  return <ChatAssistantBoundary><ChatAssistantPanel /></ChatAssistantBoundary>;
}
