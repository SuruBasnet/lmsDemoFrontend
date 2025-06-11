"use client"

import * as React from "react"
import { columns } from "./columns"
import { StudentInfo } from "../../types"
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { searchStudents } from "../../actions/api.students"
import { toast } from "sonner"
import { StudentForm } from "../student/student-form"
import { useEffect } from "react"

export default function DataTable({ initialData }: { initialData: StudentInfo[] }) {
  const [data, setData] = React.useState<StudentInfo[]>([]); // or use StudentInfo[] if you have the type
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isSearching, setIsSearching] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Debounce search to avoid too many API calls
  const searchApi = React.useCallback(
    async (searchValue: string) => {
      if (searchValue.trim() === "") {
        setData(initialData)
        return
      }

      setIsSearching(true)
      try {
        const result = await searchStudents(searchValue)
        if (result.data) {
          setData(result.data || [])
        } else {
          toast.error("Error",{
            description: result.message || "Failed to search students"
          })
          setData([])
        }
      } catch  {
        toast.error("Error",{
          description: "An unexpected error occurred",
        })
        setData([])
      } finally {
        setIsSearching(false)
      }
    },
    [initialData, toast]
  )

  useEffect(() => {
        if (query === '') {
      searchApi(''); // immediately trigger when input is cleared
      setDebouncedQuery('');
      return;
    }
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query); // trigger API after 5s delay
    }, 500);

    return () => clearTimeout(timeoutId); // clear timeout if user types again
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      searchApi(debouncedQuery);
    }
  }, [debouncedQuery]);


  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search for a student..."
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
          disabled={isSearching}
        />
        {isSearching && <span className="ml-2">Searching...</span>}
        <StudentForm/>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isSearching ? "Searching..." : "No results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}