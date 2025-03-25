import { createLazyFileRoute } from '@tanstack/react-router'
import Reservations from '@/features/reservations'

export const Route = createLazyFileRoute('/_authenticated/reservations/')({
  component: Reservations,
})
