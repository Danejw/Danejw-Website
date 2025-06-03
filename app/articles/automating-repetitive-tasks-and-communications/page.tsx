import { type FC } from 'react'

const ArticlePage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary">Automating Repetitive Administrative Tasks and Communications</h1>
      <p>
        Many jobs involve tedious, manual tasks that detract from more strategic work, leading to decreased productivity and job satisfaction. AI can act as a super-assistant to tackle these chores.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Problem Example</h2>
      <p>
        A common challenge is the need to summarize lengthy meeting notes or email threads and then draft concise follow-up communications or update project trackers. This often involves sifting through large amounts of unstructured text.
      </p>

      <h2 className="text-2xl font-semibold mt-6">AI Solution Engineering</h2>
      <p>
        An AI solution can be engineered to process meeting transcripts or email exchanges, extract key decisions and action items, and then generate drafts of summaries or follow-up emails, or even update spreadsheets directly. This would involve integrating AI models with tools that interact with communication platforms (like Gmail) and document or spreadsheet applications (like Google Docs or Sheets) through their APIs, and potentially using agentic orchestration to chain these actions. Such a system can be built and tested within an IDE.
      </p>
    </div>
  )
}

export default ArticlePage
