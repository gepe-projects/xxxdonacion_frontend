import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function OverlayPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-4xl border bg-card p-2 shadow-sm">
        <div className="rounded-3xl bg-foreground p-5 text-background sm:p-6">
          <div className="flex items-center justify-between text-xs text-background/60">
            <span>Overlay donation</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              Live
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium">Anonim</span>
              <span className="text-sm font-medium tabular-nums">
                Rp 25.000
              </span>
            </div>
            <p className="text-sm leading-relaxed text-background/70">
              semangat terus bang, jangan lupa istirahat
            </p>
          </div>

          <Separator className="my-5 bg-background/15" />

          <div className="flex items-center justify-between text-xs text-background/60">
            <span>Berikutnya</span>
            <span>Anonim · Rp 10.000</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">Donatur bisa anonim</Badge>
        <Badge variant="outline">Siap untuk OBS</Badge>
      </div>
    </div>
  )
}
