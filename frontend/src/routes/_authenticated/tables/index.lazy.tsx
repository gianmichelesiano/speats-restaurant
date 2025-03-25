import { createLazyFileRoute } from '@tanstack/react-router'
import Tables from '@/features/tables'

export const Route = createLazyFileRoute('/_authenticated/tables/')({
  component: Tables,
})
