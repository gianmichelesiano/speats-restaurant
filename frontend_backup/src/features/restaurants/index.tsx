import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { RestaurantsDialogs } from './components/restaurants-dialogs'
import { RestaurantsPrimaryButtons } from './components/restaurants-primary-buttons'
import RestaurantsProvider, { useRestaurants } from './context/restaurants-context'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import TenantsProvider from '@/features/tenants/context/tenants-context'

function RestaurantsContent() {
  const { restaurants, loading, error } = useRestaurants()

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4 my-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
      <DataTable data={restaurants} columns={columns} />
    </div>
  )
}

export default function Restaurants() {
  return (
    <TenantsProvider>
      <RestaurantsProvider>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Restaurants</h2>
              <p className='text-muted-foreground'>
                Manage your restaurants
              </p>
            </div>
            <RestaurantsPrimaryButtons />
          </div>
          <RestaurantsContent />
        </Main>

        <RestaurantsDialogs />
      </RestaurantsProvider>
    </TenantsProvider>
  )
}
