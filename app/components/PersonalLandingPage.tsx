'use client'

import React, { useState } from 'react';
import {
  Github,
  Linkedin,
  Twitter, // Represents X
  Youtube,
  ExternalLink,
  Code, // Represents Web/Software Engineering & Tools
  Cpu, // Using Cpu for AI Integration, replacing Brain
  Package, // Using Package for Game/Tool Development, replacing Wrench
  Gamepad2, // Using Gamepad2 for Itch.io
  Box, // Using Box for XR/Unity, replacing Cuboid
} from 'lucide-react'; // Assuming lucide-react is installed
import clsx from 'clsx'; // Import clsx for conditional classes
import { GlowingEffect } from '@/app/components/ui/glowing-effect';
import { SplashCursor } from '@/app/components/ui/splash-cursor';
import { motion } from 'framer-motion'; // Import motion


// Helper component for icon links
const IconLink = ({ href, Icon, label }: { href: string; Icon: React.ElementType; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 text-accent/50 hover:text-accent transition-colors duration-150 group"
    aria-label={label}
    title={label}
  >
    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    <span className="hidden sm:inline">{label}</span>
  </a>
);

// Helper component for project cards - Updated with hover scale
const ProjectCard = ({ title, description, link, tags }: { title: string; description: string; link?: string; tags?: string[] }) => (
  <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-accent/20 hover:scale-[1.02] transition-all duration-150 h-full">
    <div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground flex items-center gap-2">
          {title}
          {link && (
             <a href={link} target="_blank" rel="noopener noreferrer" title={`Visit ${title}`} className="text-primary hover:text-primary/80 transition-colors">
                 <ExternalLink className="w-4 h-4 text-accent/50 hover:text-accent transition-colors" />
             </a>
          )}
      </h3>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed whitespace-pre-line">{description}</p>
    </div>
    {tags && tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/50">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

// Define skill identifiers (used for linking)
const SKILL_IDS = {
  XR: 'xr',
  AI: 'ai',
  GAME_TOOL: 'game_tool',
  WEB: 'web',
} as const;

// --- Mappings to link skills, technologies, and projects ---
// (These determine what gets highlighted/dimmed on hover)

const skillTechnologyMapping: Record<typeof SKILL_IDS[keyof typeof SKILL_IDS], string[]> = {
  [SKILL_IDS.XR]: ['C#', 'Unity', 'Oculus SDK', 'OpenXR', 'VR', 'XR', 'Git', 'GitHub', 'Visual Studio', 'Game Jam'],
  [SKILL_IDS.AI]: ['Python', 'OpenAI API', 'Unity ML-Agents', 'AI', 'GPT', 'Voice AI', 'FastAPI', 'Conversational AI', 'Voice Agent'],
  [SKILL_IDS.GAME_TOOL]: ['C#', 'Unity', 'Git', 'GitHub', 'Game Jam', 'Tool', 'SDK', 'Open Source', 'Open AI', 'OpenXR', 'Visual Studio', 'Android', 'Game Development', 'VFX', 'Developer Productivity'],
  [SKILL_IDS.WEB]: ['JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Node.js', '.Net', 'FastAPI', 'Vite.js', 'HTML', 'CSS', 'Git', 'GitHub', 'Web App', 'Platform', 'Cursor'],
};

// Function to get skills related to a technology item
const getSkillsForTechnology = (item: string): string[] => {
  return Object.entries(skillTechnologyMapping)
    .filter(([, techItems]) => techItems.some(tech => item.toLowerCase().includes(tech.toLowerCase()) || tech.toLowerCase().includes(item.toLowerCase())))
    .map(([skillId]) => skillId);
};

// CORRECTED Function to get skills related to a project
const getSkillsForProject = (projectTags: string[] = []): string[] => {
  const relatedSkills = new Set<string>();
  const lowerCaseTags = projectTags.map(tag => tag.toLowerCase());

  // Identify if the project has explicit game development context
  const hasGameContext = lowerCaseTags.some(tag => ['unity', 'game jam', 'game development', 'vr', 'xr', 'vfx', 'multiplayer'].includes(tag));

  // Iterate through tags and map to skills
  lowerCaseTags.forEach(tag => {
    Object.entries(skillTechnologyMapping).forEach(([skillId, techItems]) => {
      // Check if the current tag matches any keyword for the current skill
      if (techItems.some(tech => tag.includes(tech.toLowerCase()) || tech.toLowerCase().includes(tag))) {

        // *** Special handling for GAME_TOOL ***
        if (skillId === SKILL_IDS.GAME_TOOL) {
          // Only add GAME_TOOL if:
          // 1. The project has explicit game context OR
          // 2. The specific tag itself implies game context (e.g., 'unity', 'game jam')
          const isGameSpecificTag = ['unity', 'game jam', 'game development', 'vfx', 'multiplayer', 'open source'].includes(tag); // Define game-specific tags from the mapping

          if (hasGameContext || isGameSpecificTag) {
             // Check if the tag is 'tool' or 'sdk' and requires game context which might be missing
             if ((tag === 'tool' || tag === 'sdk') && !hasGameContext && !isGameSpecificTag) {
                 // Don't add GAME_TOOL if it's just 'tool'/'sdk' without other game context
             } else {
                 relatedSkills.add(SKILL_IDS.GAME_TOOL);
             }
          }
        } else {
          // For other skills (AI, XR, WEB), add directly if a match is found
          relatedSkills.add(skillId);
        }
      }
    });
  });

  // Direct skill checks based on specific tags (can sometimes override or add)
  if (lowerCaseTags.includes('vr') || lowerCaseTags.includes('xr') || lowerCaseTags.includes('multiplayer')) relatedSkills.add(SKILL_IDS.XR);
  if (lowerCaseTags.includes('ai') || lowerCaseTags.includes('conversational ai') || lowerCaseTags.includes('voice agent')) relatedSkills.add(SKILL_IDS.AI);
  // NO direct add for GAME_TOOL based on 'tool'/'sdk' here
  if (lowerCaseTags.includes('web app') || lowerCaseTags.includes('platform')) relatedSkills.add(SKILL_IDS.WEB);

  // Ensure 'Assistance For Unity' always gets GAME_TOOL because it uses 'Unity' tag
  if (lowerCaseTags.includes('unity')) {
    relatedSkills.add(SKILL_IDS.GAME_TOOL);
  }


  return Array.from(relatedSkills);
};


// Main Component
const PersonalLandingPage: React.FC = () => {
  // State to track hovered skill ID
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Skills Data - Add skillId to each skill
  const skills = [
    { skillId: SKILL_IDS.XR, icon: Box, name: 'Extended Reality (XR) Development', desc: 'Expert in Unity 3D real-time engine and C# programming for VR applications. Experienced with platforms (Oculus Quest, Rift), 3D environment design, interaction mechanics, multiplayer/social VR, emphasizing user immersion and comfort.' },
    { skillId: SKILL_IDS.AI, icon: Cpu, name: 'Artificial Intelligence Integration', desc: 'Proven ability to ship real-time AI systems in XR, voice, and companion apps. Integrates ML agents (Unity ML-Agents), conversational AI (OpenAI GPT), voice recognition (Whisper), and develops AI companions & generative content tools.' },
    { skillId: SKILL_IDS.GAME_TOOL, icon: Package, name: 'Game & Tool Development', desc: 'Skilled in rapid prototyping & game jams (entertainment & serious apps). Develops custom Unity tools/plugins/editor extensions. Contributor to open-source projects like Open Brush (Google Tilt Brush fork).' },
    { skillId: SKILL_IDS.WEB, icon: Code, name: 'Web & Software Engineering', desc: 'Full-stack deployment of web applications and services (e.g., SongTailor web app, community sites). Proficient in Git/GitHub (44+ repositories) and collaborative development.' },
  ];

  // Technologies Data (keep structure, add items from previous step)
  const technologies = [
    { category: 'Languages', items: ['C#', 'JavaScript', 'TypeScript', 'Python'] },
    { category: 'Frameworks', items: ['React', 'Next.js', 'Node.js', '.Net', 'FastAPI', 'Vite.js', 'HTML', 'CSS'] },
    { category: 'SDKs & APIs', items: ['Oculus SDK', 'OpenXR', 'OpenAI API', 'Android', 'Web'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'Unity', 'Visual Studio', 'Cursor', 'Adobe Creative Suite', 'Ableton Live'] },
  ];

  // Projects Data (keep structure, add items from previous step)
  const projects = [
      {
          title: "Your Indie Dev",
          description: "Founder of a platform empowering indie game developers with tools & insights to make game development easier and more enjoyable. Offers productivity tools developed in-house.",
          link: "https://yourindie.dev",
          tags: ["Founder", "Game Development", "Tools"]
      },
      {
          title: "Knolia",
          description: "Creator of an AI-driven companion application (Knolia.org) designed to combat loneliness. A personal AI that learns over time, available 24/7 to listen without judgment. Focuses on social good through empathetic conversational AI.",
          link: "https://knolia.org/welcome",
          tags: ["Founder", "AI", "Social Good", "Web App", "Conversational AI", "Voice Agent"]
      },
      {
        title: "AI Companion Toolkit",
        description: "A ready-made toolkit for indie creators to build AI companions with integrated speech (voice) and GPT-based dialogue. Engineered for easy deployment, democratizing AI development.",
        link: "https://aicompaniontoolkit.com",
        tags: ["Creator", "AI", "Tool", "Web App", "Voice Agent"]
      },
      {
        title: "Improv Forms",
        description: "Create dynamic, AI-powered conversational forms just by describing what you need, and the form builds itself. Share your link or QR code to collect responses in a natural, chat-like flow.",
        link: "https://ImprovForms.com",
        tags: ["Creator", "AI", "Tool", "Web App", "Data Entry", "Data Analysis"]
      },
      {
        title: "Assistance For Unity",
        description: "AI chat assistant for the Unity Editor. Provides in-editor help via natural language queries to streamline coding and design tasks, merging AI with developer workflows.",
        link: "https://assetstore.unity.com/packages/tools/ai-ml-integration/assistance-293407",
        tags: ["Creator", "AI", "Tool", "Unity", "Game Development", "Developer Productivity"]
      },
      {
          title: "SongTailor",
          description: "Co-developer of an AI-powered music application that creates personalized songs from user stories and input. Launched on Product Hunt (Jan 2025). Integrates generative AI into creative media.",
          link: "https://songtailor.app",
          tags: ["Creator", "AI", "Music", "Generative Media", "Web App", "Product Hunt"]
      },
  ];

  // Fun VR Projects Data (keep structure, add items from previous step)
    const funVrProjects = [
      {
          title: "The Phantom Delivery (VR)",
          description: "Folklore-inspired VR adventure game (VR Jam 2023). Players navigate a boat in the Sundarban Mangrove Forest, guided by phantom lights. Handled visual effects (mythical Aleya ghost light) and core gameplay mechanics.",
          link: "https://dangerdano.itch.io/the-phantom-delivery",
          tags: ["VR", "Game Jam", "Storytelling", "Unity", "VFX"]
      },
      {
          title: "Fireside (VR)",
          description: "Social VR experience for mental health discussions around a virtual campfire (DeepWell DTx Global Game Jam 2022). Enables anonymous sharing in a safe metaverse space. Co-developed with Eunoia Collab, implementing multi-user features and guided meditation.",
          link: "https://dangerdano.itch.io/fireside",
          tags: ["VR", "Social VR", "Mental Health", "Game Jam", "Multiplayer", "Collaboration"]
      },
      {
          title: "Swapno (VR)",
          description: "Experimental VR adventure playing as an imaginary friend inside a child\'s dream (Swapno means \'dream\'). Explores imaginative storytelling and world-building in VR.",
          link: "https://dangerdano.itch.io/swapno",
          tags: ["VR", "Experimental", "Storytelling", "World-Building", "Unity"]
      },
      {
          title: "Open Brush Contributions",
          description: "Contributed to the open-source VR art tool Open Brush (community-driven fork of Google Tilt Brush). Shares code/examples on GitHub for VR learning (Quest templates, ML pet simulations).",
        link: "https://github.com/icosa-foundation/open-brush",
          tags: ["VR", "Open Source", "Art Tool", "Community", "Contribution", "Unity"]
      },
      {
        title: "Sunlink (Spatial.io)",
        description: "VR environment on Spatial.io focused on climate change awareness. Showcases microorganisms converting organic waste into electricity within integrated greenhouses.",
        link: "https://www.spatial.io/s/SUNLINK-644190f97394541eca36d3a7",
        tags: ["VR", "Spatial.io", "Environment", "Climate Change", "Sustainability", "Educational", "XR"]
      },
  ];

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen text-foreground font-sans">

      <SplashCursor />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* Header / Hero - Keep as is */}
        <header className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
            Dane Willacker
          </h1>
           <p className="text-lg text-muted-foreground mb-3">aka Danejw</p>
          <p className="text-xl sm:text-2xl text-primary mb-6 font-medium">
            AI + XR Developer
          </p>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Based in Hawaii, Dane Willacker is an independent{' '}
            <span className="text-foreground font-medium">AI + XR Developer</span> harnessing artificial
            intelligence and virtual/augmented reality to create{' '}
            <span className="text-foreground font-medium">innovative immersive experiences and development tools</span>.
            With a background in XR development, a passion for human-computer interaction, and over a decade of software
            development experience, his work spans{' '}
            <span className="text-foreground font-medium">XR games, AI-driven applications, and open-source tools</span> aimed at{' '}
            <span className="text-foreground font-medium">empowering the indie developer community</span> and{' '}
            <span className="text-foreground font-medium">pushing creative boundaries</span>.
          </p>
           {/* Updated Social Links */}
           <div className="mt-8 flex justify-center flex-wrap gap-x-6 gap-y-4">
              <IconLink href="https://www.linkedin.com/in/danejw" Icon={Linkedin} label="LinkedIn" />
              <IconLink href="https://github.com/Danejw" Icon={Github} label="GitHub" />
              <IconLink href="https://twitter.com/Djw_learn" Icon={Twitter} label="X" />
              <IconLink href="https://www.youtube.com/channel/UCYnBPlKf3iqmaLcBC8maYYw" Icon={Youtube} label="YouTube" />
              <IconLink href="https://dangerdano.itch.io/" Icon={Gamepad2} label="itch.io" />
          </div>
        </header>

        {/* Skills Section - Animate in/out based on visibility */}
        <motion.section
          id="skills"
          className="mb-16 sm:mb-20 scroll-mt-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.4 }} // Animate when 40% is visible, allow reverse animation
        >
          <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Skills & Technical Proficiencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="relative list-none rounded-lg"
                onMouseEnter={() => setHoveredSkill(skill.skillId)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                  className="rounded-lg"
                />
                <div
                  className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-[1.02] h-full"
                >
                  <skill.icon className="w-8 h-8 text-accent mt-1 flex-shrink-0 transition-transform duration-200 ease-in-out group-hover:scale-110" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-card-foreground">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{skill.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Technologies & Tools Section - Animate in/out based on visibility */}
        <motion.section
          id="technologies"
          className="mb-16 sm:mb-20 scroll-mt-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Technologies & Tools</h2>
          <div className="max-w-4xl mx-auto text-center">
            {technologies.map((techCategory) => (
              <div key={techCategory.category} className="mb-4 sm:mb-2">
                <span className="font-semibold text-primary mr-2">{techCategory.category}:</span>
                <div className="inline-flex flex-wrap gap-1.5 justify-center">
                  {techCategory.items.map((item) => {
                    const relatedSkills = getSkillsForTechnology(item);
                    const isDimmed = hoveredSkill !== null && !relatedSkills.includes(hoveredSkill);
                    const isHighlighted = hoveredSkill !== null && relatedSkills.includes(hoveredSkill); // Optional: Add highlight style

                    return (
                      <span
                        key={item}
                        className={clsx(
                          "text-xs bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all duration-200 ease-in-out", // Base classes + transition
                          isDimmed ? 'opacity-30 scale-95' : 'opacity-100 scale-100', // Dimming effect
                          isHighlighted ? 'ring-2 ring-accent ring-offset-1 ring-offset-background' : '', // Highlight effect (optional)
                          "hover:bg-accent hover:text-accent-foreground cursor-default" // Keep existing hover on tag itself
                        )}
                      >
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Project Sections - Animate in/out based on visibility */}
        <motion.section
          id="projects"
          className="mb-16 sm:mb-20 scroll-mt-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }} // Use smaller amount for grids to trigger sooner
        >
          <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => {
              const relatedSkills = getSkillsForProject(project.tags);
              const isDimmed = hoveredSkill !== null && !relatedSkills.includes(hoveredSkill);
              const isHighlighted = hoveredSkill !== null && relatedSkills.includes(hoveredSkill); // Optional: Add highlight style

              return (
                <div
                  key={project.title + '-major'}
                  className={clsx(
                      "relative list-none transition-all duration-200 ease-in-out rounded-lg",
                      isDimmed ? 'opacity-30 scale-95' : 'opacity-100 scale-100',
                      isHighlighted ? 'ring-2 ring-accent ring-offset-2 ring-offset-background rounded-lg' : ''
                  )}
                 >
                   <GlowingEffect
                     spread={40}
                     glow={true}
                     disabled={false}
                     proximity={64}
                     inactiveZone={0.01}
                     borderWidth={3}
                     className="rounded-lg"
                   />
                   <ProjectCard {...project} />
                 </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          id="vr-projects"
          className="mb-16 sm:mb-20 scroll-mt-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }} // Use smaller amount for grids
        >
          <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Fun VR Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {funVrProjects.map((project) => {
               const relatedSkills = getSkillsForProject(project.tags);
               const isDimmed = hoveredSkill !== null && !relatedSkills.includes(hoveredSkill);
               const isHighlighted = hoveredSkill !== null && relatedSkills.includes(hoveredSkill); // Optional: Add highlight style

              return (
                 <div
                   key={project.title + '-vr'}
                   className={clsx(
                       "relative list-none transition-all duration-200 ease-in-out rounded-lg",
                       isDimmed ? 'opacity-30 scale-95' : 'opacity-100 scale-100',
                        isHighlighted ? 'ring-2 ring-accent ring-offset-2 ring-offset-background rounded-lg' : ''
                   )}
                  >
                     <GlowingEffect
                       spread={40}
                       glow={true}
                       disabled={false}
                       proximity={64}
                       inactiveZone={0.01}
                       borderWidth={3}
                       className="rounded-lg"
                     />
                   <ProjectCard {...project} />
                  </div>
              );
            })}
          </div>
        </motion.section>

        {/* Experience Section - Animate in/out based on visibility */}
        <motion.section
          id="experience"
          className="mb-16 sm:mb-20 scroll-mt-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.4 }}
        >
           <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Experience</h2>
           <div className="max-w-4xl mx-auto space-y-8">

              {/* XR Developer */}
             <div className="relative list-none rounded-lg">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                  className="rounded-lg"
                />
                <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8 transition-all duration-150 hover:shadow-md hover:border-accent/20 hover:scale-[1.02] cursor-pointer">
                   <div className="flex items-start gap-4">
                     {/* <Briefcase className="w-8 h-8 text-primary mt-1 flex-shrink-0"/> */}
                     <div>
                        <h3 className="text-xl font-semibold text-card-foreground">XR Developer</h3>
                        <p className="text-sm text-muted-foreground mb-2">Remote</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">Leads the design and development of VR applications and games. Delivers multiple prototypes and immersive experiences, integrating advanced AI where applicable. Involves full-stack game development (Unity/C#), VR hardware optimization, and project oversight from concept to release.</p>
                     </div>
                   </div>
                </div>
             </div>

              {/* Universe VR */}
              <div className="relative list-none rounded-lg">
                 <GlowingEffect
                   spread={40}
                   glow={true}
                   disabled={false}
                   proximity={64}
                   inactiveZone={0.01}
                   borderWidth={3}
                   className="rounded-lg"
                 />
                 <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8 transition-all duration-150 hover:shadow-md hover:border-accent/20 hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-start gap-4">
                      {/* <Briefcase className="w-8 h-8 text-primary mt-1 flex-shrink-0 text-accent"/> */}
                      <div>
                         <h3 className="text-xl font-semibold text-card-foreground mb-1">
                           <a href="https://www.linkedin.com/company/joinuniversevr/" target="_blank" rel="noopener noreferrer" className="hover:text-primary/80 transition-colors inline-flex items-center gap-1.5">
                             Lead Developer – Universe VR
                          <ExternalLink className="w-4 h-4 text-accent/50 hover:text-accent transition-colors" />      
                           </a>
                          <p className="text-sm text-muted-foreground mb-2">Remote</p>
                         </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Headed the development of internal tools and simulation systems for Universe VR, an organization dedicated to advancing VR game development education. Focused on building scalable solutions to support K–12 learning initiatives across Newark, NJ and Mexico, enabling accessible, high-quality VR experiences in educational environments.</p>
                      </div>
                    </div>
                 </div>
              </div>

             {/* Independent Developer */}
             <div className="relative list-none rounded-lg">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                  className="rounded-lg"
                />
                <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8 transition-all duration-150 hover:shadow-md hover:border-accent/20 hover:scale-[1.02] cursor-pointer">
                   <div className="flex items-start gap-4">
                      {/* <Users className="w-8 h-8 text-primary mt-1 flex-shrink-0 text-accent"/> */}
                       <div>
                          <h3 className="text-xl font-semibold text-card-foreground">Independent Developer & Collaborator</h3>
                          <p className="text-sm text-muted-foreground mb-2">Remote / Various Teams</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">Frequently collaborates on external projects and game jam teams (e.g., Eunoia Collab, EmpressVR, Bad Golf Hawaii, Sockoe, VR jam entries). Self-driven learning background and contributor to open communities. Adept at teamwork in remote, cross-functional groups and mentoring others in XR development.</p>
                       </div>
                   </div>
                 </div>
             </div>
           </div>
        </motion.section>

      </div>
    </div>
  );
};


export default PersonalLandingPage; 