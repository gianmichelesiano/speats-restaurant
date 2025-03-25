import { createLazyFileRoute } from '@tanstack/react-router'
import ResetPassword from '@/features/auth/reset-password/index'

export const Route = createLazyFileRoute('/(auth)/reset-password')({
  component: ResetPassword,
})
