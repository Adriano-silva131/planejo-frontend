import { Button } from '@/shared/ui/Button'
import { FormFields } from '@/shared/ui/FormLayout'
import { authErrorMessage } from '../api/authErrorMessage'
import { useGoogleSignIn } from '../api/useGoogleSignIn'
import { FormAlert } from '@/shared/ui/FormAlert'

export function GoogleSignIn() {
  const googleSignIn = useGoogleSignIn()

  return (
    <FormFields>
      <Button variant="secondary" size="lg" disabled={googleSignIn.isPending} onClick={() => googleSignIn.mutate()}>
        {googleSignIn.isPending ? 'Abrindo o Google…' : 'Continuar com o Google'}
      </Button>
      {googleSignIn.isError && <FormAlert>{authErrorMessage(googleSignIn.error)}</FormAlert>}
    </FormFields>
  )
}
