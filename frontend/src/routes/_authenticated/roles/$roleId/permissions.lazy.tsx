import { RolePermissions } from '@/features/roles/components/RolePermissions'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/roles/$roleId/permissions')({
  component: RolePermissionsPage,
})

function RolePermissionsPage() {
  return <RolePermissions />
}
