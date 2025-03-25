import { createLazyFileRoute } from '@tanstack/react-router'
import menuItem from '@/features/menu-items'

export const Route = createLazyFileRoute('/_authenticated/menu-items-simple/')({
  component: menuItem,
})
