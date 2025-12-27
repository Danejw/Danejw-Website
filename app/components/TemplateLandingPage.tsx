/* Landing template adapted from reference HTML; uses remote assets and lucide icons. */
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LayoutTemplate,
  Box,
  Cpu,
  Code2,
  Server,
  Layers,
  Database,
  Cloud,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Hammer,
  ArrowUpRight,
  Zap,
  Triangle,
  X,
  ExternalLink,
  Github,
  CheckCircle,
} from 'lucide-react';
import { SocialIcons } from './SocialIcons';
import { InputArea } from './InputArea';
import { CustomCursor } from './CustomCursor';
import { Button } from './ui/Button';
import { ScopeChat } from './ScopeChat';

type SectionKey = 'hero' | 'process' | 'services' | 'work' | 'contact';

const sectionIds: Record<SectionKey, string> = {
  hero: 'hero',
  process: 'build',
  services: 'services',
  work: 'work',
  contact: 'contact',
};

const sectionInfo: Record<SectionKey, { label: string; detail: string }> = {
  hero: {
    label: 'Introduction',
    detail: 'High-level positioning and credibility for Dane Willacker.',
  },
  process: {
    label: 'Custom Build',
    detail: 'Bespoke web applications tailored to your specific needs and workflows.',
  },
  services: {
    label: 'Services',
    detail: 'Service tiers, pricing, and how engagements scale over time.',
  },
  work: {
    label: 'Portfolio',
    detail: 'Representative case studies spanning SaaS, ecommerce, and AI.',
  },
  contact: {
    label: 'Engage',
    detail: 'Direct contact and booking form to scope engagements quickly.',
  },
};

const marqueeItems = [
  { icon: <Code2 className="w-5 h-5 text-cyan-400" />, label: 'Python' },
  { icon: <Hammer className="w-5 h-5 text-cyan-400" />, label: 'C#' },
  { icon: <LayoutTemplate className="w-5 h-5 text-cyan-400" />, label: 'TypeScript' },
  { icon: <Box className="w-5 h-5 text-cyan-400" />, label: 'Next.js' },
  { icon: <Sparkles className="w-5 h-5 text-cyan-400" />, label: 'Vite' },
  { icon: <Zap className="w-5 h-5 text-cyan-400" />, label: 'FastAPI' },
  { icon: <Database className="w-5 h-5 text-cyan-400" />, label: 'Supabase' },
  { icon: <BrainCircuit className="w-5 h-5 text-cyan-400" />, label: 'ChatGPT' },
  { icon: <Server className="w-5 h-5 text-cyan-400" />, label: 'Anthropic' },
  { icon: <Cloud className="w-5 h-5 text-cyan-400" />, label: 'Gemini' },
  { icon: <Layers className="w-5 h-5 text-cyan-400" />, label: 'Cursor' },
  { icon: <Github className="w-5 h-5 text-cyan-400" />, label: 'GitHub' },
  { icon: <Cpu className="w-5 h-5 text-cyan-400" />, label: 'Unity' },
  { icon: <Triangle className="w-5 h-5 text-cyan-400" />, label: 'Vercel' },
  { icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />, label: 'Render' },
];

type BuildSlide = {
  title: string;
  highlight: string;
  copy: string;
  img: string;
};

const buildSlides: BuildSlide[] = [
  {
    title: 'Build Custom',
    highlight: 'Software.',
    copy:
      'Architect, design, and ship bespoke web applications. From greenfield builds to modernizing legacy stacks, you get battle-tested execution, and solutions made for you rather than generalized one fit all solutions.',
    img: '/photos/blurred_look.jpeg',
  },
  {
    title: 'Solve your',
    highlight: 'Niche.',
    copy:
      'Every business has unique challenges. I focus on understanding your specific pain points and delivering targeted solutions that eliminate bottlenecks, streamline workflows, and drive measurable results.',
    img: '/photos/blurred_look_3.jpeg',
  },
  {
    title: 'Make It',
    highlight: 'Personal.',
    copy:
      'Tailored experiences that feel crafted for you. Personalized to fit your needs and solve your problems to save you time and money.',
    img: '/photos/blurred_look_2.jpeg',
  }
];

type ServiceTier = {
  title: string;
  price: string;
  summary: string;
  details: string[];
};

const serviceTiers: ServiceTier[] = [
  {
    title: 'Single-Page Website',
    price: '$1,000',
    summary:
      'A focused, high-quality landing page designed to clearly communicate what you do and convert visitors into contacts or customers. This is ideal for personal brands, early startups, campaigns, or product launches.',
    details: [
      'Includes custom design, mobile responsiveness, basic SEO setup, and a contact or signup form.',
      'Built fast and optimized for clarity.',
    ],
  },
  {
    title: 'Multi-Page Website',
    price: '$2,500',
    summary:
      'A full website with multiple pages such as Home, About, Services, and Contact. This is best for small businesses that need structure, credibility, and room to explain what they offer.',
    details: [
      'Includes custom layout, navigation, responsive design, and scalable structure so new pages can be added later.',
    ],
  },
  {
    title: 'Multi-Page Website With Database',
    price: '$4,500',
    summary:
      'A dynamic website backed by a database for storing and managing content or user data. This is useful for blogs, directories, content platforms, or internal tools.',
    details: [
      'Includes database setup, dynamic content rendering, and basic backend functionality to support real data instead of static pages.',
    ],
  },
  {
    title: 'Custom Web Application',
    price: '$7,500+',
    summary:
      'A fully custom web application with backend logic, authentication, dashboards, and integrations. This is real software built to solve a specific business problem.',
    details: [
      'Includes custom backend development, API integrations, database design, user flows, and scalable architecture. Pricing depends on scope and complexity.',
    ],
  },
  {
    title: 'AI Integrations',
    price: '+$1,500',
    summary:
      'Add AI capabilities to your product or workflow. This can include chat interfaces, assistants, content generation, decision support tools, or voice interactions.',
    details: [
      'AI is integrated intentionally to reduce manual work or unlock new capabilities, not as a gimmick.',
    ],
  },
  {
    title: 'Automation and Workflow Integrations',
    price: '+$1,000',
    summary:
      'Automate repetitive processes and connect your tools together. This includes system-to-system integrations, background jobs, and trigger-based workflows.',
    details: [
      'Ideal for saving time, reducing errors, and letting your software run without constant human input.',
    ],
  },
];

type PortfolioItem = {
  title: string;
  description: string;
  fullDescription?: string;
  tech: string;
  img: string;
  video?: string;
  tall?: boolean;
  link?: string;
  productHunt?: boolean;
  productHuntUrl?: string;
};

