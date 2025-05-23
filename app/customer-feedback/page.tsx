import { type FC } from 'react'

const CustomerFeedbackPage: FC = () => {
  return (
    <div className="w-screen h-screen p-4">
      <iframe
        src="https://www.improvforms.com/forms/chat/10380385-5903-4fcf-a5d3-362b3a606c97?background=%230f172a&foreground=%23f8fafc&primary=%231d4ed8&primaryForeground=%23ffffff&secondary=%45b6fe&secondaryForeground=%23f1f5f9&muted=%231e293b&mutedForeground=%2394a3b8"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="Customer Feedback"
      />
    </div>
  )
}

export default CustomerFeedbackPage
