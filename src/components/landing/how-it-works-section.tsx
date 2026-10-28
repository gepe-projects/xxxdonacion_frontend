const steps = [
  {
    number: '01',
    title: 'Buat halaman donasi',
    description:
      'Daftar, atur nama tampilan dan minimal donasi. Selesai dalam hitungan menit.',
  },
  {
    number: '02',
    title: 'Tempel link dan overlay',
    description: 'Share link donasi ke bio. Salin browser source-nya ke OBS.',
  },
  {
    number: '03',
    title: 'Pesan masuk ke layar',
    description:
      'Donasi baru tampil otomatis di stream, lengkap dengan pesan dari donatur.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="scroll-mt-24 border-y bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Cara kerjanya singkat.
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-2">
              <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
                {step.number}
              </span>
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
