import { type FC } from 'react'

const ContactPage: FC = () => {
  return (
    <div className="w-screen min-h-screen p-4">
      <iframe
        src="https://www.improvforms.com/forms/chat/761e910f-297c-4d28-b67f-de3e048ca8a6"
        width="100%"
        height="600"
        style={{ border: 'none' }}
        title="Improv Forms"
      />
    </div>
  )
}

export default ContactPage
