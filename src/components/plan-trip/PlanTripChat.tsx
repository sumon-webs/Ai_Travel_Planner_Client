'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  RotateCcw,
  AlertCircle,
  MessageSquarePlus,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PlanTripChatProps {
  tripId: string;
  tripTitle: string;
  destination: string;
}

const SUGGESTIONS = [
  'Reduce my budget',
  'Replace Day 2 activities',
  'Suggest local restaurants',
  'Add more adventure activities',
  'What should I pack?',
  'Best transport options?',
];

export default function PlanTripChat({ tripId, tripTitle, destination }: PlanTripChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Load existing chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        setConnectionError(null);
        const res = await fetch(`${serverUrl}/api/chats/${tripId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load chat history.');
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data?.messages)) {
          setMessages(json.data.messages.map((m: any) => ({
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp),
          })));
        }
      } catch (err: any) {
        console.error('Chat history load error:', err);
        // Non-fatal — just start fresh
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [tripId, serverUrl]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isGenerating) return;

    setInput('');
    setConnectionError(null);
    setIsGenerating(true);

    const userMsg: ChatMessage = { role: 'user', content: trimmed, timestamp: new Date() };
    const botMsg: ChatMessage = { role: 'assistant', content: '', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg, botMsg]);

    try {
      const res = await fetch(`${serverUrl}/api/chats/${tripId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Server returned an error.');
      }

      if (!res.body) throw new Error('Streaming not supported.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data: ')) continue;
          const dataStr = trimmedLine.slice(6);
          if (dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: accumulated };
                return updated;
              });
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // Partial JSON chunk — skip
          }
        }
      }
    } catch (err: any) {
      console.error('Chat stream error:', err);
      setConnectionError(err.message || 'Network error. Please retry.');
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].content === '') {
          updated.pop();
        }
        return updated;
      });
    } finally {
      setIsGenerating(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Clear all conversation history for this trip?')) return;
    try {
      setConnectionError(null);
      const res = await fetch(`${serverUrl}/api/chats/${tripId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to clear history.');
      setMessages([]);
    } catch (err: any) {
      setConnectionError(err.message || 'Failed to clear conversation history.');
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-950/60 to-indigo-950/60 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <MessageSquarePlus className="w-4 h-4 text-violet-400" />
              AI Travel Assistant
            </h3>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-xs">
              Ask follow-up questions about <span className="text-violet-300">{destination}</span>
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            title="Clear conversation"
            className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-red-400 hover:border-red-500/20 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Message Area ── */}
      <div
        ref={scrollRef}
        className="h-[380px] overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          /* Welcome / Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-white">Chat About Your Trip</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                I have your full itinerary for <strong className="text-slate-200">{destination}</strong> loaded. Ask me to modify it, find alternatives, or answer any travel question.
              </p>
            </div>
            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  disabled={isGenerating}
                  className="text-[11px] px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-violet-600/20 hover:border-violet-500/30 hover:text-violet-300 transition cursor-pointer disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isBot = msg.role === 'assistant';
              const isLastAndStreaming = isGenerating && i === messages.length - 1 && isBot;

              return (
                <div
                  key={i}
                  className={`flex gap-3 items-start ${!isBot ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs mt-0.5 ${
                      isBot
                        ? 'bg-violet-600/15 border-violet-500/30 text-violet-400'
                        : 'bg-white/10 border-white/15 text-slate-300'
                    }`}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed border ${
                      isBot
                        ? 'bg-white/[0.03] border-white/8 text-slate-200 whitespace-pre-line'
                        : 'bg-violet-600 border-violet-500 text-white font-medium'
                    }`}
                  >
                    {isLastAndStreaming && msg.content === '' ? (
                      /* Typing indicator dots */
                      <div className="flex items-center gap-1.5 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.3s]" />
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              );
            })}

            {/* Suggestion chips after first response */}
            {!isGenerating && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.slice(0, 4).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-slate-400 hover:bg-violet-600/15 hover:border-violet-500/25 hover:text-violet-300 transition cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Error banner */}
        {connectionError && (
          <div className="flex items-start gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{connectionError}</span>
          </div>
        )}
      </div>

      {/* ── Input Footer ── */}
      <div className="px-5 py-4 border-t border-white/10 bg-slate-950/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${destination}... (e.g. "Replace Day 2", "Reduce budget")`}
            disabled={isGenerating}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all disabled:opacity-55"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 text-white disabled:text-slate-500 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.4)] disabled:shadow-none cursor-pointer"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-slate-600 mt-2 text-center">
          Press Enter to send · Conversation saved to your trip
        </p>
      </div>
    </div>
  );
}
