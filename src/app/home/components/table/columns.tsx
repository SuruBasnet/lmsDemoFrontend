"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StudentInfo } from "../../types"
import {  StudentUpdateForm, DeleteStudentDialogoue } from "../student/student-form"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

export const columns: ColumnDef<StudentInfo>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "plan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Plan
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("plan")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div >{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "session",
    header: ({ column }) => {
      return (
        <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-right">
          Session
          <ArrowUpDown />
        </Button>

        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("session")}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
    const student = row.original
    const [deleteOpen, setDeleteOpen] = useState(false)

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                Go to classroom
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>Update</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              Delete
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <StudentUpdateForm id={student.id} onSuccess={() => {}} />
          <DeleteStudentDialogoue
          id={student.id}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
        </Dialog>
      )
    },
  },
]
