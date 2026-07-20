'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  Loader2, 
  Bot, 
  User, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ItineraryDay {
  day: number;
  title: string;
  activities: { title: string; timeSlot?: string; description?: string; transport?: string; estimatedCost?: string; foodHighlight?: string }[];
  description?: string;
  accommodation?: { name?: string; type?: string; estimatedCostPerNight?: string; area?: string };
  dailyCostEstimate?: string;
  notes?: string;
}

interface Trip {
  _id: string;
  title: string;
  destination: string | { name?: string; city?: string; country?: string };
  summary?: string;
  estimatedBudget?: { total?: string; perDay?: string; perPersonPerDay?: string; breakdown?: Record<string, string> };
  travelStyle?: string;
  interests?: string[];
  itinerary: ItineraryDay[];
  bestTime?: { recommended?: string; reason?: string; avoid?: string };
  packingTips?: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string | Date;
}

interface ChatAssistantProps {
  trip: Trip | null;
}

export default function ChatAssistant({ trip }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Quick Action Suggestions requested by requirements
  const suggestions = [
    'Can I reduce my budget?',
    'Suggest another hotel.',
    'Replace Day 2 activities.',
    'Best local foods?'
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Load chat history when trip changes
  useEffect(() => {
    if (!trip) {
      setIsOpen(false);
      setMessages([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        setConnectionError(null);
        const response = await fetch(`${serverUrl}/api/chats/${trip._id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to load chat logs.');
        }
        const resJson = await response.json();
        if (resJson.status === 'success' && resJson.data?.messages) {
          setMessages(resJson.data.messages);
        } else {
          setMessages([]);
        }
      } catch (err: any) {
        console.error('Error fetching chat history:', err);
        setConnectionError('Unable to connect to travel assistant server.');
      }
    };

    fetchHistory();
  }, [trip, serverUrl]);

  if (!trip) return null;

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    const userMessageText = text.trim();
    setInput('');
    setConnectionError(null);
    setIsGenerating(true);

    // 1. Add user message to state
    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessageText,
      timestamp: new Date()
    };
    
    // 2. Add an empty assistant message which we'll stream into
    const botMsg: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg, botMsg]);

    try {
      // 3. Make POST request with credentials
      const response = await fetch(`${serverUrl}/api/chats/${trip._id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: userMessageText }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || 'Server returned an error.');
      }

      if (!response.body) {
        throw new Error('Readable stream not supported by server response.');
      }

      // 4. Stream response body
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponseAccumulator = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        
        // Parse SSE formatted response lines
        const lines = textChunk.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              continue;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                botResponseAccumulator += data.text;
                // Update assistant message in state
                setMessages(prev => {
                  const updated = [...prev];
                  if (updated.length > 0) {
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      content: botResponseAccumulator
                    };
                  }
                  return updated;
                });
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              // Partial JSON chunks can fail parse, skip/wait for full segment
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Error during streaming chat:', err);
      setConnectionError(err.message || 'Network disconnected. Please retry.');
      // Remove the last empty bot message on failure
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].content === '') {
          updated.pop();
        }
        return updated;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear your conversation history for this trip?')) {
      try {
        setConnectionError(null);
        const response = await fetch(`${serverUrl}/api/chats/${trip._id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to delete chat logs.');
        }
        setMessages([]);
      } catch (err: any) {
        console.error('Error deleting history:', err);
        setConnectionError('Failed to clear conversation history.');
      }
    }
  };

  const getDestinationName = (dest: string | { name?: string; city?: string; country?: string } | null | undefined): string => {
    if (!dest) return 'this trip';
    if (typeof dest === 'string') return dest;
    if (typeof dest === 'object') {
      return dest.city || dest.name || 'this trip';
    }
    return 'this trip';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── Chat Assistant Dialog Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-4 w-[360px] sm:w-[420px] h-[520px] rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-950/70 to-indigo-950/70 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    AI Travel Assistant
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">
                    Plan: {trip.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    title="Clear history"
                    className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-red-400 hover:border-red-500/20 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent"
            >
              {messages.length === 0 ? (
                /* Welcome Screen */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Ask your Assistant</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      I know your itinerary for <strong>{getDestinationName(trip.destination)}</strong>. Ask me to modify dates, replace activities, or query budgets!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isBot = msg.role === 'assistant';
                  return (
                    <div 
                      key={i} 
                      className={`flex gap-2.5 items-start ${!isBot ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`
                        w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs
                        ${isBot 
                          ? 'bg-violet-600/15 border-violet-500/30 text-violet-400' 
                          : 'bg-white/10 border-white/15 text-slate-300'
                        }
                      `}>
                        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div className={`
                        max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line border
                        ${isBot 
                          ? 'bg-white/[0.02] border-white/5 text-slate-200' 
                          : 'bg-violet-600 border-violet-500 text-white font-medium'
                        }
                      `}>
                        {msg.content === '' && isGenerating && i === messages.length - 1 ? (
                          <div className="flex items-center gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Error Callout */}
              {connectionError && (
                <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{connectionError}</span>
                </div>
              )}
            </div>

            {/* Quick suggestions chips */}
            {messages.length === 0 && !isGenerating && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    className="text-[10px] px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-violet-600/20 hover:border-violet-500/30 hover:text-violet-300 transition cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Footer Input Area */}
            <div className="p-3 bg-slate-950/40 border-t border-white/10">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this trip..."
                  disabled={isGenerating}
                  className="w-full pl-4 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all disabled:opacity-55"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="absolute right-2 p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 text-white disabled:text-slate-500 transition cursor-pointer"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trigger Chat Assistant Toggle Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-[0_8px_32px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)] border border-violet-400/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping group-hover:animate-none opacity-75" />
        <MessageSquare className="w-6 h-6 relative z-10" />
      </button>
    </div>
  );
}
