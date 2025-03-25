import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useRestaurants } from '../context/restaurants-context'

export function RestaurantsPrimaryButtons() {
  const { setOpen } = useRestaurants()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setOpen('create')}>
        <PlusIcon className='mr-2 h-4 w-4' />
        Add Restaurant
      </Button>
    </div>
  )
}
