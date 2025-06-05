export default function AICustomerSupportArticle() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary">AI Customer Support for Supabase Integration</h1>
      
      <p className="text-lg text-muted-foreground">
        This automated workflow transforms incoming emails about the Supabase Integration Unity asset into intelligent customer support responses. Using AI-powered classification, documentation retrieval, and personalized communication, it provides 24/7 support while capturing valuable user feedback for product development.
      </p>

      <h2 className="text-2xl font-semibold text-primary">The Challenge</h2>
      <p>
        Support emails for Unity assets arrive around the clock from developers worldwide asking how to implement features, troubleshoot issues, or requesting new functionality. Manually responding to each inquiry is time-consuming, inconsistent, and makes it difficult to track user feedback for future product improvements. Without automation, valuable development time gets consumed by repetitive support tasks.
      </p>

      <h2 className="text-2xl font-semibold text-primary">Core Workflow Components</h2>
      
      <h3 className="text-xl font-semibold">1. Email Processing Pipeline</h3>
      <p>
        The system monitors Gmail every minute using automated triggers, immediately processing new emails related to the Supabase Integration asset. AI classification determines email relevance, filtering out spam and unrelated messages while ensuring only legitimate customer inquiries from external users (excluding yourindie101@gmail.com) receive automated responses.
      </p>

      <h3 className="text-xl font-semibold">2. Knowledge Base (RAG System)</h3>
      <p>
        A sophisticated Retrieval-Augmented Generation system pulls documentation directly from the YourIndieDev/Supabase-Integration GitHub repository. The system creates vector embeddings using OpenAI, storing them both in an in-memory vector store for rapid access and a Supabase vector database for persistence. Documentation is intelligently chunked to optimize AI retrieval and ensure accurate, contextual responses.
      </p>

      <h3 className="text-xl font-semibold">3. AI Agent Architecture</h3>
      <p>
        Two specialized AI agents handle different aspects of customer communication:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-2">
        <li><strong>Email Agent:</strong> Responds to technical questions using vector search through repository knowledge, generating human-like responses with appropriate Unity Asset Store links</li>
        <li><strong>Feature Agent:</strong> Identifies feature requests that don&#39;t exist in the current asset, automatically logging them to Google Sheets for development tracking</li>
      </ul>

      <h3 className="text-xl font-semibold">4. Feature Request Management</h3>
      <p>
        Google Sheets integration automatically captures feature requests with comprehensive metadata including date, project name, detailed feature description, and requester information. This creates a living roadmap for development planning and ensures no user feedback gets lost in email threads.
      </p>

      <h2 className="text-2xl font-semibold text-primary">Technical Implementation</h2>
      <p>
        The system operates through a seamless integration of Gmail API monitoring, OpenAI embeddings, Supabase vector storage, and Google Sheets automation. Each component works together to create a comprehensive customer support ecosystem that scales automatically with user growth.
      </p>

      <h2 className="text-2xl font-semibold text-primary">Quality Assurance &amp; Brand Consistency</h2>
      <p>
        All automated responses maintain the distinctive &quot;Aloha&quot; greeting and &quot;Mahalo, Your Indie!&quot; signature, ensuring consistent brand voice across all customer interactions. For sensitive or complex inquiries, the system routes responses through a human approval process via email, maintaining quality while preserving automation efficiency.
      </p>

      <h2 className="text-2xl font-semibold text-primary">Business Impact</h2>
      <p>
        This AI-powered customer support system delivers measurable business value by reducing manual support workload by an estimated 80%, providing consistent 24/7 availability across global time zones, and capturing 100% of feature requests for product development insights. The system scales customer support capabilities without requiring additional human resources while maintaining professional relationships with Unity developers.
      </p>

      <h2 className="text-2xl font-semibold text-primary">Key Features</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Smart email classification that only processes relevant Supabase Integration inquiries</li>
        <li>Context-aware responses powered by live repository documentation</li>
        <li>Automated feature request tracking and roadmap management</li>
        <li>Professional communication maintaining consistent brand voice</li>
        <li>Human oversight for quality assurance on sensitive responses</li>
        <li>Seamless Unity Asset Store integration for enhanced user experience</li>
      </ul>

      <h2 className="text-2xl font-semibold text-primary">The Result</h2>
      <p>
        This workflow essentially creates a knowledgeable AI customer support representative specifically designed for the Unity Asset Store ecosystem. It helps developers get immediate, accurate support for the Supabase Integration asset while automatically gathering valuable insights that drive future product improvements and feature development.
      </p>
    </article>
  )
}
