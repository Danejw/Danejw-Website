'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';

type ChatMessage = {
  role: Role;
  content: string;
};

type ScopeReply = {
  message: string;
  budgetRange?: string;
  recommendedPackage?: string;
  nextSteps?: string[];
  missingInfo?: string[];
};

const quickPrompts = [
  'Build a multi-page site with a booking form',
  'Add AI chat support for my existing app',
  'Automate weekly client reporting with my CRM',
];

export function ScopeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Tell me what you're trying to build or automate. I'll suggest a scope, budget range, and the best tier to start with.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastEstimate, setLastEstimate] = useState<Omit<ScopeReply, 'message'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const conversation = useMemo(() => messages.slice(-10), [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const nextMessages = [...messages, { role: 'user' as const, content: input.trim() }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scope-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error('Unable to reach the scope assistant.');
      }

      const data: ScopeReply = await response.json();

      setLastEstimate({
        budgetRange: data.budgetRange,
        recommendedPackage: data.recommendedPackage,
        nextSteps: data.nextSteps,
        missingInfo: data.missingInfo,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.message ||
            "Let's keep refining the scope. Tell me the outcome you want, your audience, and any deadlines.",
        },
      ]);

      // Focus input after response
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again in a few seconds.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === 'user';
    return (
      <div
        key={`${message.role}-${index}`}
        className={cn(
          'flex w-full gap-3',
          isUser ? 'justify-end text-right' : 'justify-start text-left',
        )}
      >
        {!isUser && (
          <div className="mt-1 h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
            <Sparkles className="w-4 h-4" />
          </div>
        )}
        <div
          className={cn(
            'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed backdrop-blur-sm border transition-all',
            isUser
              ? 'bg-cyan-500/20 border-cyan-400/60 text-white'
              : 'bg-white/5 border-white/10 text-slate-200',
          )}
        >
          {message.content}
        </div>
        {isUser && (
          <div className="mt-1 h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <Wand2 className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl border border-cyan-500/20 bg-black/60 p-6 md:p-8 shadow-[0_20px_60px_rgba(6,182,212,0.25)]">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-3 text-cyan-300 text-sm uppercase tracking-[0.25em]">
          <Sparkles className="w-4 h-4" />
          <span>AI Scope Chat</span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-2xl md:text-3xl font-semibold text-white">Scope your build instantly</h3>
          <div className="hidden md:flex items-center gap-2 text-xs text-cyan-200/70">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live estimate
          </div>
        </div>
        <p className="text-slate-400 max-w-3xl">
          Share what you want to build or automate. The assistant will map it to the closest service tier, give a budget range,
          and list next steps.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            className="text-xs px-3 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-100 hover:bg-cyan-500/10 transition"
            onClick={() => setInput(prompt)}
            type="button"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 mb-4 custom-scrollbar">
        {conversation.map(renderMessage)}
      </div>

      {lastEstimate && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {lastEstimate.budgetRange && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 text-sm text-cyan-50">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200 mb-2">Estimated Budget</p>
              <p className="text-lg font-semibold">{lastEstimate.budgetRange}</p>
            </div>
          )}
          {lastEstimate.recommendedPackage && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300 mb-2">Recommended Tier</p>
              <p className="text-lg font-semibold">{lastEstimate.recommendedPackage}</p>
            </div>
          )}
          {(lastEstimate.nextSteps?.length || lastEstimate.missingInfo?.length) && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4 text-sm text-emerald-50">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200 mb-2">Next Up</p>
              <ul className="space-y-1 list-disc list-inside">
                {lastEstimate.nextSteps?.slice(0, 3).map((step, index) => (
                  <li key={`step-${index}`}>{step}</li>
                ))}
                {lastEstimate.missingInfo?.slice(0, 2).map((gap, index) => (
                  <li key={`gap-${index}`} className="text-emerald-100/80">
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build, who it serves, and any deadlines..."
            rows={3}
            className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 text-white p-4 placeholder:text-slate-500 transition"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2 text-xs text-slate-400">
            <span>Enter to send</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>Shift + Enter for new line</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="text-xs text-slate-500">
            Powered by OpenAI Responses API. Conversations stay client-side — nothing is stored.
          </div>
          <Button onClick={sendMessage} isLoading={isLoading} disabled={isLoading} className="px-5">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
