import { OverlayPreview } from '@/components/landing/overlay-preview'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-14 px-6 pt-16 pb-20 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="flex flex-col gap-6">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Donasi · Overlay · Marketplace
        </p>

        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Donasi masuk, pesannya langsung tampil di layar.
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
          Penonton bisa dukung kamu tanpa bikin akun. Pesan mereka muncul
          sebagai overlay di OBS — dan kamu bisa jual script, preset, atau foto
          di halaman yang sama.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" render={<Link to="/dashboard" />}>
            Mulai terima donasi
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="outline" render={<a href="#cara-kerja" />}>
            Lihat cara kerjanya
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Bisa dipasang di OBS dalam beberapa menit.
        </p>
      </div>

      <OverlayPreview />
    </section>
  )
}
