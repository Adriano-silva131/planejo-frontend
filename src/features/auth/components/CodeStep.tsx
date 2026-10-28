import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/ui/Button'
import { FormFields } from '@/shared/ui/FormLayout'
import { TextField } from '@/shared/ui/TextField'
import { authErrorMessage } from '../api/authErrorMessage'
import { useRequestCode } from '../api/useRequestCode'
import { useVerifyCode } from '../api/useVerifyCode'
import { useCooldown } from '../hooks/useCooldown'
import { FormAlert } from '@/shared/ui/FormAlert'

const codeSchema = z.object({
  code: z.string().trim().regex(/^\d{6,10}$/, 'Digite os números que chegaram no e-mail.'),
})

type CodeValues = z.infer<typeof codeSchema>

export type CodeStepProps = {
  email: string
  onChangeEmail: () => void
}

export function CodeStep({ email, onChangeEmail }: CodeStepProps) {
  const verifyCode = useVerifyCode()
  const resend = useRequestCode()
  const cooldown = useCooldown(60, true)
  const form = useForm<CodeValues>({ resolver: zodResolver(codeSchema), defaultValues: { code: '' } })
  const submit = form.handleSubmit(({ code }) => verifyCode.mutate({ email, code }))
  const error = verifyCode.error ?? resend.error

  return (
    <form noValidate onSubmit={submit}>
      <FormFields>
        <p className="text-ink-muted">
          Enviamos um código para <strong className="text-ink">{email}</strong>. Ele vale por alguns minutos.
        </p>
        <TextField
          label="Código"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={10}
          error={form.formState.errors.code?.message}
          {...form.register('code')}
        />
        {error && <FormAlert>{authErrorMessage(error)}</FormAlert>}
        <Button type="submit" size="lg" disabled={verifyCode.isPending}>
          {verifyCode.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
        <div className="flex flex-wrap justify-between gap-2">
          <Button
            variant="ghost"
            disabled={cooldown.secondsLeft > 0 || resend.isPending}
            onClick={() => resend.mutate(email, { onSuccess: cooldown.start })}
          >
            {cooldown.secondsLeft > 0 ? `Reenviar em ${cooldown.secondsLeft} s` : 'Reenviar código'}
          </Button>
          <Button variant="ghost" onClick={onChangeEmail}>
            Usar outro e-mail
          </Button>
        </div>
      </FormFields>
    </form>
  )
}
