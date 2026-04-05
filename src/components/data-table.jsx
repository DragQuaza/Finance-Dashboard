import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconArrowUp,
  IconArrowDown,
  IconLayoutColumns,
  IconDownload,
  IconTrash,
  IconPencil,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { useFinance } from "@/context/FinanceContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import { mockCategories } from "@/data/mockData"

function RowActions({ row }) {
  const { deleteTransaction } = useFinance()
  const [editOpen, setEditOpen] = React.useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <IconPencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              deleteTransaction(row.original.id)
              toast.success("Transaction deleted")
            }}
          >
            <IconTrash className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTransactionDialog
        transaction={row.original}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}

function getColumns(role) {
  const cols = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-1 size-3" />
          ) : column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-1 size-3" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.original.date)}
        </span>
      ),
      sortingFn: (rowA, rowB) => {
        return new Date(rowA.original.date) - new Date(rowB.original.date)
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.description}</span>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant={row.original.type === "income" ? "default" : "secondary"}
          className={
            row.original.type === "income"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
          }
        >
          {row.original.type === "income" ? "↑ Income" : "↓ Expense"}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          {column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-1 size-3" />
          ) : column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-1 size-3" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <span
          className={`font-semibold tabular-nums ${
            row.original.type === "income"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {row.original.type === "income" ? "+" : "-"}
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
  ]

  if (role === "admin") {
    cols.push({
      id: "actions",
      cell: ({ row }) => <RowActions row={row} />,
    })
  }

  return cols
}

export function DataTable() {
  const {
    filteredTransactions,
    role,
    filters,
    setFilter,
    resetFilters,
  } = useFinance()

  const [sorting, setSorting] = React.useState([{ id: "date", desc: true }])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = React.useMemo(
    () => getColumns(role),
    [role]
  )

  const table = useReactTable({
    data: filteredTransactions,
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"]
    const rows = filteredTransactions.map((t) => [
      formatDate(t.date),
      t.description,
      t.category,
      t.type,
      t.amount,
    ])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported to CSV!")
  }

  // Export to JSON
  const handleExportJSON = () => {
    const json = JSON.stringify(filteredTransactions, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.json"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported to JSON!")
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search */}
          <Input
            placeholder="Search transactions..."
            value={filters.searchQuery}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            className="h-8 w-full sm:w-[200px] lg:w-[280px]"
          />
          {/* Type filter */}
          <Select
            value={filters.type}
            onValueChange={(v) => setFilter({ type: v })}
          >
            <SelectTrigger size="sm" className="w-[110px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          {/* Category filter */}
          <Select
            value={filters.category}
            onValueChange={(v) => setFilter({ category: v })}
          >
            <SelectTrigger size="sm" className="w-[140px] hidden sm:flex">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {mockCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Date range */}
          <Select
            value={filters.dateRange}
            onValueChange={(v) => setFilter({ dateRange: v })}
          >
            <SelectTrigger size="sm" className="w-[120px] hidden lg:flex">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          {(filters.type !== "all" || filters.category !== "all" || filters.searchQuery || filters.dateRange !== "all") && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconDownload className="size-4" />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>Export JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="size-4" />
                <span className="hidden lg:inline">Columns</span>
                <IconChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Add transaction (admin only) */}
          {role === "admin" && <AddTransactionDialog />}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No transactions found.</p>
                    {(filters.type !== "all" || filters.category !== "all" || filters.searchQuery) && (
                      <Button variant="link" size="sm" onClick={resetFilters}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground hidden text-sm lg:block">
          {filteredTransactions.length} transaction(s) total
        </div>
        <div className="flex w-full items-center gap-6 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
