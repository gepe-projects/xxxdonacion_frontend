import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check } from 'lucide-react'

const donationFeatures = [
  'Donatur tidak perlu bikin akun',
  'Overlay lewat browser source OBS',
  'Pesan tampil real-time saat donasi masuk',
]

const marketplaceFeatures = [
  'Upload file digital tanpa batas jenis',
  'Harga kamu tentukan sendiri',
  'Checkout di halaman yang sama, tanpa link luar',
]

const marketplaceExamples = [
  {
    name: 'Script mod game',
    kind: 'Auto farm, UI custom, QoL',
    price: 'Rp 45.000',
  },
  { name: 'Preset foto', kind: 'Lightroom & Photoshop', price: 'Rp 20.000' },
  {
    name: 'Paket wallpaper',
    kind: '20 file, resolusi tinggi',
    price: 'Rp 15.000',
  },
]

function FeatureList({ items }: { items: Array<string> }) {
  return (
    <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function FeaturesSection() {
  return (
    <section id="fitur" className="scroll-mt-24 border-t">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dua hal yang bisa kamu lakukan di sini.
          </h2>
          <p className="text-muted-foreground">
            Terima dukungan penonton, lalu jual karya digitalmu. Semua dari satu
            halaman.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Donasi &amp; overlay</CardTitle>
              <CardDescription>
                Penonton kirim dukungan, pesannya muncul di layar. Kamu yang
                atur minimal donasi, durasi tampil, dan kata yang difilter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureList items={donationFeatures} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketplace karya</CardTitle>
              <CardDescription>
                Jual script mod game, preset, foto, atau file digital lain.
                Pembeli bayar sekali, akses file langsung diberikan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureList items={marketplaceFeatures} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <p className="text-sm text-muted-foreground">
            Contoh yang bisa kamu jual
          </p>
          <div className="mt-3 divide-y overflow-hidden rounded-3xl border">
            {marketplaceExamples.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.kind}
                  </span>
                </div>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
