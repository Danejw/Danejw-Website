'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Loader2, Sparkles, Wand2, Image as ImageIcon, X, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';

type MessageContent = 
  | string 
  | Array<{ type: 'input_text'; text: string } | { type: 'input_image'; image_url: string }>;

type ChatMessage = {
  role: Role;
  content: MessageContent;
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

const STORAGE_KEYS = {
  MESSAGES: 'scope-chat-messages',
  LAST_ESTIMATE: 'scope-chat-last-estimate',
} as const;

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveToStorage = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

const defaultInitialMessage: ChatMessage = {
  role: 'assistant',
  content:
    "Tell me what you're trying to build or automate. I'll suggest a scope, budget range, and the best tier to start with.",
};

export function ScopeChat() {
  // Load initial state from localStorage or use defaults
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const cached = loadFromStorage<ChatMessage[]>(STORAGE_KEYS.MESSAGES, []);
    return cached.length > 0 ? cached : [defaultInitialMessage];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastEstimate, setLastEstimate] = useState<Omit<ScopeReply, 'message'> | null>(() => {
    return loadFromStorage<Omit<ScopeReply, 'message'> | null>(STORAGE_KEYS.LAST_ESTIMATE, null);
  });
  const [error, setError] = useState<string | null>(null);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Show all messages instead of just the last 10
  const conversation = useMemo(() => messages, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const scrollHeight = inputRef.current.scrollHeight;
      const minHeight = 80; // min-h-[80px]
      const maxHeight = 300; // max-h-[300px]
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      inputRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveToStorage(STORAGE_KEYS.MESSAGES, messages);
    }
  }, [messages]);

  // Save lastEstimate to localStorage whenever it changes
  useEffect(() => {
    if (lastEstimate) {
      saveToStorage(STORAGE_KEYS.LAST_ESTIMATE, lastEstimate);
    } else {
      // Clear if set to null
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEYS.LAST_ESTIMATE);
        } catch (error) {
          console.warn('Failed to remove lastEstimate from localStorage:', error);
        }
      }
    }
  }, [lastEstimate]);

  // Convert file to base64 data URI
  const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle image file selection
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // OpenAI Responses API supports up to 20MB per image
    const imageFiles = Array.from(files).filter((file) => {
      const isValidType = file.type.startsWith('image/') && 
        ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB limit per OpenAI API
      return isValidType && isValidSize;
    });

    if (imageFiles.length === 0) {
      const invalidFiles = Array.from(files).filter((file) => !file.type.startsWith('image/'));
      const oversizedFiles = Array.from(files).filter((file) => file.size > 20 * 1024 * 1024);
      
      if (invalidFiles.length > 0) {
        setError('Please select valid image files (PNG, JPEG, WEBP, or GIF)');
      } else if (oversizedFiles.length > 0) {
        setError('Image files must be 20MB or smaller');
      } else {
        setError('Please select valid image files');
      }
      return;
    }

    // Limit to 3 images total
    const currentCount = attachedImages.length;
    const remainingSlots = Math.max(0, 3 - currentCount);
    if (remainingSlots === 0) {
      setError('Maximum of 3 images allowed');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const filesToAdd = imageFiles.slice(0, remainingSlots);
    if (filesToAdd.length < imageFiles.length) {
      setError(`Only ${remainingSlots} more image${remainingSlots > 1 ? 's' : ''} can be added (max 3 total)`);
    }

    try {
      const dataURIs = await Promise.all(filesToAdd.map(fileToDataURI));
      setAttachedImages((prev) => [...prev, ...dataURIs]);
    } catch (error) {
      console.error('Failed to process images', error);
      setError('Failed to process images. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle paste event for images
  const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    const imageItems: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        // OpenAI Responses API supports up to 20MB per image
        if (file && file.size <= 20 * 1024 * 1024) {
          imageItems.push(file);
        } else if (file && file.size > 20 * 1024 * 1024) {
          setError('Pasted image is too large (max 20MB)');
        }
      }
    }

    if (imageItems.length > 0) {
      event.preventDefault();
      
      // Limit to 3 images total
      const currentCount = attachedImages.length;
      const remainingSlots = Math.max(0, 3 - currentCount);
      if (remainingSlots === 0) {
        setError('Maximum of 3 images allowed');
        return;
      }

      const filesToAdd = imageItems.slice(0, remainingSlots);
      if (filesToAdd.length < imageItems.length) {
        setError(`Only ${remainingSlots} more image${remainingSlots > 1 ? 's' : ''} can be added (max 3 total)`);
      }

      try {
        const dataURIs = await Promise.all(filesToAdd.map(fileToDataURI));
        setAttachedImages((prev) => [...prev, ...dataURIs]);
      } catch (error) {
        console.error('Failed to process pasted images', error);
        setError('Failed to process pasted images. Please try again.');
      }
    }
  };

  // Remove an attached image
  const removeImage = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if ((!input.trim() && attachedImages.length === 0) || isLoading) return;

    // Build message content with text and images
    let messageContent: MessageContent;
    if (attachedImages.length > 0) {
      const contentArray: Array<{ type: 'input_text'; text: string } | { type: 'input_image'; image_url: string }> = [];
      if (input.trim()) {
        contentArray.push({ type: 'input_text', text: input.trim() });
      }
      attachedImages.forEach((imageUrl) => {
        contentArray.push({ type: 'input_image', image_url: imageUrl });
      });
      messageContent = contentArray;
    } else {
      messageContent = input.trim();
    }

    const nextMessages = [...messages, { role: 'user' as const, content: messageContent }];
    setMessages(nextMessages);
    setInput('');
    setAttachedImages([]);
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
    const contentArray = Array.isArray(message.content) ? message.content : null;
    const textContent = Array.isArray(message.content) 
      ? contentArray?.find((item) => item.type === 'input_text')?.text || ''
      : message.content;

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
          {isUser ? (
            <div className="space-y-2">
              {contentArray && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {contentArray
                    .filter((item) => item.type === 'input_image')
                    .map((item, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={item.image_url}
                          alt={`Uploaded image ${imgIndex + 1}`}
                          className="max-w-[200px] max-h-[200px] rounded-lg object-cover border border-white/20"
                        />
                      </div>
                    ))}
                </div>
              )}
              {textContent && <div>{textContent}</div>}
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-cyan-300">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
                  ),
                  li: ({ children }) => <li className="text-slate-200">{children}</li>,
                  code: ({ children }) => (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-cyan-300">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-cyan-500/50 pl-3 italic text-slate-300 my-2">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          )}
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

      <div 
        ref={messagesContainerRef}
        className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-4 custom-scrollbar hover:pr-3 transition-all"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
          willChange: 'scroll-position',
        }}
      >
        {conversation.map(renderMessage)}
        <div ref={messagesEndRef} />
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

      <div className="flex flex-col gap-2">
        {attachedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Describe what you want to build, who it serves, and any deadlines... (Paste images here)"
            className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 text-white p-4 pr-12 placeholder:text-slate-500 transition resize-none overflow-y-auto min-h-[80px] max-h-[300px]"
            style={{ height: 'auto' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || attachedImages.length >= 3}
            className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed z-10"
            aria-label="Upload image"
            title={attachedImages.length >= 3 ? 'Maximum 3 images allowed' : 'Upload image'}
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
          <div className="absolute right-12 bottom-3 flex items-center gap-2 text-xs text-slate-400 pointer-events-none">
            <span>Enter to send</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>Shift + Enter for new line</span>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          aria-label="Upload images"
        />
        <div className="flex justify-end">
          <Button onClick={sendMessage} isLoading={isLoading} disabled={isLoading || (!input.trim() && attachedImages.length === 0)} className="px-5">
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
