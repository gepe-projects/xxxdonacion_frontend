import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Button>Click me</Button>
    </div>
  )
}
