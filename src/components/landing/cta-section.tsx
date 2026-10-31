import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-foreground px-6 py-10 text-background sm:px-10 md:flex-row md:items-center">
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Siap mulai?</h2>
          <p className="text-sm leading-relaxed text-background/70">
            Bikin halaman donasi kamu, tempel overlay ke OBS, dan mulai jual
            karya di hari yang sama.
          </p>
        </div>

        <Link to="/dashboard" className={buttonVariants({ size: 'lg' })}>
          Mulai sekarang
          <ArrowRight data-icon="inline-end" />
        </Link>
      </div>
    </section>
  )
}
