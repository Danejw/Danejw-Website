import { SocialIcons } from '@/app/components/SocialIcons'

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-0 relative z-20 overflow-hidden mt-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
        <SocialIcons />
      </div>
      <h4 className="tracking-[0.2em] text-[10vw] md:text-[8vw] font-semibold text-gray-400/20 select-none text-center leading-none mb-0 pb-0">
        DANEJW
      </h4>
    </footer>
  )
}
