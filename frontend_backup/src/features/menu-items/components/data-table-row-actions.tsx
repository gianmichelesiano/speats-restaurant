import { Row } from '@tanstack/react-table'
import { Copy, MoreHorizontal, Pen, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMenuItems } from '../context/menu-items-context'
import { MenuItem } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const menuItem = row.original as MenuItem
  const { setOpen, setCurrentRow } = useMenuItems()

  const handleEdit = () => {
    setCurrentRow(menuItem)
    setOpen('update')
  }

  const handleDelete = () => {
    setCurrentRow(menuItem)
    setOpen('delete')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(menuItem.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleEdit}>
          <Pen className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
