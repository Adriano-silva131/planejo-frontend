import { useState } from 'react'
import { FormFields } from '@/shared/ui/FormLayout'
import { CodeStep } from './CodeStep'
import { EmailStep } from './EmailStep'
import { GoogleSignIn } from './GoogleSignIn'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)

  if (codeSent) return <CodeStep email={email} onChangeEmail={() => setCodeSent(false)} />

  return (
    <FormFields>
      <EmailStep
        defaultEmail={email}
        onCodeSent={(sentTo) => {
          setEmail(sentTo)
          setCodeSent(true)
        }}
      />
      <div aria-hidden="true" className="flex items-center gap-3 type-meta text-ink-muted">
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleSignIn />
    </FormFields>
  )
}
