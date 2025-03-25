import { createLazyFileRoute } from '@tanstack/react-router'
import Reviews from '@/features/reviews'

export const Route = createLazyFileRoute('/_authenticated/reviews/')({
  component: Reviews,
})
