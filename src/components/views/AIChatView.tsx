import React, { useState } from 'react';
import { queryPropertyOSAI } from '../../services/api';
import {
  Bot,
  Sparkles,
  Send,
  User,
  ArrowRight,
  Shield,
  Layers,
  Database,
  CheckCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: string[];
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  'How much did I spend last month?',
  'Which property costs me the most?',
  'Which properties are vacant?',
  'Which insurance policies expire soon?',
  'Show unusual expenses.',
  'Which property has the best ROI?',
  'How much rental income did I receive?',
  'Which maintenance issues are overdue?',
];

export const AIChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Good morning, Alex. I am PropertyOS AI, your private portfolio intelligence assistant. I have indexed all 6 properties, 9 expense records, current maintenance tickets, and upcoming insurance expirations. What would you like to analyze today?',
      sources: ['Grounding: 6 Estates', 'Active Ledger Synchronized'],
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await queryPropertyOSAI(textToSend);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I encountered an error querying the portfolio database. Please verify connectivity.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-7rem)]">
      {/* Title Header */}
      <div className="border-b border-zinc-800 pb-4 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
            GEMINI PORTFOLIO GROUNDING ENGINE
          </span>
        </div>
        <h1 className="text-2xl font-heading font-bold text-white tracking-tight">
          PropertyOS AI
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
          Ask anything about your property portfolio. Grounded in actual records with zero hallucinations.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-zinc-500 whitespace-nowrap">Suggested:</span>
        {SAMPLE_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white whitespace-nowrap transition-all shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                msg.sender === 'user'
                  ? 'bg-rose-600 text-white'
                  : 'bg-zinc-800 text-rose-400 border border-zinc-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-rose-950/80 text-white border border-rose-800/60 rounded-tr-sm'
                  : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-tl-sm'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Source Attribution (Prompt Requirement) */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap gap-2 text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Database className="w-3 h-3 text-rose-400" /> Sources:
                  </span>
                  {msg.sources.map((s, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-zinc-500 font-mono mt-1 text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-xl shrink-0 bg-zinc-800 text-rose-400 border border-zinc-700 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Querying portfolio telemetry and calculating grounded metrics...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-2 shrink-0 shadow-2xl"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask PropertyOS AI about valuations, overdue tasks, or expense anomalies..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-white px-3 py-2 focus:outline-none placeholder-zinc-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
