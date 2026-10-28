import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/ui/Button'
import { FormFields } from '@/shared/ui/FormLayout'
import { TextField } from '@/shared/ui/TextField'
import { authErrorMessage } from '../api/authErrorMessage'
import { useRequestCode } from '../api/useRequestCode'
import { FormAlert } from '@/shared/ui/FormAlert'

const emailSchema = z.object({
  email: z.email('Digite um e-mail válido, como voce@exemplo.com.'),
})

type EmailValues = z.infer<typeof emailSchema>

export type EmailStepProps = {
  defaultEmail?: string
  onCodeSent: (email: string) => void
}

export function EmailStep({ defaultEmail = '', onCodeSent }: EmailStepProps) {
  const requestCode = useRequestCode()
  const form = useForm<EmailValues>({ resolver: zodResolver(emailSchema), defaultValues: { email: defaultEmail } })

  const submit = form.handleSubmit(({ email }) => requestCode.mutate(email, { onSuccess: () => onCodeSent(email) }))

  return (
    <form noValidate onSubmit={submit}>
      <FormFields>
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          hint="Enviamos um código de acesso para esse endereço."
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
        {requestCode.isError && <FormAlert>{authErrorMessage(requestCode.error)}</FormAlert>}
        <Button type="submit" size="lg" disabled={requestCode.isPending}>
          {requestCode.isPending ? 'Enviando…' : 'Receber código'}
        </Button>
      </FormFields>
    </form>
  )
}
