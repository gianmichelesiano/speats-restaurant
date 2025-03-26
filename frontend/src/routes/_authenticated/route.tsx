import Cookies from 'js-cookie'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { useRouter } from '@tanstack/react-router'
import SkipToMain from '@/components/skip-to-main'
import { useAuthContext } from '@/context/auth-context'
import LandingPage from '@/features/landing'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, isLoading } = useAuthContext()
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  const router = useRouter()
  
  // If not authenticated and not loading, show landing page
  if (!isAuthenticated && !isLoading) {
    return <LandingPage />
  }
  
  // If authenticated, show the authenticated layout
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Header>
            <Search className="mr-2" />
            <TopNav 
              links={[
                { 
                  title: 'Dashboard', 
                  href: '/', 
                  isActive: router.state.location.pathname === '/' 
                },
                { 
                  title: 'Restaurants', 
                  href: '/restaurants', 
                  isActive: router.state.location.pathname.startsWith('/restaurants') 
                },
                { 
                  title: 'Menu Items', 
                  href: '/menu-items-simple', 
                  isActive: router.state.location.pathname.startsWith('/menu-items') 
                },
                { 
                  title: 'Roles & Permissions', 
                  href: '/roles', 
                  isActive: router.state.location.pathname.startsWith('/roles') 
                }
              ]} 
            />
            <div className="ml-auto flex items-center gap-2">
              <ProfileDropdown />
            </div>
          </Header>
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
