import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMenuItems } from '../context/menu-items-context'

export function MenuItemsPrimaryButtons() {
  const { setOpen } = useMenuItems()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setOpen('create')}>
        <PlusCircle className='mr-2 h-4 w-4' />
        Add Menu Item
      </Button>
    </div>
  )
}
