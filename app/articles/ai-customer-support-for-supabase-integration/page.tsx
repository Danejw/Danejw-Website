export default function AICustomerSupportArticle() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary">AI Customer Support for Supabase Integration</h1>
      <p>This workflow turns incoming emails about the Supabase Integration Unity asset into automated customer support. It classifies messages, searches project documentation and sends professional replies in a consistent style.</p>
      <h2 className="text-2xl font-semibold">Problem Example</h2>
      <p>Support emails arrive around the clock asking how to use the asset or requesting new features. Manually responding is time consuming and makes it easy to lose track of what users are requesting.</p>
      <h2 className="text-2xl font-semibold">AI Solution Engineering</h2>
      <p>The system checks Gmail every minute, filters out irrelevant messages and uses AI with a retrieval system built from the asset documentation. It then drafts human-like replies and links to the Unity Asset Store when helpful. Feature requests are logged to Google Sheets and sensitive responses can go through an email approval step. The process keeps customer communication organized while capturing feedback for future updates.</p>
    </article>
  )
}
