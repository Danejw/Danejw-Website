import { type FC } from 'react'

const ArticlePage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary">Enhancing Customer Interaction and Support</h1>
      <p>
        Delivering consistently efficient and helpful customer service can be challenging, especially with complex inquiries or the need for standardized communication.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Problem Example</h2>
      <p>
        Customer service representatives often receive complex, multi-part questions or complaints requiring information spread across various FAQ documents, and need to respond empathetically and accurately. Companies also need to standardize communication frameworks for consistency and professionalism.
      </p>

      <h2 className="text-2xl font-semibold mt-6">AI Solution Engineering</h2>
      <p>
        An AI agent can be designed to act as a customer service assistant capable of drafting empathetic email responses, summarizing information from FAQ documents to address complex issues, and creating standardized communication templates. This solution involves an LLM managing workflow execution, accessing data tools to retrieve context from knowledge bases, and action tools to draft messages or update records. The logic and tool integrations for such an agent can be defined and refined within an IDE.
      </p>
    </div>
  )
}

export default ArticlePage
