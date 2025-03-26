import { createLazyFileRoute } from '@tanstack/react-router'
import { RolesAndPermissions } from '@/features/roles'

export const Route = createLazyFileRoute('/_authenticated/roles/')({
  component: RolesAndPermissions,
})
