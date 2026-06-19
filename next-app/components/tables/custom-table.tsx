import {
  TableBody,
  TableCell,
  Table as TableComp,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTable } from '@/hooks/use-table'
import { cn } from '@/lib/utils'
import { type ColumnDef, flexRender, type Table, type VisibilityState } from '@tanstack/react-table'
import { type ReactNode } from 'react'
import { Card } from '../ui/card'

export const RowNoResult = (props: { colSpan: number; message?: string }) => {
  const { colSpan, message } = props
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className='h-24 text-center'>
        {message ?? 'Không tìm thấy bản ghi nào'}
      </TableCell>
    </TableRow>
  )
}

export const CustomTableHeader = <T,>(props: { table: Table<T>; className?: string }) => {
  const { table, className } = props
  return (
    <TableHeader className={className}>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}

export const CustomTableBody = <T,>(props: { table: Table<T>; className?: string }) => {
  const { table, className } = props
  return (
    <TableBody className={className}>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <RowNoResult colSpan={table.getAllColumns().length} />
      )}
    </TableBody>
  )
}

export const CustomTable = <T,>(props: {
  data: T[]
  columns: ColumnDef<T>[]
  className?: string
  toolbar?: (table: Table<T>) => ReactNode
  visibilityState?: VisibilityState
}) => {
  const { data, columns, className, toolbar, visibilityState } = props
  const { table } = useTable({
    columns,
    data,
    visibilityState,
  })
  return (
    <div className='flex flex-col gap-5'>
      {toolbar && toolbar(table)}
      <Card id='aaa' className={cn('w-full border p-5 shadow', className)}>
        <TableComp>
          <CustomTableHeader table={table} />
          <CustomTableBody table={table} />
        </TableComp>
      </Card>
    </div>
  )
}
