'use client'

import React from 'react';
import Link from 'next/link';
import {
  Github,
  Linkedin,
  Twitter, // Represents X
  Youtube,
  Globe, // For websites
  ExternalLink,
  Code, // Represents Web/Software Engineering & Tools
  Cpu, // New: Using Cpu for AI Integration, replacing Brain
  Package, // New: Using Package for Game/Tool Development, replacing Wrench
  Palette, // New: Using Palette for Open Brush/Art Tool
  Users, // For Community / Independent Collaborator
  Briefcase, // For Experience
  Gamepad2, // New: Using Gamepad2 for Itch.io
  Music, // For SongTailor
  Heart, // For Knolia
  Box, // New: Using Box for XR/Unity, replacing Cuboid
} from 'lucide-react'; // Assuming lucide-react is installed

// Helper component for icon links
const IconLink = ({ href, Icon, label }: { href: string; Icon: React.ElementType; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 text-accent/50 hover:text-accent transition-colors duration-150 group"
  >
    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    <span className="hidden sm:inline">{label}</span>
  </a>
);

// Helper component for project cards - Updated to handle richer descriptions potentially
const ProjectCard = ({ title, description, link, tags }: { title: string; description: string; link?: string; tags?: string[] }) => (
  <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-150">
    <div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground flex items-center gap-2">
          {title}
          {link && (
             <a href={link} target="_blank" rel="noopener noreferrer" title={`Visit ${title}`} className="text-accent/50 hover:text-accent transition-colors">
                 <ExternalLink className="w-4 h-4" />
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
            className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded hover:bg-accent hover:text-primary-foreground transition-colors duration-150 cursor-default"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

// Main Component
const PersonalLandingPage: React.FC = () => {
  // Updated Skills Data
  const skills = [
    { icon: Box, name: 'Extended Reality (XR) Development', desc: 'Expert in Unity 3D real-time engine and C# programming for VR applications. Experienced with platforms (Oculus Quest, Rift), 3D environment design, interaction mechanics, multiplayer/social VR, emphasizing user immersion and comfort.' },
    { icon: Cpu, name: 'Artificial Intelligence Integration', desc: 'Proven ability to ship real-time AI systems in XR, voice, and companion apps. Integrates ML agents (Unity ML-Agents), conversational AI (OpenAI GPT), voice recognition (Whisper), and develops AI companions & generative content tools.' },
    { icon: Package, name: 'Game & Tool Development', desc: 'Skilled in rapid prototyping & game jams (entertainment & serious apps). Develops custom Unity tools/plugins/editor extensions. Contributor to open-source projects like Open Brush (Google Tilt Brush fork).' },
    { icon: Code, name: 'Web & Software Engineering', desc: 'Full-stack deployment of web applications and services (e.g., SongTailor web app, community sites). Proficient in Git/GitHub (44+ repositories) and collaborative development.' },
  ];

  // Updated Projects Data - Non-VR projects remain here
  const projects = [
      {
          title: "Your Indie Dev",
          description: "Founder of a platform empowering indie game developers with tools & insights to make game development easier and more enjoyable. Offers productivity tools developed in-house.",
          link: "https://yourindie.dev",
          tags: ["Platform", "Community", "Tools", "Founder"]
      },
      {
          title: "Knolia",
          description: "Creator of an AI-driven companion application (Knolia.org) designed to combat loneliness. A personal AI that learns over time, available 24/7 to listen without judgment. Focuses on social good through empathetic conversational AI.",
          link: "https://knolia.org",
          tags: ["AI", "Social Good", "Application", "Conversational AI", "Creator"]
      },
      {
        title: "AI Companion Toolkit",
        description: "A ready-made toolkit for indie creators to build AI companions with integrated speech (voice) and GPT-based dialogue. Engineered for easy deployment, democratizing AI development.",
        link: "https://aicompaniontoolkit.com",
        tags: ["AI", "Tool", "SDK", "GPT", "Voice AI", "Indie Creator"]
      },
      {
        title: "Assistance For Unity",
        description: "AI chat assistant for the Unity Editor. Provides in-editor help via natural language queries to streamline coding and design tasks, merging AI with developer workflows.",
        link: "https://assetstore.unity.com/packages/tools/ai-ml-integration/assistance-293407",
        tags: ["AI", "Tool", "Unity", "Game Development", "Developer Productivity"]
      },
      {
          title: "SongTailor",
          description: "Developer of an AI-powered music application that creates personalized songs from user stories and input. Launched on Product Hunt (Jan 2025). Integrates generative AI into creative media.",
          link: "https://songtailor.app",
          tags: ["AI", "Music", "Generative Media", "Web App", "Product Hunt"]
      },
      // VR projects moved to their own array below
  ];

  // New Array for Fun VR Projects
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
        tags: ["VR", "Experimental", "Storytelling", "World-Building"]
    },
    {
        title: "Open Brush Contributions",
        description: "Contributed to the open-source VR art tool Open Brush (community-driven fork of Google Tilt Brush). Shares code/examples on GitHub for VR learning (Quest templates, ML pet simulations).",
        link: "https://github.com/icosa-foundation/open-brush",
        tags: ["VR", "Open Source", "Art Tool", "Community", "Contribution"]
    },
    {
      title: "Sunlink (Spatial.io)",
      description: "VR environment on Spatial.io focused on climate change awareness. Showcases microorganisms converting organic waste into electricity within integrated greenhouses.",
      link: "https://www.spatial.io/s/SUNLINK-644190f97394541eca36d3a7", // Using the link from the search result
      tags: ["VR", "Spatial.io", "Environment", "Climate Change", "Sustainability", "Educational"]
    },
  ];

  // Technologies Data (same structure is fine)
  const technologies = [
    { category: 'Languages', items: ['C#', 'Python', 'TypeScript'] },
    { category: 'Frameworks', items: ['.Net', 'React', 'Next.js', 'Node.js', '.Net', 'FastAPI', 'Vite.js', 'HTML', 'CSS', 'SQL', 'NoSQL', 'PostgreSQL', 'SQLite'] },
    { category: 'SDKs & APIs', items: ['Oculus SDK', 'OpenXR', 'OpenAI', 'Android', 'Web'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'Unity', 'Blender', 'Visual Studio', 'Cursor', 'Supabase', 'Adobe Creative Suite', 'Ableton Live'] },
    // Add more categories/items as needed
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="container mx-auto">

        {/* Header / Hero */}
        <header className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
            Dane Willacker
          </h1>
           <p className="text-lg text-muted-foreground mb-3">(Danejw)</p>
          <p className="text-xl sm:text-2xl text-primary mb-6 font-medium">
            AI + XR Developer
          </p>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Based in Hawaii, Dane Willacker is an independent{' '}
            <span className="text-foreground font-medium">XR + AI Developer</span> harnessing artificial
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

        {/* Skills Section - Updated */}
        <section id="skills" className="mb-16 sm:mb-20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Skills & Technical Proficiencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill) => (
              <div key={skill.name} className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg shadow-sm transition-shadow hover:shadow-md">
                <skill.icon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-card-foreground">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{skill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies & Tools Section */}
        <section id="technologies" className="mb-16 sm:mb-20 scroll-mt-20">
          <div className="max-w-4xl mx-auto text-center">
            {technologies.map((techCategory) => (
              <div key={techCategory.category} className="mb-4 sm:mb-2">
                <span className="font-semibold text-primary mr-2">{techCategory.category}:</span>
                <div className="inline-flex flex-wrap gap-1.5 justify-center">
                  {techCategory.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full whitespace-nowrap hover:bg-accent hover:text-primary-foreground transition-colors duration-150 cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Major Projects Section - Updated (now excludes VR) */}
        <section id="projects" className="mb-16 sm:mb-20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Major Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* New Fun VR Projects Section */}
        <section id="vr-projects" className="mb-16 sm:mb-20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Fun VR Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {funVrProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Experience Section - Updated */}
        <section id="experience" className="mb-16 sm:mb-20 scroll-mt-20">
           <h2 className="text-3xl font-bold text-center mb-10 sm:mb-12">Experience</h2>
           <div className="max-w-4xl mx-auto space-y-8">
             {/* Bad Golf Hawaii */}
             <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-8 h-8 text-primary mt-1 flex-shrink-0"/>
                  <div>
                     <h3 className="text-xl font-semibold text-card-foreground">XR Developer</h3>
                     <p className="text-sm text-muted-foreground mb-2">Remote</p>
                     <p className="text-sm text-muted-foreground leading-relaxed">Leads the design and development of VR applications and games. Delivers multiple prototypes and immersive experiences, integrating advanced AI where applicable. Involves full-stack game development (Unity/C#), VR hardware optimization, and project oversight from concept to release.</p>
                  </div>
                </div>
             </div>
             
             {/* Independent Developer */}
             <div className="bg-card border border-border rounded-lg shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md">
               <div className="flex items-start gap-4">
                  <Users className="w-8 h-8 text-primary mt-1 flex-shrink-0"/>
                   <div>
                      <h3 className="text-xl font-semibold text-card-foreground">Independent Developer & Collaborator</h3>
                      <p className="text-sm text-muted-foreground mb-2">Remote / Various Teams</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">Frequently collaborates on external projects and game jam teams (e.g., Eunoia Collab, EmpressVR, Bad Golf Hawaii, Sockoe, VR jam entries). Self-driven learning background and contributor to open communities. Adept at teamwork in remote, cross-functional groups and mentoring others in XR development.</p>
                   </div>
               </div>
             </div>
           </div>
        </section>

         {/* Footer - Updated Links */}
         <footer className="mt-16 border-t border-border pt-8 text-center">
            <p className="text-muted-foreground mb-6">Connect with me:</p>
             <div className="flex justify-center flex-wrap gap-x-6 gap-y-4">
                <IconLink href="https://www.linkedin.com/in/danejw" Icon={Linkedin} label="LinkedIn" />
                <IconLink href="https://github.com/Danejw" Icon={Github} label="GitHub" />
                <IconLink href="https://twitter.com/Djw_learn" Icon={Twitter} label="X" />
                <IconLink href="https://www.youtube.com/channel/UCYnBPlKf3iqmaLcBC8maYYw" Icon={Youtube} label="YouTube" />
                <IconLink href="https://dangerdano.itch.io/" Icon={Gamepad2} label="itch.io" />
                <IconLink href="https://yourindie.dev" Icon={Globe} label="YourIndie.dev" />
                <IconLink href="https://aicompaniontoolkit.com" Icon={Cpu} label="AI Toolkit" />
             </div>
             <p className="mt-8 text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Dane Willacker. All rights reserved.</p>
         </footer>

      </div>
    </div>
  );
};


export default PersonalLandingPage; 