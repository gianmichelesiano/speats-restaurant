import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useTenants } from '../context/tenants-context'

export function TenantsPrimaryButtons() {
  const { setOpen, setCurrentRow } = useTenants()

  return (
    <div className='flex items-center gap-2'>
      <Button
        onClick={() => {
          setCurrentRow(null)
          setOpen('create')
        }}
      >
        <PlusIcon className='mr-2 h-4 w-4' />
        Add Tenant
      </Button>
    </div>
  )
}
