import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { statuses, types } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRestaurants } from '../context/restaurants-context'
import { useTenants } from '@/features/tenants/context/tenants-context'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { tenants } = useTenants()
  const { selectedTenantId, setSelectedTenantId } = useRestaurants()

  return (
    <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filter restaurants...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {/* Status filter is commented out until status column is added to the schema
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Status'
            options={statuses}
          />
        )}
        */}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <Select
          value={selectedTenantId === null ? 'all' : selectedTenantId}
          onValueChange={(value) => {
            if (value === 'all') {
              setSelectedTenantId(null);
            } else {
              setSelectedTenantId(value);
            }
          }}
        >
          <SelectTrigger className='h-8 w-[180px]'>
            <SelectValue placeholder='Select tenant' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Tenants</SelectItem>
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                {tenant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
