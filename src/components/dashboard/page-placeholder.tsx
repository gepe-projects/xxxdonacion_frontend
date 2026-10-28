import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageHeader } from './page-header'

export function PagePlaceholder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <CardTitle>Segera hadir</CardTitle>
          <CardDescription>
            Halaman ini masih placeholder dan belum terhubung ke data.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Konten {title.toLowerCase()} akan diisi pada tahap berikutnya.
        </CardContent>
      </Card>
    </div>
  )
}
