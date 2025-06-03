'use client'

import { type FC, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  author: string
  text: string
}

const testimonials: Testimonial[] = [
  {
    author: 'Dr. Anjali Mehta, Director of Clinical Research, HealBetter Foundation',
    text:
      '“We used your system to automate document formatting for our clinical trial researchers. What used to take 40 hours now takes under 5 minutes. The AI saved us hundreds of hours almost overnight.”',
  },
  {
    author: 'Leo Martinez, Solo SaaS Founder, HelpHive',
    text:
      '“As a solo founder, I didn’t have time to handle customer support. The AI now answers questions, pulls from my docs, and escalates when needed. My response time dropped from hours to seconds.”',
  },
  {
    author: 'Erica Wu, Growth Marketer, Freelance',
    text:
      '“I had the AI monitor my inbox for leads and auto-draft first-touch outreach messages. It\'s like having a full-time BDR working while I sleep. I’m booking more meetings without doing any manual prospecting.”',
  },
  {
    author: 'James Rivera, Creator & Brand Strategist',
    text:
      '“I dumped my old LinkedIn posts into the AI and it spit out a full content calendar. Then it turned them into tweets, newsletters, even YouTube scripts. I’ve never felt more organized as a solo content creator.”',
  },
  {
    author: 'Monica Fields, High School English Teacher',
    text:
      '“I teach writing and needed faster, more personalized feedback. The AI read through student essays and generated specific comments for each one. It nailed my tone and even caught insights I missed.”',
  },
]

export const Testimonials: FC = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const prev = () =>
    setIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    )
  const next = () =>
    setIndex((current) => (current + 1) % testimonials.length)

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Testimonials</h2>
      <div className="relative max-w-xl mx-auto">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-lg p-6 shadow-sm"
            >
              <blockquote className="italic space-y-4 text-center">
                <p>{testimonials[index].text}</p>
                <footer className="font-medium not-italic">
                  {testimonials[index].author}
                </footer>
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background border border-border text-muted-foreground hover:bg-muted/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background border border-border text-muted-foreground hover:bg-muted/50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
              i === index ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
            aria-label={`Show testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Testimonials
