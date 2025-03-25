import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IconAlertCircle } from '@tabler/icons-react'
import AuthLayout from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'
import { createSupabaseClient } from '@/utils/supabase/client'

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null)
  const [isValidLink, setIsValidLink] = useState(true)

  useEffect(() => {
    // Process the password reset token from the URL
    const processResetToken = async () => {
      try {
        const supabase = createSupabaseClient()
        
        // Get the current URL hash
        const hash = window.location.hash
        
        // If there's no hash, check if we have a valid session already
        if (!hash) {
          const { data, error } = await supabase.auth.getSession()
          
          if (error || !data.session) {
            setIsValidLink(false)
            setError('Invalid or expired password reset link. Please request a new one.')
          }
          return
        }
        
        // Parse the hash parameters
        const query = new URLSearchParams(hash.substring(1))
        const accessToken = query.get('access_token')
        const refreshToken = query.get('refresh_token')
        const type = query.get('type')
        
        // Validate the parameters
        if (!accessToken || type !== 'recovery') {
          setIsValidLink(false)
          setError('Invalid or expired password reset link. Please request a new one.')
          return
        }
        
        // Set the auth session from the URL parameters
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        })
        
        if (error) {
          console.error('Error setting session:', error)
          setIsValidLink(false)
          setError('Invalid or expired password reset link. Please request a new one.')
        }
      } catch (err) {
        console.error('Error processing reset token:', err)
        setIsValidLink(false)
        setError('An error occurred while processing your reset link. Please try again.')
      }
    }
    
    processResetToken()
  }, [])

  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-4 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            Reset Password
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your new password below.
          </p>
        </div>
        
        {!isValidLink ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || 'Invalid or expired password reset link. Please request a new one.'}
              </AlertDescription>
            </Alert>
            <p className='mt-4 text-center text-sm text-muted-foreground'>
              <Link
                to='/forgot-password'
                className='underline underline-offset-4 hover:text-primary'
              >
                Request a new password reset link
              </Link>
            </p>
          </div>
        ) : (
          <>
            <ResetPasswordForm />
            <p className='mt-4 text-center text-sm text-muted-foreground'>
              Remember your password?{' '}
              <Link
                to='/sign-in'
                className='underline underline-offset-4 hover:text-primary'
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </Card>
    </AuthLayout>
  )
}
