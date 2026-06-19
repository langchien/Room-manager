import {
  type ColumnDef,
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

export const useTable = <T>({
  columns,
  data,
  visibilityState,
}: {
  columns: ColumnDef<T>[]
  data: T[]
  visibilityState?: VisibilityState
}) => {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    visibilityState ?? {},
  )
  const [rowSelection, setRowSelection] = React.useState({})
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  })
  return { table, columnVisibility, setColumnVisibility, rowSelection, setRowSelection }
}
