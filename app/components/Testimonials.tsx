import { type FC } from 'react'

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
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">Testimonials</h2>
      <div className="space-y-4">
        {testimonials.map((t) => (
          <blockquote
            key={t.author}
            className="border-l-4 border-accent pl-4 italic"
          >
            <p>{t.text}</p>
            <footer className="mt-2 font-medium not-italic">{t.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
