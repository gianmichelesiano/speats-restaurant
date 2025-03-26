import { createLazyFileRoute } from '@tanstack/react-router'
import RolesAndPermissions from '@/features/users'

export const Route = createLazyFileRoute('/_authenticated/users/')({
  component: RolesAndPermissions,
})
