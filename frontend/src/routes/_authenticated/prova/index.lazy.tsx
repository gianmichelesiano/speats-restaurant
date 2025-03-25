import { createLazyFileRoute } from '@tanstack/react-router'
import Restaurants from '@/features/menu-items'

export const Route = createLazyFileRoute('/_authenticated/prova/')({
  component: Restaurants,
})
