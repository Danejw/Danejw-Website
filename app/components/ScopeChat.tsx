'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Sparkles, Wand2, X, Plus, Mail, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/Button';
import { ThreeDotLoader } from './ui/ThreeDotLoader';
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
  functionCall?: {
    name: 'fillContactInfo';
    arguments: {
      email?: string;
      contactInfo?: string;
    };
  };
};

const quickPrompts = [
  'Build a multi-page site with a booking form',
  'Add AI chat support for my existing app',
  'Automate weekly client reporting with my CRM',
];

const STORAGE_KEYS = {
  MESSAGES: 'scope-chat-messages',
  LAST_ESTIMATE: 'scope-chat-last-estimate',
  USER_EMAIL: 'scope-chat-user-email',
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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState<string>(() => {
    return loadFromStorage<string>(STORAGE_KEYS.USER_EMAIL, '');
  });
  const [contactInfo, setContactInfo] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
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

  // Auto-scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

  // Save userEmail to localStorage whenever it changes
  useEffect(() => {
    if (userEmail) {
      saveToStorage(STORAGE_KEYS.USER_EMAIL, userEmail);
    } else {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
        } catch (error) {
          console.warn('Failed to remove userEmail from localStorage:', error);
        }
      }
    }
  }, [userEmail]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Auto-extract email from conversation messages
  useEffect(() => {
    if (userEmail && validateEmail(userEmail)) {
      // Email already set and valid, skip extraction
      return;
    }

    // Extract email addresses from all user messages
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const extractedEmails: string[] = [];

    messages.forEach((message) => {
      if (message.role === 'user') {
        if (typeof message.content === 'string') {
          const matches = message.content.match(emailRegex);
          if (matches) {
            extractedEmails.push(...matches);
          }
        } else if (Array.isArray(message.content)) {
          message.content.forEach((item) => {
            if (item.type === 'input_text') {
              const matches = item.text.match(emailRegex);
              if (matches) {
                extractedEmails.push(...matches);
              }
            }
          });
        }
      }
    });

    // Use the last extracted email if found and valid
    if (extractedEmails.length > 0) {
      const lastEmail = extractedEmails[extractedEmails.length - 1];
      if (validateEmail(lastEmail) && lastEmail !== userEmail) {
        setUserEmail(lastEmail);
        setEmailError(null);
      }
    }
  }, [messages, userEmail]);

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

  // Send conversation summary via email
  const sendSummaryEmail = async () => {
    if (messages.length <= 1 || isSendingEmail) return; // Don't send if only initial message

    // Validate email before sending
    if (!userEmail || !validateEmail(userEmail)) {
      setEmailError('Please provide a valid email address to send the summary');
      setError('Please provide a valid email address to send the summary');
      
      // Optionally trigger AI to ask for email by adding a system message
      // This will be handled by the system prompt in the API route
      return;
    }

    setIsSendingEmail(true);
    setError(null);
    setEmailError(null);
    setEmailSent(false);

    try {
      const response = await fetch('/api/scope-chat-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages,
          estimate: lastEstimate, // Include budget estimate and recommended tier
          userEmail: userEmail, // Explicitly provide email
          contactInfo: contactInfo || undefined, // Include contact info if provided
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate summary email');
      }

      const data = await response.json();
      
      // Log email content to browser console
      console.log('='.repeat(80));
      console.log('📋 QUICK OVERVIEW - CONVERSATION SUMMARY:');
      console.log('='.repeat(80));
      console.log(data.overview || 'No overview available');
      console.log('='.repeat(80));
      console.log('📧 EMAIL SUMMARY - ESTIMATE INFORMATION:');
      console.log('='.repeat(80));
      if (data.estimate?.budgetRange) console.log('💰 Budget Estimate:', data.estimate.budgetRange);
      if (data.estimate?.recommendedPackage) console.log('📦 Recommended Tier:', data.estimate.recommendedPackage);
      if (data.estimate?.nextSteps?.length > 0) console.log('✅ Next Steps:', data.estimate.nextSteps);
      if (data.estimate?.missingInfo?.length > 0) console.log('❓ Missing Info:', data.estimate.missingInfo);
      console.log('='.repeat(80));
      console.log('📧 EMAIL METADATA:');
      console.log('='.repeat(80));
      console.log('Subject:', data.emailContent?.subject || 'New Scope Chat Summary');
      console.log('To:', data.emailContent?.to || 'yourindie101@gmail.com');
      if (data.emailContent?.replyTo) {
        console.log('Reply To:', data.emailContent.replyTo);
      }
      console.log('='.repeat(80));
      console.log('\n--- Full HTML Content ---');
      console.log(data.emailContent?.html || 'No HTML content');
      console.log('\n--- Full Text Content ---');
      console.log(data.emailContent?.text || 'No text content');
      console.log('='.repeat(80));

      setEmailSent(true);
      // Reset success message after 5 seconds
      setTimeout(() => setEmailSent(false), 5000);
    } catch (err) {
      console.error('Failed to generate summary email', err);
      setError(err instanceof Error ? err.message : 'Failed to generate summary email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
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
        body: JSON.stringify({ 
          messages: nextMessages,
          userEmail: userEmail || undefined, // Pass current email state so AI knows if it's already filled
          contactInfo: contactInfo || undefined, // Pass current contact info state
        }),
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

      // Handle function calls - fill in email and contact info if provided
      if (data.functionCall && data.functionCall.name === 'fillContactInfo') {
        const { email, contactInfo: contactInfoArg } = data.functionCall.arguments;
        
        if (email && validateEmail(email)) {
          setUserEmail(email);
          setEmailError(null);
        }
        
        if (contactInfoArg) {
          setContactInfo(contactInfoArg);
        }
      }

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
          <span>Scope Chat</span>
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

      {/* Email and Contact Information Inputs */}
      <div className="mb-6 space-y-4">
        <div>
          <label htmlFor="user-email" className="block text-sm font-medium text-cyan-200 mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="user-email"
            type="email"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              setEmailError(null);
            }}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border bg-black/40 text-white placeholder-slate-500",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50",
              "transition-colors",
              emailError
                ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                : "border-cyan-500/30"
            )}
            placeholder="your.email@example.com"
            required
          />
          {emailError && (
            <p className="mt-1.5 text-sm text-red-400">{emailError}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-info" className="block text-sm font-medium text-cyan-200 mb-2">
            Contact Information <span className="text-slate-500 text-xs">(Optional)</span>
          </label>
          <input
            id="contact-info"
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-cyan-500/30 bg-black/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors"
            placeholder="Phone number, company name, etc."
          />
        </div>
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
        {isLoading && (
          <div className="flex w-full gap-3 justify-start text-left">
            <div className="mt-1 h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white/5 border border-white/10 flex items-center">
              <ThreeDotLoader size="md" dotColor="rgb(6 182 212)" className="text-cyan-500" />
            </div>
          </div>
        )}
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

      {messages.length > 1 && 
       lastEstimate?.budgetRange && 
       lastEstimate?.recommendedPackage && 
       userEmail && 
       userEmail.trim().length > 0 && (
        <div className="mb-4 flex justify-center">
          <Button
            onClick={sendSummaryEmail}
            disabled={isSendingEmail || emailSent}
            className={cn(
              'px-6 rounded-md',
              emailSent
                ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/30'
                : ''
            )}
          >
            {isSendingEmail ? (
              <>
                <ThreeDotLoader size="sm" className="mr-2" />
                Sending Summary...
              </>
            ) : emailSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Summary Sent!
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                When You're Ready Send Your Email Summary By Clicking Here
              </>
            )}
          </Button>
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || attachedImages.length >= 3}
            className="absolute right-3 top-3 w-8 h-8 p-0 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:scale-150 hover:border-cyan-500/50 active:scale-100 z-10"
            aria-label="Upload image"
            title={attachedImages.length >= 3 ? 'Maximum 3 images allowed' : 'Upload image'}
          >
            <Plus className="w-4 h-4 text-white" />
          </Button>
          <div className="absolute right-12 bottom-3 flex items-center gap-2 text-xs text-slate-400 pointer-events-none">
            <span className="text-cyan-500/50">Enter to send</span>
            <span className="h-1 w-1 rounded-full bg-slate-600/50" />
            <span className="text-cyan-500/50">Shift + Enter for new line</span>
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
          <Button onClick={sendMessage} disabled={isLoading || (!input.trim() && attachedImages.length === 0)} className="px-5 rounded-md">
            {isLoading ? (
              <>
                <ThreeDotLoader size="sm" />
                Thinking
              </>
            ) : (
              <>
                Send
                {/* <ArrowUpRight className="w-4 h-4" /> */}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