const portfolio: PortfolioItem[] = [
  {
    title: 'OtherHalfOf.me',
    description: 'Private AI-assisted matchmaking service',
    fullDescription: 'The Other Half Of Me is a private AI-assisted matchmaking service for dating and finding your other half. Built with modern tools to create meaningful connections through intelligent matching.',
    tech: 'VITE / TYPESCRIPT / SUPABASE',
    img: '/photos/Otherhalfofme.png',
    link: 'https://otherhalfof.me',
  },
  {
    title: 'Ebauche.io',
    description: 'AI-powered design tool for construction and remodeling',
    fullDescription: 'Ebauche augments the design process of construction and remodeling projects. Turn sketches into clean floor plans and visualizations that help clients understand spatial concepts with clarity.',
    tech: 'NEXT.JS / TYPESCRIPT / SUPABASE',
    img: '/photos/Ebauche.png',
    link: 'https://www.ebauche.io',
  },
  {
    title: 'ViziVibes.com',
    description: 'Generates data-driven infographics',
    fullDescription: 'Transform your data into stunning, shareable infographics with AI-powered design. Perfect for presentations, social media, and visual storytelling.',
    tech: 'REACT / NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / GEMINI / SUPABASE',
    img: '/photos/ViziVibes.jpg',
    video: '/videos/ViziVibes_Video.mp4',
    link: 'https://vizivibes.com',
    productHunt: true,
    productHuntUrl: 'https://www.producthunt.com/posts/vizivibes',
  },
  {
    title: 'GoodLooks.me',
    description: 'Try on hair styles and colors',
    fullDescription: 'GoodLooks is an AI-powered beauty consultation platform for clients and stylists. Upload a selfie to preview photorealistic hairstyles, experiment with infinite cuts and colors, and share detailed notes to compare before-and-after transformations.',
    tech: 'REACT / NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / GEMINI / SUPABASE',
    img: '/photos/GoodLooks.gif',
    link: 'https://goodlooks.me',
    productHunt: true,
    productHuntUrl: 'https://www.producthunt.com/posts/goodlooks',
  },
  {
    title: 'JustBuildNow.com',
    description: 'Build in public AI agent automaton',
    fullDescription: 'JustBuildNow makes building in public effortless for creators. Sign up with GitHub to launch a public profile automatically, share project updates, and collaborate transparently with a progress-focused dashboard.',
    tech: 'NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / OPENAI / SUPABASE',
    img: '/photos/JustBuildNow.jpg',
    video: '/videos/JustBuildNow_Video.mp4',
    link: 'https://justbuildnow.com',
  },
  {
    title: 'ItsMemory.com',
    description: 'Persistent graph-backed memory layer for AI Agents',
    fullDescription: 'Its Memory is an AI-powered knowledge management platform with Profiles, Dashboards, and collaborative Brains that keep personal knowledge organized. Users can sign in, explore pricing plans, and manage productivity, memories, and accounts in one place.',
    tech: 'NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / OPENAI / SUPABASE',
    img: '/photos/ItsMemory.jpg',
    video: '/videos/ItsMemory.mp4',
    tall: true,
    link: 'https://itsmemory.com',
  },
  {
    title: 'Knolia',
    description: 'Therapeutical AI Voice Companion for your personal use',
    fullDescription: 'Creator of an AI-driven companion application (Knolia.org) designed to combat loneliness. A personal AI that learns over time, available 24/7 to listen without judgment. Focuses on social good through empathetic conversational AI.',
    tech: 'NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / OPENAI / SUPABASE',
    img: '/photos/Knolia.jpg',
    link: 'https://knolia.org',
  },
  {
    title: 'XR Medical Visualization',
    description: 'Immersive multiplayer anatomy visualizations',
    fullDescription: 'Advanced VR/AR medical training platform for anatomy visualization in immersive environments. Built with Unity and Oculus for collaborative medical education.',
    tech: 'UNITY / C# / OCULUS',
    img: '/photos/ARMed.jpeg',
    video: '/videos/ARMed.mp4',
  },
  {
    title: 'Neural Net Viz',
    description: 'Interactive neural network visualizer',
    fullDescription: 'Visualize and interact with neural networks in 3D. Built with Three.js to help developers and researchers understand complex AI architectures through interactive visualization.',
    tech: 'Three.JS / REACT / GEMINI',
    img: '/photos/NNViz.jpg',
    video: '/videos/NN3D.mp4'
  },
  {
    title: 'Golf Club Builder',
    description: 'Shopify-integrated iron set configurator',
    fullDescription: 'Built for client Oriekhalkos, this app lets golfers design custom iron sets and purchase them. It retrieves all product data and images through Shopify\'s Storefront API, with checkout handled directly by Shopify.',
    tech: 'SHOPIFY / REACT / TYPESCRIPT',
    img: '/photos/golf_club_builder.png',
  },
  {
    title: 'Assistance For Unity',
    description: 'AI assistant integrated into the Unity Editor',
    fullDescription: 'AI chat assistant for the Unity Editor. Provides in-editor help via natural language queries to streamline coding and design tasks, merging AI with developer workflows.',
    tech: 'UNITY / C# / OPENAI',
    img: '/photos/AssistanceForUnity.webp',
    link: 'https://assetstore.unity.com/packages/tools/ai-ml-integration/assistance-293407',
  },
  {
    title: 'One-Click Docs',
    description: 'Generate documentation for your codebase with a single click',
    fullDescription: 'Automatically generate comprehensive documentation for your Unity projects with a single click. Saves hours of manual work and keeps documentation up to date.',
    tech: 'UNITY / C# / OPENAI',
    img: '/photos/One_click_documentation.webp',
    link: 'https://assetstore.unity.com/packages/tools/ai-ml-integration/one-click-documentation-291665',
  },
  {
    title: 'One-Click Translations',
    description: 'Translate your game UI with a single click',
    fullDescription: 'Instantly translate your Unity game UI into multiple languages with a single click. Perfect for reaching global audiences without manual translation work.',
    tech: 'UNITY / C# / OPENAI',
    img: '/photos/One_click_translations.webp',
    link: 'https://assetstore.unity.com/packages/tools/localization/one-click-translations-291308',
  },
  {
    title: 'ImprovForms.com',
    description: 'Create and fill forms with a conversational flow',
    fullDescription: 'ImprovForms is a platform for creating and sharing forms with AI. It allows you to create forms with AI-powered questions and answers, and share them with your friends and family.',
    tech: 'NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / OPENAI / SUPABASE',
    img: '/photos/ImprovForms.jpg',
    link: 'https://improvforms.com',
  },
];

/**
 * Radial teal tint that follows the pointer 1:1 for subtle interactivity.
 * Uses CSS custom properties to keep the gradient in sync without layout thrash.
 */
