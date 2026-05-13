import { Pipe, PipeTransform } from '@angular/core'

export function formatCOP(value: number): string {
  return '$ ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

@Pipe({ name: 'cop', standalone: true })
export class CopPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value == null || value === '') return '$ 0'
    const n = Math.round(parseFloat(String(value)))
    if (!n || !Number.isFinite(n)) return '$ 0'
    return formatCOP(n)
  }
}
