'use client';

import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

/**
 * Social media icons component - displays social media links
 */
export const SocialIcons: React.FC<{ className?: string; iconSize?: string }> = ({ 
  className = '', 
  iconSize = 'w-5 h-5' 
}) => {
  const socialLinks = [
    { icon: Twitter, url: 'https://x.com/Djw_learn', label: 'X.com (Twitter)' },
    { icon: Linkedin, url: 'https://www.linkedin.com/in/dane-willacker/', label: 'LinkedIn' },
    { icon: Github, url: 'https://github.com/Danejw', label: 'GitHub' },
  ];

  return (
    <div className={`flex gap-6 ${className}`}>
      {socialLinks.map((social, idx) => {
        const Icon = social.icon;
        return (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="group relative p-2 text-slate-400 hover:text-cyan-400 hover:scale-150 transition-colors"
          >
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className={iconSize} />
          </a>
        );
      })}
    </div>
  );
};
