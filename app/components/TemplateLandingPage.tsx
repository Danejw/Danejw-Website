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
  Rocket,
  ArrowUpRight,
  Star,
  Mail,
  MapPin,
  Zap,
  Triangle,
} from 'lucide-react';

type SectionKey = 'hero' | 'process' | 'work' | 'contact';

const sectionIds: Record<SectionKey, string> = {
  hero: 'hero',
  process: 'process',
  work: 'work',
  contact: 'contact',
};

const sectionInfo: Record<SectionKey, { label: string; detail: string }> = {
  hero: {
    label: 'Introduction',
    detail: 'High-level positioning and credibility for Julius Willacker.',
  },
  process: {
    label: 'Process',
    detail: 'Three-step delivery framework tailored to founder timelines.',
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
      'I architect, design, and ship bespoke web applications. From greenfield builds to modernizing legacy stacks, you get battle-tested execution, and solutions made for you rather than generalized one fit all solutions.',
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

type PortfolioItem = {
  title: string;
  description: string;
  tech: string;
  img: string;
  video?: string;
  tall?: boolean;
};

const processSteps = [
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: 'Ideate & Strategy',
    copy: 'We start with your goals—not the tech. Map outcomes, shape a plan, and align on success.',
    highlight: false,
  },
  {
    icon: <Hammer className="w-6 h-6" />,
    title: 'Build & Develop',
    copy: 'Clean, type-safe code with React/Next frontends and scalable services. Zero fluff.',
    highlight: true,
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Scale & Optimize',
    copy: 'Performance tuning, SEO, and infra scaling so you stay fast globally.',
    highlight: false,
  },
];

const portfolio: PortfolioItem[] = [
  {
    title: 'JustBuildNow.com',
    description: 'Build in public AI agent automaton',
    tech: 'NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / OPENAI / SUPABASE',
    img: '/photos/JustBuildNow.jpg',
  },
  {
    title: 'ItsMemory.com',
    description: 'Persistent graph-backed memory layer for AI Agents',
    tech: 'NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / OPENAI / SUPABASE',
    img: '/photos/ItsMemory.jpg',
    video: '/photos/ItsMemory.mp4',
    tall: true,
  },
  {
    title: 'ViziVibes.com',
    description: 'Generates data-driven infographics',
    tech: 'REACT / NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / GEMINI / SUPABASE',
    img: '/photos/ViziVibes.jpg',
  },
  {
    title: 'GoodLooks.me',
    description: 'Try on hair styles and colors',
    tech: 'REACT / NEXT.JS / TYPESCRIPT / PYTHON / FASTAPI / GEMINI / SUPABASE',
    img: '/photos/GoodLooks.gif',
  },
  {
    title: 'XR Medical Visualization',
    description: 'Immersive multiplayer anatomy visualizations',
    tech: 'UNITY / C# / OCULUS',
    img: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Neural Net Viz',
    description: 'Interactive neural network visualizer',
    tech: 'Three.JS / REACT / GEMINI',
    img: '/photos/NNViz.jpg',
    video: '/photos/NN3D.mp4'
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

export const TemplateLandingPage: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const processRef = useRef<HTMLElement | null>(null);
  const workRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [videoReady, setVideoReady] = useState<Record<string, boolean>>({});

  const handleVideoLoaded = useCallback((key: string) => {
    setVideoReady((prev) => ({ ...prev, [key]: true }));
  }, []);

  const updateActiveByScroll = useCallback(() => {
    const centerY = window.innerHeight / 2;
    const candidates: { key: SectionKey; el: HTMLElement | null }[] = [
      { key: 'hero', el: heroRef.current },
      { key: 'process', el: processRef.current },
      { key: 'work', el: workRef.current },
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
      });
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
      lenisRef.current?.scrollTo(target, { offset: -64 }) ?? target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(key);
    }
  };

  const sectionOrder = useMemo(() => Object.keys(sectionInfo) as SectionKey[], []);

  return (
    <div ref={rootRef} className="antialiased text-slate-300 selection:bg-cyan-500 selection:text-black relative bg-[#030303]">
      {/* Overlays */}
      <div className="fixed inset-0 scanlines pointer-events-none h-screen w-screen z-20" />
      <div className="fixed inset-0 dot-grid-tight pointer-events-none h-screen w-screen z-0 opacity-90" />
      <CursorRadialTint />
      <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-void opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.08),transparent_40%)] opacity-25" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a className="tracking-widest text-lg text-white hover:text-cyan-400 transition-colors flex items-center gap-1">
            JW <span className="text-cyan-500 text-xs align-top">HI</span>
          </a>
          <div className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase text-slate-300">
            <a
              href="#process"
              onClick={(event) => handleNavClick(event, 'process')}
              className={`hover:text-cyan-400 transition-colors ${activeSection === 'process' ? 'text-cyan-400' : ''}`}
            >
              Process
            </a>
            <a
              href="#work"
              onClick={(event) => handleNavClick(event, 'work')}
              className={`hover:text-cyan-400 transition-colors ${activeSection === 'work' ? 'text-cyan-400' : ''}`}
            >
              Work
            </a>
            <a
              href="#contact"
              onClick={(event) => handleNavClick(event, 'contact')}
              className={`hover:text-cyan-400 transition-colors ${activeSection === 'contact' ? 'text-cyan-400' : ''}`}
            >
              Contact
            </a>
          </div>
          <button className="md:hidden text-white">
            <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
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
                  ? 'bg-white border-white shadow-[0_0_12px_rgba(255,255,255,0.35)] scale-110'
                  : 'bg-white/10 border-white/20 hover:bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Hero */}
      <header id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 z-1">
        <div className="absolute inset-0 z-0 opacity-80 hero-bg">
          <Image
            src="/photos/hero_background_transparent.png"
            alt="Circuit landscape background"
            fill
            className="object-cover grayscale contrast-125 z-20"
            priority
            sizes="100vw"
          />
        </div>

        {/* Floating icons */}
        <div className="absolute top-1/4 left-10 opacity-30 animate-float hero-float-1">
          <Box className="w-24 h-24 text-cyan-500" />
        </div>
        <div className="absolute bottom-1/3 right-20 opacity-30 animate-float hero-float-2" style={{ animationDelay: '1.5s' }}>
          <Cpu className="w-16 h-16 text-cyan-500" />
        </div>

        {/* Headshot */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col items-center lg:items-start space-y-8">
            {/* Image - Always on top, centered on mobile, left-aligned on desktop */}
            <div className="flex justify-center lg:justify-start w-full">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden shadow-[0_10px_30px_rgba(6,182,212,0.35)] flex-shrink-0">
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
              <p className="hero-line text-cyan-400 tracking-[0.2em] text-xs uppercase">Architecting Digital Experiences</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white tracking-tight leading-[0.9]">
                <span className="hero-line block">JULIUS</span>
                <span className="hero-line block bg-cyan-500 text-black px-2 inline-block mt-2">WILLACKER</span>
              </h1>
              <p className="hero-subcopy text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 font-light tracking-wide border-l-2 border-cyan-500 pl-6 bg-black/50 backdrop-blur-md p-4">
                Full-stack partner for founders, small business owners, and teams who need modern, fast solutions that are easy to manage, automate tasks, and save time.
              </p>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-slate-300">
                <div className="hero-icon-chip p-2 border border-white/10 rounded bg-black/50 backdrop-blur hover:border-cyan-500/50 transition-colors">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="hero-icon-chip p-2 border border-white/10 rounded bg-black/50 backdrop-blur hover:border-cyan-500/50 transition-colors">
                  <Server className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="hero-icon-chip p-2 border border-white/10 rounded bg-black/50 backdrop-blur hover:border-cyan-500/50 transition-colors">
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Build custom software staggered cards */}
      <section className="build-section relative z-10 mb-24 -mt-48">
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-32">
          {buildSlides.map((slide, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <article
                key={slide.title}
                className={`build-slide relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  isEven ? 'lg:ml-0' : 'lg:ml-20'
                }`}
              >
                {/* Card with glassmorphic effect */}
                <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="group relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] build-image border border-white/10 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl">
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      width={1600}
                      height={900}
                      className="object-cover w-full h-[400px] grayscale transition duration-700 ease-out transform group-hover:grayscale-0 group-hover:scale-105 opacity-80"
                      sizes="(min-width: 1024px) 50vw, 90vw"
                      priority={idx === 0}
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
                    {slide.copy}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Tech marquee */}
      <section className="relative z-10 border-y bg-white">
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

      {/* Process */}
      <section id="process" ref={processRef} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-4">
            <h3 className="text-4xl font-light text-white tracking-tight">The Methodology, Built Around You</h3>
            <span className="text-cyan-500 font-mono text-xs">01 // PROCESS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -translate-y-1/2 z-0" />
            {processSteps.map((step, idx) => (
              <div key={step.title} className="tilt-card group relative z-10 p-1">
                <div className={`h-full p-8 rounded-xl relative overflow-hidden ${step.highlight ? 'glass-panel border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'glass-panel border border-white/10'}`}>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
                  <div className={`mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full border ${step.highlight ? 'border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/10 text-cyan-400'} bg-black/50 group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="work" ref={workRef} className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-4">
            <h3 className="text-4xl font-light text-white tracking-tight">Selected Works</h3>
            <span className="text-cyan-500 font-mono text-xs">PORTFOLIO</span>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {portfolio.map((item) => (
              <div key={item.title} className="group break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors z-20 border-2 border-transparent group-hover:border-cyan-400/50 rounded-xl" />
                  <div className="relative w-full">
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
                        onLoadedData={() => handleVideoLoaded(item.title)}
                      />
                    )}
                  </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-30">
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

      {/* Contact */}
      <section id="contact" ref={contactRef} className="py-24 relative z-10">
        <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400">20+ Client Reviews</span>
              </div>
              <div className="flex flex-wrap gap-3 text-[0.65rem] tracking-[0.2em] uppercase text-slate-400">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Trusted by Startups</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>On-Time Delivery</span>
                </div>
              </div>
            </div>
            <h3 className="text-6xl md:text-7xl font-semibold text-white tracking-tight mb-6 leading-none">
              LET&apos;S BUILD
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-600 animate-pulse">REVENUE</span>
            </h3>
            <p className="text-slate-400 mb-10 max-w-md font-light text-lg">
              Available for websites, product launches, and ongoing retainers. Clear pricing, weekly check-ins, and zero jargon—so you always know what&apos;s done and what&apos;s next.
            </p>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@example.com" className="group flex items-center gap-4 text-xl text-white hover:text-cyan-400 transition-colors">
                <div className="p-3 border border-white/10 rounded-full group-hover:border-cyan-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-light tracking-wide">hello@example.com</span>
              </a>
              <div className="group flex items-center gap-4 text-xl text-white">
                <div className="p-3 border border-white/10 rounded-full group-hover:border-cyan-400 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-light tracking-wide">Based in NYC — available remotely</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative perspective-normal">
            <div className="glass-panel p-8 md:p-10 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <h4 className="text-2xl font-light text-white mb-6 tracking-tight">Booking Inquiry</h4>
              <form className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="uppercase tracking-[0.25em]">Avg. rating from recent builds</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-emerald-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Most projects launch in 4–8 weeks</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-slate-500">Name</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-slate-500">Email</label>
                  <input type="email" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" placeholder="john@company.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-slate-500">Project Details</label>
                  <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" placeholder="Tell me about your vision..." />
                </div>
                <button type="button" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded font-medium tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  Initiate Sequence
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black pt-16 pb-8 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h5 className="tracking-widest text-2xl text-white mb-2">JULIUS WILLACKER</h5>
            <p className="text-slate-600 text-xs tracking-widest uppercase">© 2024. All Rights Reserved.</p>
          </div>
          <div className="flex gap-6">
            {[<LayoutTemplate key="gh" />, <Box key="li" />, <Cpu key="tw" />].map((Icon, idx) => (
              <a key={idx} className="group relative p-2 text-slate-400 hover:text-white transition-colors">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                {Icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

