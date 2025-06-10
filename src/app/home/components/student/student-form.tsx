"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormEvent, use, useEffect, useLayoutEffect, useState } from "react";
import { toast } from "sonner"
import { createStudent, deleteStudent, retrieveStudents, updateStudent } from "../../actions/api.students"
import { format, parse } from 'date-fns';
import { useRouter } from "next/navigation"
import { getStudents } from "../../actions/api.students"

export function StudentForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [open, setOpen] = useState(false) // 👈 Controlled dialog state

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
          // Get the date from form
        const usDate = formData.get('session') as string; // mm/dd/yyyy
        let apiDate;
        if (usDate){
            const [date] = usDate.split('/');
            apiDate = date;
        }
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        session: apiDate,
        plan: formData.get("plan") as string,
        status: formData.get("status") as string
      };

      const result = await createStudent(data);
      
      if (result.success) {
        toast.success("Success",{
          description: result.message,
        });
        setOpen(false) // 👈 Close dialog
        window.location.reload(); // 👈 Trigger refresh
      } else {
        toast.error("Error",{
          description: result.message,
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("Error",{
        description: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
    return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Add Student</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>New student</DialogTitle>
        <DialogDescription>
          Fill the student detail and click submit when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 my-3">
        <div className="grid gap-3">
          <Label htmlFor="name-1">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="plan">Plan</Label>
          <Input id="plan" name="plan"  required/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="session">Session</Label>
          <Input id="session" name="session" type="date" required/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" required/>
        </div>
        <div className="grid gap-3">
        <Label htmlFor="status" className="text-right">
            Status
        </Label>
        <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="Not started">Not started</SelectItem>
            <SelectItem value="Started">Started</SelectItem>
            </SelectContent>
        </Select>
        {/* Hidden input so FormData picks it up */}
        <input type="hidden" name="status" value={status} />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
  )
}


interface StudentFormProps {
  id: number
  onSuccess?: () => void
}

export function StudentUpdateForm({ id, onSuccess }: StudentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [status, setStatus] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    session: "",
    plan: "",
    status: ""
  })

  const fetchStudentData = async () => {
    setIsFetching(true)
    try {
      const student = await retrieveStudents(id)
      if (student) {
        setFormData({
          name: student.data.name || "",
          email: student.data.email || "",
          session: student.data.session ? format(new Date(student.data.session), 'yyyy-MM-dd') : "",
          plan: student.data.plan || "",
          status: student.data.status || "",
        })
        setStatus(student.data.status || "")
      }
    } catch (error) {
      console.error("Failed to retrieve student", error)
      toast.error("Error", {
        description: "Failed to load student data",
      })
    } finally {
      setIsFetching(false)
    }
  }

  // Fetch data when dialog opens
  useEffect(() => {
    if (id) {
      fetchStudentData()
    }
  }, [id])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const sessionDate = formData.get('session') as string
      let apiDate = sessionDate
      if (sessionDate) {
        apiDate = format(new Date(sessionDate), 'yyyy-MM-dd')
      }

      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        session: apiDate,
        plan: formData.get("plan") as string,
        status: formData.get("status") as string
      }

      let result = await updateStudent(data, id)
      
      if (result.success) {
        toast.success("Success", {
          description: result.message,
        })
        window.location.reload();
        setIsLoading(false);
      } else {
        toast.error("Error", {
          description: result.message,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "An unexpected error occurred"
      });
      setIsLoading(false);
    } 
  }

  if (isFetching) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-center items-center h-40">
          <p>Loading student data...</p>
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            Update student
          </DialogTitle>
          <DialogDescription>
            Update the student details and click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 my-3">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="plan">Plan</Label>
            <Input 
              id="plan" 
              name="plan"  
              required
              value={formData.plan}
              onChange={(e) => setFormData({...formData, plan: e.target.value})}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="session">Session</Label>
            <Input 
              id="session" 
              name="session" 
              type="date" 
              required
              value={formData.session}
              onChange={(e) => setFormData({...formData, session: e.target.value})}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select 
              value={status} 
              onValueChange={(value) => {
                setStatus(value)
                setFormData({...formData, status: value})
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not started">Not started</SelectItem>
                <SelectItem value="Started">Started</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="status" value={status} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

interface DeleteStudentDialogProps {
  id: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteStudentDialogoue({ id, open, onOpenChange, onSuccess }: DeleteStudentDialogProps){
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteStudent(id)
      if (result.success) {
        toast.success("Success", {
          description: result.message,
        })
        window.location.reload()
      } else {
        toast.error("Error", {
          description: result.message,
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
      onOpenChange(false)
    }}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this student? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}