const CursorRadialTint: React.FC = () => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingCoords = useRef<{ x: number; y: number } | null>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; active: boolean }>>([]);
  const RIPPLE_SIZE = 360;
  const RIPPLE_DURATION = 650;

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const applyCoords = () => {
      if (!overlayRef.current || !pendingCoords.current) return;
      const { x, y } = pendingCoords.current;
      overlayRef.current.style.setProperty('--glow-x', `${x}px`);
      overlayRef.current.style.setProperty('--glow-y', `${y}px`);
      pendingCoords.current = null;
      frameRef.current = null;
    };

    const requestApply = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(applyCoords);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pendingCoords.current = { x: event.clientX, y: event.clientY };
      requestApply();
    };

    const handlePointerDown = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const id = Date.now() + Math.random();

      setRipples((prev) => {
        const next = [...prev.slice(-4), { id, x, y, active: false }];

        requestAnimationFrame(() => {
          setRipples((current) =>
            current.map((ripple) =>
              ripple.id === id ? { ...ripple, active: true } : ripple,
            ),
          );
        });

        setTimeout(() => {
          setRipples((current) => current.filter((ripple) => ripple.id !== id));
        }, RIPPLE_DURATION);

        return next;
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={
        {
          '--glow-x': '50%',
          '--glow-y': '50%',
          background:
            'radial-gradient(260px 260px at var(--glow-x) var(--glow-y), rgba(6,182,212,0.32), rgba(6,182,212,0) 60%)',
          mixBlendMode: 'screen',
        } as React.CSSProperties
      }
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute block rounded-full pointer-events-none"
          style={{
            left: ripple.x - RIPPLE_SIZE / 2,
            top: ripple.y - RIPPLE_SIZE / 2,
            width: RIPPLE_SIZE,
            height: RIPPLE_SIZE,
            background:
              'radial-gradient(circle, rgba(6,182,212,0.35), rgba(6,182,212,0))',
            transform: ripple.active ? 'scale(2.4)' : 'scale(0.35)',
            opacity: ripple.active ? 0 : 0.55,
            transition: `transform ${RIPPLE_DURATION}ms ease-out, opacity ${RIPPLE_DURATION}ms ease-out`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Product Hunt badge component - displays the iconic Product Hunt badge
 */
const ProductHuntBadge: React.FC<{ className?: string; url?: string }> = ({ className = '', url }) => {
  const badgeContent = (
    <div className={`inline-flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer ${className}`}>
      <Image
        src="/photos/product-hunt-logo-orange-240.png"
        alt="Product Hunt"
        width={40}
        height={40}
        className="w-10 h-10 rounded-lg"
      />
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-block"
      >
        {badgeContent}
      </a>
    );
  }

  return badgeContent;
};

export const TemplateLandingPage: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const processRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const workRef = useRef<HTMLElement | null>(null);
  const questionsRef = useRef<HTMLElement | null>(null);
  const techMarqueeRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [videoReady, setVideoReady] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
  });

  const handleVideoLoaded = useCallback((key: string, videoElement: HTMLVideoElement) => {
    setVideoReady((prev) => ({ ...prev, [key]: true }));
    // Ensure video plays when it becomes ready
    videoElement.play().catch((error) => {
      // Autoplay might be blocked by browser, but video will play when visible
      console.debug('Video autoplay prevented:', error);
    });
  }, []);


  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const updateActiveByScroll = useCallback(() => {
    const centerY = window.innerHeight / 2;
    const candidates: { key: SectionKey; el: HTMLElement | null }[] = [
      { key: 'hero', el: heroRef.current },
      { key: 'process', el: processRef.current },
      { key: 'work', el: workRef.current },
      { key: 'services', el: servicesRef.current },
      { key: 'contact', el: contactRef.current },
    ];

    let closest: SectionKey | null = null;
    let minDistance = Number.POSITIVE_INFINITY;

    candidates.forEach(({ key, el }) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const distance = Math.abs(mid - centerY);
      if (distance < minDistance) {
        minDistance = distance;
        closest = key;
      }
    });

    if (closest === null) return;
    const nextSection: SectionKey = closest;
    setActiveSection((prev) => (prev === nextSection ? prev : nextSection));
  }, []);

  // Smooth scrolling + requestAnimationFrame loop via Lenis
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.12,
    });

    lenisRef.current = lenis;

    let frame: number;
    const onFrame = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(onFrame);
    };

    frame = requestAnimationFrame(onFrame);
    const onScroll = () => updateActiveByScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    lenis.on('scroll', updateActiveByScroll);
    lenis.on('scroll', ScrollTrigger.update);
    updateActiveByScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      lenis.off('scroll', updateActiveByScroll);
      lenis.off('scroll', ScrollTrigger.update);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [updateActiveByScroll]);

  // Page load animations for hero name and description
  useEffect(() => {
    if (typeof window === 'undefined' || !heroRef.current) return;

    // Set initial state to prevent flash
    gsap.set('.hero-name', { x: -200, opacity: 0, filter: 'blur(10px)' });
    gsap.set('.hero-word', { x: 200, opacity: 0, filter: 'blur(8px)' });
    gsap.set('.hero-social-icons', { x: -200, opacity: 0, filter: 'blur(10px)' });

    // Create timeline for coordinated animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate name from left - "DANE" first, then "WILLACKER"
    tl.to('.hero-name-first', {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power4.out',
    })
      .to(
        '.hero-name-second',
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power4.out',
        },
        '-=0.5', // Start slightly before first name finishes
      )
      // Animate description words left, word by word
      .to(
        '.hero-word',
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: {
            amount: 1.5,
            from: 'start', // Start from the left (first word)
          },
        },
        '-=0.3', // Start slightly before name animation completes
      )
      // Animate social icons from left after subtext completes
      .to(
        '.hero-social-icons',
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power4.out',
        },
        '+=0.2', // Start 0.2s after subtext animation completes
      );
  }, []);

  // Scroll-triggered animations (Lenis + GSAP)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          '.hero-line',
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 75%',
              end: 'bottom 55%',
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          '.hero-subcopy',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 70%',
              end: 'bottom 55%',
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          '.hero-icon-chip',
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 65%',
              end: 'bottom 55%',
              scrub: true,
            },
          },
        );

        gsap.to('.hero-bg', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to('.hero-float-1', {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top center',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to('.hero-float-2', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top center',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Animate each staggered card individually
      gsap.utils.toArray<HTMLElement>('.build-slide').forEach((card, idx) => {
        const isEven = idx % 2 === 0;
        
        // Animate card image
        gsap.fromTo(
          card.querySelector('.build-image'),
          { 
            x: isEven ? -60 : 60,
            y: 40, 
            opacity: 0, 
            scale: 0.9,
            rotateY: isEven ? -15 : 15
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'top 35%',
              scrub: 1.5,
            },
          },
        );

        // Animate card content
        gsap.fromTo(
          card.querySelector('.build-copy'),
          { 
            x: isEven ? 40 : -40,
            opacity: 0 
          },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 1.5,
            },
          },
        );

        // Animate words in the copy text from left, word by word
        const buildWords = card.querySelectorAll('.build-word');
        if (buildWords.length > 0) {
          // Set initial state
          gsap.set(buildWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
          
          gsap.to(
            buildWords,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              duration: 0.6,
              stagger: {
                amount: 1.5,
                from: 'start', // Start from the left (first word)
              },
              scrollTrigger: {
                trigger: card,
                start: 'top 75%',
                end: 'top 30%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
              },
            },
          );
        }
      });

      // Animate tech marquee section with Y-axis scale
      if (techMarqueeRef.current) {
        gsap.fromTo(
          techMarqueeRef.current,
          {
            scaleY: 0,
            transformOrigin: 'center center',
          },
          {
            scaleY: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: techMarqueeRef.current,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 1.2,
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      // Animate portfolio items based on scroll position
      if (workRef.current) {
        // Animate "The Work" title from left
        gsap.fromTo(
          '.work-title',
          {
            x: -300,
            opacity: 0,
            filter: 'blur(10px)',
          },
          {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power4.out',
            scrollTrigger: {
              trigger: workRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1.2,
              toggleActions: 'play none none reverse',
            },
          },
        );

        gsap.utils.toArray<HTMLElement>('.portfolio-item').forEach((item) => {
          // Smooth scroll-triggered animation for the entire card
          gsap.fromTo(
            item,
            {
              y: 80,
              opacity: 0,
              scale: 0.92,
              filter: 'blur(10px)',
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                end: 'top 30%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
              },
            },
          );

          // Animate the image/video container separately for layered effect
          const mediaContainer = item.querySelector('.portfolio-media');
          if (mediaContainer) {
            gsap.fromTo(
              mediaContainer,
              {
                scale: 0.88,
                opacity: 0,
              },
              {
                scale: 1,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 85%',
                  end: 'top 35%',
                  scrub: 1.5,
                },
              },
            );
          }

          // Animate the overlay content (title, description, tech)
          const overlay = item.querySelector('.portfolio-overlay');
          if (overlay) {
            gsap.fromTo(
              overlay,
              {
                y: 40,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 80%',
                  end: 'top 40%',
                  scrub: 1.8,
                },
              },
            );
          }
        });
      }

      // Animate services section
      if (servicesRef.current) {
        gsap.fromTo(
          '.services-grid-header',
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: servicesRef.current,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1.2,
            },
          },
        );

        // Animate services paragraph words from left to right
        const servicesWords = servicesRef.current.querySelectorAll('.services-word');
        if (servicesWords.length > 0) {
          gsap.set(servicesWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
          
          gsap.to(
            servicesWords,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              duration: 0.6,
              stagger: {
                amount: 1.5,
                from: 'start',
              },
              scrollTrigger: {
                trigger: servicesRef.current,
                start: 'top 75%',
                end: 'top 40%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
              },
            },
          );
        }

        // Animate "You can start small..." text words
        const servicesGrowWords = servicesRef.current.querySelectorAll('.services-grow-word');
        if (servicesGrowWords.length > 0) {
          gsap.set(servicesGrowWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
          
          gsap.to(
            servicesGrowWords,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              duration: 0.6,
              stagger: {
                amount: 1.5,
                from: 'start',
              },
              scrollTrigger: {
                trigger: servicesRef.current,
                start: 'top 70%',
                end: 'top 35%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
              },
            },
          );
        }

        // Animate Approach section words
        const approachWords = servicesRef.current.querySelectorAll('.approach-word');
        if (approachWords.length > 0) {
          gsap.set(approachWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
          
          gsap.to(
            approachWords,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              duration: 0.6,
              stagger: {
                amount: 1.5,
                from: 'start',
              },
              scrollTrigger: {
                trigger: servicesRef.current,
                start: 'top 75%',
                end: 'top 40%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
              },
            },
          );
        }

        gsap.utils.toArray<HTMLElement>('.service-card').forEach((card, idx) => {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0, rotateX: -12, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              scale: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 45%',
                scrub: 1.2,
              },
              delay: idx * 0.05,
            },
          );

          // Animate tier summary words from left to right
          const tierSummaryWords = card.querySelectorAll('.tier-summary-word');
          if (tierSummaryWords.length > 0) {
            gsap.set(tierSummaryWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
            
            gsap.to(
              tierSummaryWords,
              {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'power3.out',
                duration: 0.6,
                stagger: {
                  amount: 1.5,
                  from: 'start',
                },
                scrollTrigger: {
                  trigger: card,
                  start: 'top 80%',
                  end: 'top 40%',
                  scrub: 1.2,
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }

          // Animate tier detail words from left to right
          const tierDetailWords = card.querySelectorAll('.tier-detail-word');
          if (tierDetailWords.length > 0) {
            gsap.set(tierDetailWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
            
            gsap.to(
              tierDetailWords,
              {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'power3.out',
                duration: 0.6,
                stagger: {
                  amount: 1.5,
                  from: 'start',
                },
                scrollTrigger: {
                  trigger: card,
                  start: 'top 75%',
                  end: 'top 35%',
                  scrub: 1.2,
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }
        });

        // Animate "How pricing works" paragraph words
        const pricingWorksWords = servicesRef.current?.querySelectorAll('.pricing-works-word');
        if (pricingWorksWords && pricingWorksWords.length > 0) {
          // Find the parent card element
          const firstWord = pricingWorksWords[0] as HTMLElement;
          const pricingWorksCard = firstWord.closest('.service-card') as HTMLElement;
          
          if (pricingWorksCard) {
            gsap.set(pricingWorksWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
            
            gsap.to(
              pricingWorksWords,
              {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'power3.out',
                duration: 0.6,
                stagger: {
                  amount: 1.5,
                  from: 'start',
                },
                scrollTrigger: {
                  trigger: pricingWorksCard,
                  start: 'top 85%',
                  end: 'top 45%',
                  scrub: 1.2,
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }
        }

        // Animate "Next step" card words
        const nextStepTitleWords = servicesRef.current?.querySelectorAll('.next-step-title-word');
        const nextStepTextWords = servicesRef.current?.querySelectorAll('.next-step-text-word');
        
        if (nextStepTitleWords && nextStepTitleWords.length > 0) {
          // Find the parent card element (same card contains both title and text)
          const firstTitleWord = nextStepTitleWords[0] as HTMLElement;
          const nextStepCard = firstTitleWord.closest('.service-card') as HTMLElement;
          
          if (nextStepCard) {
            gsap.set(nextStepTitleWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
            
            gsap.to(
              nextStepTitleWords,
              {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'power3.out',
                duration: 0.6,
                stagger: {
                  amount: 1.5,
                  from: 'start',
                },
                scrollTrigger: {
                  trigger: nextStepCard,
                  start: 'top 85%',
                  end: 'top 45%',
                  scrub: 1.2,
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }
        }

        if (nextStepTextWords && nextStepTextWords.length > 0) {
          // Find the parent card element
          const firstTextWord = nextStepTextWords[0] as HTMLElement;
          const nextStepCard = firstTextWord.closest('.service-card') as HTMLElement;
          
          if (nextStepCard) {
            gsap.set(nextStepTextWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
            
            gsap.to(
              nextStepTextWords,
              {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'power3.out',
                duration: 0.6,
                stagger: {
                  amount: 1.5,
                  from: 'start',
                },
                scrollTrigger: {
                  trigger: nextStepCard,
                  start: 'top 80%',
                  end: 'top 40%',
                  scrub: 1.2,
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }
        }

        // Animate maintenance costs text words from left to right
        const maintenanceCostsWords = servicesRef.current?.querySelectorAll('.maintenance-costs-word');
        if (maintenanceCostsWords && maintenanceCostsWords.length > 0) {
          // Find the parent container element
          const firstWord = maintenanceCostsWords[0] as HTMLElement;
          const maintenanceContainer = firstWord.closest('.flex.items-center.justify-center') as HTMLElement;
          
          if (maintenanceContainer) {
            gsap.set(maintenanceCostsWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
            
            gsap.to(
              maintenanceCostsWords,
              {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'power3.out',
                duration: 0.6,
                stagger: {
                  amount: 1.5,
                  from: 'start',
                },
                scrollTrigger: {
                  trigger: maintenanceContainer,
                  start: 'top 85%',
                  end: 'top 45%',
                  scrub: 1.2,
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }
        }
      }

      // Animate questions section
      if (questionsRef.current) {
        // Animate header and subtitle
        gsap.fromTo(
          '.questions-header',
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: questionsRef.current,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1.5,
            },
          },
        );

        // Animate subtitle words word by word from left to right
        const subtitleWords = questionsRef.current?.querySelectorAll('.questions-subtitle-word');
        if (subtitleWords && subtitleWords.length > 0) {
          gsap.set(subtitleWords, {
            x: 200,
            opacity: 0,
            filter: 'blur(8px)',
          });

          gsap.to(
            subtitleWords,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              duration: 0.6,
              stagger: {
                amount: 1.5,
                from: 'start', // Start from the left (first word)
              },
              scrollTrigger: {
                trigger: questionsRef.current,
                start: 'top 75%',
                end: 'top 40%',
                scrub: 1.5,
                toggleActions: 'play none none reverse',
              },
            },
          );
        }

        // Animate each question group (question + input)
        gsap.utils.toArray<HTMLElement>('.question-group').forEach((group) => {
          const question = group.querySelector('.question-item') as HTMLElement;
          const input = group.querySelector('.question-input') as HTMLElement;
          const isRight = group.classList.contains('question-group-right');
          
          if (!question) return;

          // Set initial state for words
          const words = question.querySelectorAll('.question-word');
          gsap.set(words, { 
            x: isRight ? 200 : -200, 
            opacity: 0, 
            filter: 'blur(8px)' 
          });

          // Set initial state for input area
          if (input) {
            gsap.set(input, {
              x: isRight ? 200 : -200,
              opacity: 0,
              y: 30,
              filter: 'blur(8px)',
            });
          }

          // Animate question container
          gsap.fromTo(
            question,
            {
              y: 60,
              opacity: 0,
              x: isRight ? 100 : -100,
            },
            {
              y: 0,
              opacity: 1,
              x: 0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 85%',
                end: 'top 40%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
              },
            },
          );

          // Animate words word by word
          gsap.to(
            words,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              duration: 0.6,
              stagger: {
                amount: 1.5,
                from: isRight ? 'end' : 'start', // Right-aligned questions animate from end
              },
              scrollTrigger: {
                trigger: group,
                start: 'top 80%',
                end: 'top 35%',
                scrub: 1.5,
                toggleActions: 'play none none reverse',
              },
            },
          );

          // Animate input area after question words
          if (input) {
            gsap.to(
              input,
              {
                x: 0,
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: group,
                  start: 'top 75%',
                  end: 'top 30%',
                  scrub: 1.5,
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }
        });
      }

      // Animate contact section - heading and chat component
      if (contactRef.current) {
        // Animate contact heading from left
        gsap.fromTo(
          '.contact-heading',
          {
            x: -300,
            opacity: 0,
            filter: 'blur(10px)',
          },
          {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power4.out',
            scrollTrigger: {
              trigger: contactRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1.2,
              toggleActions: 'play none none reverse',
            },
          },
        );

        // Animate ScopeChat component from left
        gsap.fromTo(
          '.contact-chat',
          {
            x: 300,
            opacity: 0,
            filter: 'blur(10px)',
          },
          {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power4.out',
            scrollTrigger: {
              trigger: contactRef.current,
              start: 'top 80%',
              end: 'top 45%',
              scrub: 1.2,
              toggleActions: 'play none none reverse',
            },
          },
        );

        // Animate ScopeChat title words from left to right
        const scopeChatTitleWords = contactRef.current.querySelectorAll('.scope-chat-title-word');
        if (scopeChatTitleWords.length > 0) {
          gsap.set(scopeChatTitleWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
          
          gsap.to(
            scopeChatTitleWords,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              duration: 0.6,
              stagger: {
                amount: 1.5,
                from: 'start',
              },
              scrollTrigger: {
                trigger: contactRef.current,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
              },
            },
          );
        }

        // Animate ScopeChat description words from left to right
        const scopeChatDescriptionWords = contactRef.current.querySelectorAll('.scope-chat-description-word');
        if (scopeChatDescriptionWords.length > 0) {
          gsap.set(scopeChatDescriptionWords, { x: 200, opacity: 0, filter: 'blur(8px)' });
          
          gsap.to(
            scopeChatDescriptionWords,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power3.out',
              duration: 0.6,
              stagger: {
                amount: 1.5,
                from: 'start',
              },
              scrollTrigger: {
                trigger: contactRef.current,
                start: 'top 75%',
                end: 'top 35%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
              },
            },
          );
        }
      }

      // Animate footer from bottom up
      if (footerRef.current) {
        // Animate social icons
        gsap.fromTo(
          '.footer-content',
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 95%',
              end: 'top 70%',
              scrub: 1.2,
              toggleActions: 'play none none reverse',
            },
          },
        );

        // Animate big DANEJW text from bottom
        gsap.fromTo(
          '.footer-name',
          {
            y: 100,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1.5,
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    key: SectionKey,
  ) => {
    event.preventDefault();
    const target = document.getElementById(sectionIds[key]);

    if (target) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -64 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      setActiveSection(key);
    }
  };

  const sectionOrder = useMemo(() => Object.keys(sectionInfo) as SectionKey[], []);

  return (
    <div ref={rootRef} className="antialiased text-slate-300 selection:bg-cyan-500 selection:text-black relative bg-[#030303]">
      {/* Overlays */}
      <div className="fixed inset-0 scanlines pointer-events-none h-screen w-screen z-20" />
      <div className="fixed inset-0 dot-grid-tight pointer-events-none h-screen w-screen z-0 opacity-50" />
      <CursorRadialTint />
      <CustomCursor />
      <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-void opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.08),transparent_40%)] opacity-25" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a className="tracking-widest text-lg text-white hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out flex items-center gap-1">
            Dane<span className="text-cyan-500">jw</span>
          </a>
          <div className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase text-slate-300">
            <a
              href="#services"
              onClick={(event) => handleNavClick(event, 'services')}
              className={`hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out ${
                activeSection === 'services' ? 'text-cyan-400' : ''
              }`}
            >
              Services
            </a>
            <a
              href="#work"
              onClick={(event) => handleNavClick(event, 'work')}
              className={`hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out ${activeSection === 'work' ? 'text-cyan-400' : ''}`}
            >
              Work
            </a>
            <a
              href="#contact"
              onClick={(event) => handleNavClick(event, 'contact')}
              className={`hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out ${activeSection === 'contact' ? 'text-cyan-400' : ''}`}
            >
              Contact
            </a>
          </div>
          <button 
            className="md:hidden text-white hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        
        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-4 text-xs font-medium tracking-widest uppercase text-slate-300 border-t border-white/5">
            <a
              href="#services"
              onClick={(event) => {
                handleNavClick(event, 'services');
                setMobileMenuOpen(false);
              }}
              className={`hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out origin-left ${activeSection === 'services' ? 'text-cyan-400' : ''}`}
            >
              Services
            </a>
            <a
              href="#work"
              onClick={(event) => {
                handleNavClick(event, 'work');
                setMobileMenuOpen(false);
              }}
              className={`hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out origin-left ${activeSection === 'work' ? 'text-cyan-400' : ''}`}
            >
              Work
            </a>
            <a
              href="#contact"
              onClick={(event) => {
                handleNavClick(event, 'contact');
                setMobileMenuOpen(false);
              }}
              className={`hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out origin-left ${activeSection === 'contact' ? 'text-cyan-400' : ''}`}
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Scroll dots rail */}
      <div className="hidden sm:flex fixed inset-y-0 left-4 z-40 items-center pointer-events-none">
        <div className="pointer-events-auto rounded-full bg-black/60 border border-white/10 backdrop-blur-md px-3 py-4 flex flex-col gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          {sectionOrder.map((key) => (
            <button
              key={key}
              aria-label={`Jump to ${sectionInfo[key].label}`}
              onClick={(event) => handleNavClick(event, key)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                activeSection === key
                  ? 'bg-cyan-400 border-white shadow-[0_0_12px_rgba(255,255,255,0.35)] scale-110'
                  : 'bg-white/10 border-white/20 hover:bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Hero */}
      <header id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 z-1">
        <div className="absolute inset-0 z-0 opacity-40 hero-bg">
          <Image
            src="/photos/hero_background_transparent.png"
            alt="Circuit landscape background"
            fill
            className="object-cover grayscale contrast-125 z-20"
            priority
            sizes="100vw"
          />
        </div>

        {/* Headshot */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col items-center lg:items-start space-y-8">
            {/* Image - Always on top, centered on mobile, left-aligned on desktop */}
            <div className="flex justify-center lg:justify-start w-full">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden flex-shrink-0 animate-headshot">
                <Image
                  src="/photos/headshot_cut.png"
                  alt="Julius Willacker headshot"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 224px, 256px"
                  priority
                />
              </div>
            </div>
            
            {/* Text Content - Always below the image */}
            <div className="space-y-6 w-full text-center lg:text-left">
              <p className="hero-line text-cyan-400 tracking-[0.2em] text-xs uppercase">The Architect Of Digital Experiences</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white tracking-tight leading-[0.9]">
                <span className="hero-name hero-name-first block">DANE</span>
                <span className="hero-name hero-name-second block bg-cyan-500 text-black px-2 inline-block mt-2">WILLACKER</span>
              </h1>
              <p className="hero-subcopy hero-description text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 font-light tracking-wide border-l-2 border-cyan-500 pl-6 bg-black/50 backdrop-blur-md p-4">
                <span className="hero-word">Full-stack</span>{' '}
                <span className="hero-word">partner</span>{' '}
                <span className="hero-word">for</span>{' '}
                <span className="hero-word">founders,</span>{' '}
                <span className="hero-word">small</span>{' '}
                <span className="hero-word">business</span>{' '}
                <span className="hero-word">owners,</span>{' '}
                <span className="hero-word">and</span>{' '}
                <span className="hero-word">teams</span>{' '}
                <span className="hero-word">who</span>{' '}
                <span className="hero-word">need</span>{' '}
                <span className="hero-word">modern,</span>{' '}
                <span className="hero-word">fast</span>{' '}
                <span className="hero-word">solutions</span>{' '}
                <span className="hero-word">that</span>{' '}
                <span className="hero-word">are</span>{' '}
                <span className="hero-word">easy</span>{' '}
                <span className="hero-word">to</span>{' '}
                <span className="hero-word">manage,</span>{' '}
                <span className="hero-word">automate</span>{' '}
                <span className="hero-word">tasks,</span>{' '}
                <span className="hero-word">and</span>{' '}
                <span className="hero-word">save</span>{' '}
                <span className="hero-word">time.</span>
              </p>
              <div className="hero-social-icons flex items-center justify-center lg:justify-start mt-6">
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Build custom software staggered cards */}
      <section id="build" ref={processRef} className="build-section relative z-10 mb-20 -mt-12 sm:mt-0 md:mt-0 lg:mt-8 xl:mt-12 2xl:mt-16">
        <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none animate-glow-drift-right" />

        <div className="max-w-7xl mx-auto px-6 py-16 space-y-32">
          {buildSlides.map((slide, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <article
                key={slide.title}
                className={`build-slide relative grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-6 md:gap-8 lg:gap-12 items-center ${
                  isEven ? 'lg:ml-0' : 'lg:ml-20'
                }`}
              >
                {/* Card with glassmorphic effect */}
                <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="group relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] build-image border border-white/10 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl">
                    <img
                      src={slide.img}
                      alt={slide.title}
                      width={1600}
                      height={900}
                      className="object-cover w-full h-[400px] grayscale transition duration-700 ease-out transform group-hover:grayscale-0 group-hover:scale-105 opacity-80"
                      sizes="(min-width: 1024px) 50vw, 90vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 build-copy relative z-10 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
                      {slide.title}
                      <br />
                      <span className="bg-cyan-500 text-black px-1 inline-block">{slide.highlight}</span>
                    </h2>
                  </div>
                  <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl font-light tracking-wide border-l-2 border-cyan-500 pl-6 bg-black/50 backdrop-blur-md p-4">
                    {slide.copy.split(' ').map((word, wordIdx) => (
                      <span key={wordIdx} className="build-word">
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Tech marquee */}
      <section ref={techMarqueeRef} className="relative z-10 border-y bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-10 overflow-hidden">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[0.9rem] uppercase tracking-[0.3em] text-black">Tech Stack</span>
            <div className="h-px w-12 bg-gradient-to-r from-cyan-500 to-transparent" />
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-10 items-center whitespace-nowrap animate-marquee text-black text-lg md:text-xl">
              {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 uppercase tracking-[0.25em] text-xs md:text-[0.7rem]">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="work" ref={workRef} className="py-20 relative z-10">
        <div className="absolute left-0 top-1/4 w-1/2 h-1/2 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none animate-glow-drift-left" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 pb-4">
            <h3 className="work-title text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">The <span className="bg-cyan-500 text-black px-1 inline-block">Work</span></h3>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {portfolio.map((item) => (
              <div 
                key={item.title} 
                className="portfolio-item group break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(item)}
              >
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors z-20 border-2 border-transparent group-hover:border-cyan-400/50 rounded-xl" />
                  <div className="portfolio-media relative w-full overflow-hidden">
                    {item.productHunt && (
                      <div className="absolute top-3 right-3 z-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                        <ProductHuntBadge url={item.productHuntUrl} />
                      </div>
                    )}
                    <img
                      src={item.img}
                      alt={item.title}
                      className={`w-full ${item.tall ? 'h-[500px]' : 'h-auto'} object-cover transform transition-transform duration-700 grayscale ${
                        videoReady[item.title] ? 'opacity-0 scale-100' : 'opacity-100 group-hover:scale-105 group-hover:grayscale-0'
                      }`}
                    />
                    {item.video && (
                      <video
                        className={`absolute inset-0 w-full ${item.tall ? 'h-[500px]' : 'h-auto'} object-cover transition-opacity duration-500 ${
                          videoReady[item.title] ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        src={item.video}
                        poster={item.img}
                        playsInline
                        muted
                        loop
                        autoPlay
                        preload="metadata"
                        onCanPlayThrough={(e) => {
                          const video = e.currentTarget;
                          handleVideoLoaded(item.title, video);
                        }}
                      />
                    )}
                  </div>
                <div className="portfolio-overlay absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-30">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-white font-medium text-lg">{item.title}</h4>
                      <p className="text-md text-slate-400">{item.description}</p>
                      <p className="text-xs text-cyan-400 font-mono mt-1">{item.tech}</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" ref={servicesRef} className="relative z-10 py-24">
        <div className="absolute left-0 top-1/4 w-1/2 h-1/2 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none animate-glow-drift-left" />

        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <div className="services-grid-header grid grid-cols-1 lg:grid-cols-5 gap-10 items-end">
            <div className="lg:col-span-3 space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Services</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
                Design and <br/>
                <span className="bg-cyan-500 text-black px-2 inline-block">Build</span>
              </h2>
              <p className="text-lg text-slate-400 font-light leading-relaxed">
                {'Some clients just need a clean, professional web presence. Others need real software with data, logic, automation, and AI working behind the scenes. The work is always custom, but the structure is simple and transparent so you know exactly what you are getting.'.split(' ').map((word, wordIdx) => (
                  <span key={wordIdx} className="services-word">
                    {word}{' '}
                  </span>
                ))}
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-sm uppercase tracking-[0.2em] text-cyan-200">
                <Sparkles className="w-4 h-4" />
                <span>
                  {'You can start small and grow over time. Each tier builds on the one before it.'.split(' ').map((word, wordIdx) => (
                    <span key={wordIdx} className="services-grow-word">
                      {word}{' '}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="lg:col-span-2 lg:ml-auto space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] bg-black/60">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">Approach</p>
                <p className="text-xl text-white font-semibold mt-2">Modern, scalable, and intentionally built.</p>
                <p className="text-slate-400 font-light mt-3 leading-relaxed">
                  {'Every engagement focuses on clarity first, then layered capability. We move quickly, keep you in the loop, and build so the next upgrade is easy.'.split(' ').map((word, wordIdx) => (
                    <span key={wordIdx} className="approach-word">
                      {word}{' '}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {serviceTiers.map((tier) => (
              <article
                key={tier.title}
                className="service-card group relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 via-black/50 to-black/40 p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 ease-out origin-center will-change-transform overflow-hidden group-hover:-translate-y-2 group-hover:scale-[1.1]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-cyan-500/8 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out z-10 border-2 border-transparent group-hover:border-cyan-400/50 rounded-2xl" />
                <div className="relative z-20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-cyan-500">Tier</p>
                      <h3 className="text-2xl text-white font-semibold leading-tight">{tier.title}</h3>
                    </div>
                    <span className="px-3 py-2 rounded-full bg-cyan-500/15 text-cyan-200 text-xs tracking-[0.2em] uppercase border border-cyan-500/40">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-slate-300 font-light mt-4 leading-relaxed">
                    {tier.summary.split(' ').map((word, wordIdx) => (
                      <span key={wordIdx} className="tier-summary-word">
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                  <ul className="mt-5 space-y-3 text-slate-400 font-light">
                    {tier.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-cyan-400 mt-[2px] flex-shrink-0" />
                        <span>
                          {detail.split(' ').map((word, wordIdx) => (
                            <span key={wordIdx} className="tier-detail-word">
                              {word}{' '}
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <div className="inline-flex items-center text-center justify-center gap-3 px-6 text-sm text-cyan-400/60">
              <span>
                {'Maintenance costs apply, including AI token usage, website, database, and automation hosting'.split(' ').map((word, wordIdx) => (
                  <span key={wordIdx} className="maintenance-costs-word">
                    {word}{' '}
                  </span>
                ))}
              </span>
            </div>
          </div>

          <div className="service-card relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-center rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-black/70 to-black/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="lg:col-span-2 space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">How pricing works</p>
              <h3 className="text-3xl md:text-4xl text-white font-semibold leading-tight">Transparent, scoped, and built to grow with you.</h3>
              <p className="text-slate-300 font-light leading-relaxed">
                {'Each project starts with a short scope discussion to make sure the solution fits your goals. Fixed pricing is used whenever possible. Larger or evolving projects may move to milestone-based pricing. If you are unsure where you fit, start with the simplest tier. Everything is built so it can grow with you.'.split(' ').map((word, wordIdx) => (
                  <span key={wordIdx} className="pricing-works-word">
                    {word}{' '}
                  </span>
                ))}
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-black/60 flex flex-col gap-3">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-500">Next step</p>
                <p className="text-white text-xl font-semibold">
                  {'Share where you are and where you want to go.'.split(' ').map((word, wordIdx) => (
                    <span key={wordIdx} className="next-step-title-word">
                      {word}{' '}
                    </span>
                  ))}
                </p>
                <p className="text-slate-400 font-light">
                  {'Pick the nearest tier and we will right-size the build together.'.split(' ').map((word, wordIdx) => (
                    <span key={wordIdx} className="next-step-text-word">
                      {word}{' '}
                    </span>
                  ))}
                </p>
                <Button
                  onClick={(event) => handleNavClick(event, 'contact')}
                  className="mt-2"
                >
                  Start a scope chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prompt Questions Section */}
      <section ref={questionsRef} className="py-24 relative z-10">
        <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none animate-glow-drift-right" />

        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            <div className="text-center mb-12 questions-header">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
                Questions to <br/><span className="mt-2 bg-cyan-500 text-black px-2 inline-block">Consider</span>
              </h3>
              <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto questions-subtitle">
                {'Before we build something together, take a moment to reflect on these questions'.split(' ').map((word, wordIdx) => (
                  <span key={wordIdx} className="questions-subtitle-word">
                    {word}{' '}
                  </span>
                ))}
              </p>
            </div>

            <div className="space-y-8">
              {/* First Question - Left Aligned */}
              <div className="space-y-4 question-group question-group-left">
                <div className="question-item question-left text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl font-light tracking-wide border-l-2 border-cyan-500 pl-6 bg-black/50 backdrop-blur-lg p-4">
                  <p>
                    {'What is the one annoying thing you do over and over every week that you secretly know a computer should be doing for you by now?'.split(' ').map((word, wordIdx) => (
                      <span key={wordIdx} className="question-word">
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="question-input question-input-left max-w-2xl">
                  <InputArea
                    value={questionAnswers.question1}
                    onChange={(value) => setQuestionAnswers(prev => ({ ...prev, question1: value }))}
                    placeholder="Share your thoughts..."
                  />
                </div>
              </div>

              {/* Second Question - Right Aligned */}
              <div className="space-y-4 question-group question-group-right">
                <div className="question-item question-right text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl ml-auto font-light tracking-wide border-r-2 border-cyan-500 pr-6 bg-black/50 backdrop-blur-md p-4">
                  <p className="text-right">
                    {'If you had a piece of software built just for you that understood your exact workflow, what is the first thing you would stop doing manually tomorrow?'.split(' ').map((word, wordIdx) => (
                      <span key={wordIdx} className="question-word">
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="question-input question-input-right max-w-2xl ml-auto">
                  <InputArea
                    value={questionAnswers.question2}
                    onChange={(value) => setQuestionAnswers(prev => ({ ...prev, question2: value }))}
                    placeholder="Share your thoughts..."
                  />
                </div>
              </div>

              {/* Third Question - Left Aligned */}
              <div className="space-y-4 question-group question-group-left">
                <div className="question-item question-left text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl font-light tracking-wide border-l-2 border-cyan-500 pl-6 bg-black/50 backdrop-blur-md p-4">
                  <p>
                    {'Where in your day are you copy-pasting, double entering data, or babysitting a process that could quietly run itself while you do something that actually matters?'.split(' ').map((word, wordIdx) => (
                      <span key={wordIdx} className="question-word">
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="question-input question-input-left max-w-2xl">
                  <InputArea
                    value={questionAnswers.question3}
                    onChange={(value) => setQuestionAnswers(prev => ({ ...prev, question3: value }))}
                    placeholder="Share your thoughts..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" ref={contactRef} className="py-24 relative z-10">
        <div className="absolute left-0 top-1/10 w-1/2 h-1/2 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none animate-glow-drift-left" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 contact-heading text-center justify-center items-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              Let&apos;s Build 
              <br/>
              <span className="bg-cyan-500 text-black px-1 inline-block">Something</span>
            </h2>
          </div>
          <div className="contact-chat">
            <ScopeChat questionAnswers={questionAnswers} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-0 relative z-20 overflow-hidden">
        <div className="footer-content max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          <SocialIcons />
          {/* <p className="text-slate-600 text-xs tracking-widest uppercase">© 2025. All Rights Reserved.</p> */}
        </div>
        <h4 className="footer-name tracking-[0.2em] text-[10vw] md:text-[8vw] font-semibold text-gray-400/20 select-none text-center leading-none mb-0 pb-0">DANEJW</h4>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
          
          {/* Modal Content */}
          <div 
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-black/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-[0_20px_80px_rgba(6,182,212,0.3)] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 hover:border-cyan-500/50 transition-all group"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white group-hover:text-white transition-colors" />
            </button>

            {/* Project Image/Video */}
            <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-t-2xl">
              {selectedProject.productHunt && (
                <div className="absolute top-4 right-4 z-20">
                  <ProductHuntBadge url={selectedProject.productHuntUrl} />
                </div>
              )}
              {selectedProject.video ? (
                <video
                  className="w-full h-full object-cover"
                  src={selectedProject.video}
                  poster={selectedProject.img}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            {/* Project Details */}
            <div className="p-8 md:p-10 space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2 tracking-tight">
                  {selectedProject.title}
                </h2>
                <p className="text-cyan-400 font-mono text-xs md:text-sm uppercase tracking-widest">
                  {selectedProject.tech}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-slate-300 leading-relaxed">
                  {selectedProject.description}
                </p>
                {selectedProject.fullDescription && (
                  <p className="text-base text-slate-400 leading-relaxed border-l-2 border-cyan-500 pl-6 bg-black/30 backdrop-blur-md p-4 rounded-r-lg">
                    {selectedProject.fullDescription}
                  </p>
                )}
              </div>

              {/* Visit Project Button */}
              {selectedProject.link && (
                <div className="pt-4">
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-400/70 hover:bg-cyan-500 text-white rounded-lg font-medium tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] group"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

