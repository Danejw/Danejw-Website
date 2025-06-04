export default function SurveyFeedbackArticle() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary">Making Sense of Company-Wide Survey Feedback</h1>
      <p>Organizations collect feedback through surveys but rarely act on it quickly due to the volume and lack of clarity.</p>
      <h2 className="text-2xl font-semibold">Problem Example</h2>
      <p>A quarterly employee survey generates 1,000+ open-text responses. HR knows there are insights buried in the data—but manually reading and categorizing comments is time-consuming.</p>
      <h2 className="text-2xl font-semibold">AI Solution Engineering</h2>
      <p>A summarization and clustering pipeline can be built to ingest raw feedback, detect sentiment, categorize themes (e.g., compensation, culture, management), and auto-generate a report with data visualizations and quotes. You can use embeddings for grouping similar comments and plug into BI tools like Looker or Power BI for the output.</p>
    </article>
  )
}
