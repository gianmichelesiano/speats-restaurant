import { createLazyFileRoute } from '@tanstack/react-router'
import Tenants from '@/features/tenants'

export const Route = createLazyFileRoute('/_authenticated/tenants/')({
  component: Tenants,
})
