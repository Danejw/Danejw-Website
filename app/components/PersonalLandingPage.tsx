// New landing page component matching the provided monochrome + teal reference.
'use client'

import Image from 'next/image';
import React from 'react';

const techBadges = [
  'Python',
  'C#',
  'TypeScript',
  'Next.js',
  'Vite',
  'FastAPI',
  'Supabase',
  'ChatGPT',
  'Anthropic',
  'Gemini',
  'Cursor',
  'Unity',
  'Vercel',
  'Render',
];

const techLogos = [
  { label: 'Python', glyph: '🐍' },
  { label: 'C#', glyph: '♯' },
  { label: 'TypeScript', glyph: 'TS' },
  { label: 'Next.js', glyph: 'N' },
  { label: 'Vite', glyph: '⚡' },
  { label: 'FastAPI', glyph: 'A' },
  { label: 'Supabase', glyph: 'S' },
  { label: 'ChatGPT', glyph: 'G' },
  { label: 'Anthropic', glyph: 'A⋂' },
  { label: 'Gemini', glyph: '双' },
  { label: 'Cursor', glyph: '▸' },
  { label: 'Unity', glyph: '⬡' },
  { label: 'Vercel', glyph: '▲' },
  { label: 'Render', glyph: 'R' },
];

const PersonalLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#06080b] text-gray-100 overflow-hidden">
      <div className="relative isolate overflow-hidden">
        {/* HERO */}
        <div className="relative -rotate-3 origin-top overflow-hidden]">
          <div className="rotate-3">
            <div className="relative h-[70vh] min-h-[520px]">
              <Image
                src="/photos/hero_background.jpg"
                alt="Circuit mountain landscape"
                fill
                priority
                className="absolute inset-0 h-full w-full object-cover object-center opacity-95 pointer-events-none select-none"
                sizes="100vw"
              />
              <div className="relative z-10 h-full w-full px-6 sm:px-10 lg:px-16 flex items-center">
                <div className="relative w-full max-w-5xl mx-auto">
                  <div className="absolute -top-20 left-2 sm:left-6 w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden border-4 border-[#06080b] shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
                    <Image
                      src="/photos/headshot.jpg"
                      alt="Portrait of Julius Willacker"
                      fill
                      className="object-cover grayscale"
                      sizes="200px"
                      priority
                    />
                  </div>

                  <div className="pt-24 sm:pt-28 lg:pt-16 space-y-4">
                    <div className="flex flex-col gap-2 max-w-3xl">
                      <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-200">
                        JULIUS
                      </p>
                      <div className="inline-block bg-[#07b2c4] text-[#041014] px-3 sm:px-4 py-2 text-5xl sm:text-6xl lg:text-7xl font-black tracking-[0.06em] uppercase shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
                        WILLACKER
                      </div>
                    </div>
                    <div className="max-w-3xl bg-black/60 border border-teal-800/80 backdrop-blur-sm px-4 sm:px-5 py-3 text-sm sm:text-base leading-relaxed text-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.35)] border-l-12 border-[#07b2c4] pl-5">
                      Full-stack partner for founders, small business owners, and teams who need modern, fast automated
                      solutions that save valuable time, easy to manage, and actually provide value to your customers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUB HERO / CTA */}
        <div className="relative bg-[#050708] border-t border-gray-900/70 pb-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:18px_18px] opacity-35" />
          <div className="relative max-w-6xl mx-auto px-6 lg:px-10 pt-10 lg:pt-12 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] rounded-sm overflow-hidden border border-gray-800/70 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
                <Image
                  src="/photos/blurred_look.jpeg"
                  alt="Subway portrait"
                  fill
                  className="object-cover"
                  sizes="700px"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-1 bg-[#07b2c4]" />
                <div>
                  <div className="text-3xl sm:text-4xl font-light leading-tight text-gray-100">Build Custom</div>
                  <div className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-gray-100">
                    <span className="bg-[#07b2c4] text-[#041014] px-1.5">Software.</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-base">
                Full-stack partner for founders, small business owners, and teams who need modern, fast automated
                solutions that save valuable time, easy to manage, and actually provide value to your customers.
              </p>
              <div className="h-px w-14 bg-[#07b2c4]" />
            </div>
          </div>
        </div>

        {/* TECH STRIP */}
        <div className="relative border-t border-b border-gray-900/80 bg-white text-black">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {techLogos.map((tech) => (
              <div key={tech.label} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                  {tech.glyph}
                </div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-black/80">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalLandingPage;

