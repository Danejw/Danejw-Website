'use client'

import { FC, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface Example {
  title: string
  text: string
}

const examples: Example[] = [
  {
    title: 'HR & Onboarding',
    text: 'A growing company uploads all their HR policies, onboarding checklists, and employee handbooks. New hires can now just ask the assistant questions like “How do I set up my 401k?” and get an instant answer—no need to email HR.'
  },
  {
    title: 'IT & Internal Support',
    text: 'Their IT department connects help docs, setup guides, and system manuals. Instead of repeating the same instructions, the AI answers “How do I reset my VPN?” or “What’s the 2FA policy?” immediately.'
  },
  {
    title: 'Client Services',
    text: 'A consulting firm feeds in client decks, case studies, and SOPs. Now, consultants just ask the assistant “What was our pricing model for Client X?” or “Show me our last brand audit structure” and get an answer in seconds.'
  },
  {
    title: 'Construction & Field Ops',
    text: 'A construction company uploads safety protocols, equipment manuals, and site checklists. On-site workers can use the AI from a tablet to ask, “What’s the load limit for crane Model B?” or “What are the steps in our emergency response protocol?”'
  },
  {
    title: 'Legal & Compliance',
    text: 'A legal team feeds in contract templates, compliance policies, and past case notes. Instead of searching folders, they just ask, “What’s the NDA clause for IP ownership?” or “When did we last update our privacy policy?”'
  },
  {
    title: 'Marketing Teams',
    text: 'They upload brand guidelines, campaign recaps, and competitor research. The team now gets instant help answering “What tone should we use on LinkedIn?” or “What was the CPC for our last Google Ads campaign?”'
  },
  {
    title: 'Sales Enablement',
    text: 'Sales reps connect pitch decks, objection handling docs, and pricing structures. During a call, they can ask “What’s our ROI stat for SaaS clients?” and get a confident answer, instantly.'
  },
  {
    title: 'Medical & Clinical Research',
    text: 'A clinic stores research papers, trial protocols, and treatment guides. Staff just ask “What are the dosage guidelines for Drug Y?” or “What inclusion criteria were used for Study X?” and the AI pulls it up.'
  },
  {
    title: 'Manufacturing & Logistics',
    text: 'Ops teams upload machine manuals, workflow diagrams, and inventory policies. Warehouse managers can instantly ask “Where’s the process doc for packaging returns?” or “What’s the inspection checklist for Line 4?”'
  },
  {
    title: 'Real Estate & Property Management',
    text: 'They store lease templates, maintenance logs, and tenant FAQs. Property managers now ask things like “What’s the pet policy for building A?” or “When does this lease expire?” and get the info right away.'
  },
  {
    title: 'Education & Training Providers',
    text: 'An online course platform feeds in lesson plans, syllabi, and instructor FAQs. The AI assistant helps staff and students instantly access “What’s the grading rubric for Module 4?” or “Where’s the updated Zoom link for this week?”'
  },
  {
    title: 'Architecture & Design Studios',
    text: 'They upload project briefs, design guidelines, and building code references. Designers can now ask “What materials did we use in the Denver lobby remodel?” or “What\'s the setback rule for that zone?” without digging through folders.'
  },
  {
    title: 'Nonprofits & NGOs',
    text: 'They connect grant documentation, impact reports, and internal policies. Team members ask things like “Where’s our latest DEI strategy?” or “What was our annual budget for outreach programs?” and get answers immediately.'
  },
  {
    title: 'Law Enforcement & Public Safety',
    text: 'Departments upload SOPs, training manuals, and incident report formats. Officers can instantly access “What’s the correct chain-of-custody protocol?” or “What code covers noise complaints after 10pm?”'
  },
  {
    title: 'Hospitality & Hotel Operations',
    text: 'A hotel group inputs guest service protocols, staff training guides, and emergency procedures. Front desk and housekeeping staff can just ask “What’s the process for a lost key card?” or “What’s our room service policy after 11pm?”'
  },
  {
    title: 'Agriculture & Farm Management',
    text: 'A farm co-op connects crop schedules, pesticide usage logs, and soil reports. Workers on the field can ask “When was the last nitrogen application?” or “What’s the watering interval for tomatoes in July?”'
  },
  {
    title: 'Aviation & Airline Services',
    text: 'Flight operations teams upload safety checklists, training logs, and compliance rules. Ground crew or flight staff can ask “What’s the boarding delay protocol?” or “What does the MEL for this aircraft say?”'
  },
  {
    title: 'Event Planning Agencies',
    text: 'They store past event layouts, vendor contracts, and run-of-show docs. Coordinators just ask “Who did catering for the 2023 gala?” or “Where’s the AV setup checklist for ballroom setups?”'
  },
  {
    title: 'Fashion & Apparel Brands',
    text: 'They upload design archives, production specs, and supplier info. Designers and ops teams can search “What’s the fabric blend for our spring jackets?” or “Which factory handled batch #214?”'
  },
  {
    title: 'Insurance Companies',
    text: 'Agents feed in policy documents, claims procedures, and state-specific regulations. They can ask “What’s the deductible rule in Florida for flood coverage?” or “Where’s the appeal process for denied claims?”'
  }
]

export const ExamplesCarousel: FC = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % examples.length)
    }, 7000)
    return () => clearInterval(id)
  }, [])

  const prev = () => setIndex((index - 1 + examples.length) % examples.length)
  const next = () => setIndex((index + 1) % examples.length)

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="p-6 text-center space-y-4"
        >
          <h3 className="text-xl font-semibold">{examples[index].title}</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            {examples[index].text}
          </p>
        </motion.div>
      </AnimatePresence>
      <button
        aria-label="Previous example"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-card/80 backdrop-blur hover:bg-card"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        aria-label="Next example"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-card/80 backdrop-blur hover:bg-card"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default ExamplesCarousel
