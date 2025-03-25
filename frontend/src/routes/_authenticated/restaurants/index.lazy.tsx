import { createLazyFileRoute } from '@tanstack/react-router'
import Restaurants from '@/features/restaurants'

export const Route = createLazyFileRoute('/_authenticated/restaurants/')({
  component: Restaurants,
})
