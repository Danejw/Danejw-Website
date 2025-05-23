import { type FC } from 'react'

const FormPage: FC = () => {
  return (
    <div className="w-screen h-screen p-4">
    <iframe
      src="https://www.improvforms.com/forms/chat/9d49e346-b3c5-4a2f-831f-cd83193cc275?background=%230f172a&foreground=%23f8fafc&primary=%231d4ed8&primaryForeground=%23ffffff&secondary=%45b6fe&secondaryForeground=%23f1f5f9&muted=%231e293b&mutedForeground=%2394a3b8"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
      title="Improv Forms"
    />
    </div>
  )
}

export default FormPage
