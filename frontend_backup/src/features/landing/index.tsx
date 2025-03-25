import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/context/auth-context'

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleLoginClick = () => {
    navigate({ to: '/sign-in' })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Welcome to Admin Dashboard
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            A powerful admin interface built with Shadcn UI and Vite
          </p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" onClick={handleLoginClick}>
            Login to Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate({ to: '/sign-up' })}>
            Create Account
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Modern UI</h3>
            <p className="text-muted-foreground">
              Built with Shadcn UI components for a clean, modern look
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Fast Performance</h3>
            <p className="text-muted-foreground">
              Powered by Vite for lightning-fast development and production
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Secure Authentication</h3>
            <p className="text-muted-foreground">
              Integrated with Supabase for robust authentication and data storage
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
