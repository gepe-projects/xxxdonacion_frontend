import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const pageSizes = [20, 50, 100]

export type DataTablePaginationProps = {
  pageIndex: number
  pageSize: number
  rowCount: number
  canPrevious: boolean
  canNext: boolean
  loading?: boolean
  onPrevious: () => void
  onNext: () => void
  onPageSizeChange: (pageSize: number) => void
}

/**
 * Footer pagination untuk backend cursor.
 *
 * Tidak ada nomor halaman total karena backend hanya mengirim `has_more` dan
 * `next_cursor`. Karena itu navigasinya Sebelumnya/Berikutnya.
 */
export function DataTablePagination({
  pageIndex,
  pageSize,
  rowCount,
  canPrevious,
  canNext,
  loading = false,
  onPrevious,
  onNext,
  onPageSizeChange,
}: DataTablePaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>Halaman {pageIndex + 1}</span>
        <span aria-hidden="true">·</span>
        <span>{rowCount} baris</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Baris</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            if (value) onPageSizeChange(Number(value))
          }}
          disabled={loading}
        >
          <SelectTrigger
            size="sm"
            className="w-20"
            aria-label="Baris per halaman"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          disabled={!canPrevious || loading}
          onClick={onPrevious}
        >
          <ChevronLeft data-icon="inline-start" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext || loading}
          onClick={onNext}
        >
          Berikutnya
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
