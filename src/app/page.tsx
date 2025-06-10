"use client";

import { useEffect, useState } from "react";
import { getStudents } from "./home/actions/api.students";
import DataTable from "./home/components/table/data-table";
import { toast } from "sonner";
import { getUser } from "./home/actions/api.user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "./home/components/table/modeToggle/page";
import { Logout } from "./auth/logout/page";
import { Profile } from "./home/components/profile/page";

export default function StudentTable() {
  const [data, setData] = useState([]);
  // const [user, setUser] = useState<any>(null); // Add state for user data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Then fetch student data
        const studentsResult = await getStudents();
        if (studentsResult.success) {
          setData(studentsResult.data);
          console.log(data)
          toast.success("Success", {
            description: studentsResult.message || "Students data loaded successfully"
          });
        } else {
          toast.error("Error", {
            description: studentsResult.message || "Failed to load students data"
          });
        }
        
      } catch (err) {
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="m-2">
      <div className="flex justify-between items-center ">
            <Profile/>
            <div className="flex items-center gap-2">
              <ModeToggle/>
              <Logout/>
            </div>
      </div>
      <Separator className="my-1" />
      <DataTable initialData={data} />
    </div>
  );
}