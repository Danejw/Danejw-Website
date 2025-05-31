import { type FC } from 'react'
import Link from 'next/link'
import { Twitter } from 'lucide-react'
import { Linkedin, Github, Youtube, Gamepad2, Globe, Cpu } from 'lucide-react'

const IconLink = ({ href, Icon, label }: { href: string; Icon: React.ElementType; label: string }) => (
    <Link href={href} className="hover:text-accent">
        <Icon className="w-6 h-6" />
        <span className="sr-only">{label}</span>
    </Link>
);


export const Footer: FC = () => {
  return (
    <footer className = "mt-16 border-t border-border pt-8 text-center" >
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
         <div className="flex justify-center flex-wrap gap-x-6 gap-y-4 mt-4 text-accent/50">
            <Link href="/contact" className="hover:text-accent">Contact Us</Link>
            <Link href="/customer-feedback" className="hover:text-accent">Customer Feedback</Link>
            <Link href="/newsletter-signup" className="hover:text-accent">Newsletter Sign Up</Link>
            <Link href="/services" className="hover:text-accent">Services</Link>
            <Link href="/hire-me" className="hover:text-accent">Hire Me</Link>
        </div>
         <p className="mt-8 text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Dane Willacker. All rights reserved.</p>
    </footer >
  )
} 