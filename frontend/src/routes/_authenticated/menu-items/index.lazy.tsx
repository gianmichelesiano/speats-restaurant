import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/menu-items/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/menu-items/"!</div>
}
