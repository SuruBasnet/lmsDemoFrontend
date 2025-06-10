"use client"

import * as React from "react"
import LogoutApi from "./actions/api.logout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Logout() {
    const router = useRouter()
    const [isLoading,setIsLoading] = React.useState(false)
    const handleLogout = async () => {
    setIsLoading(true);
    

    const result = await LogoutApi();
    
    if (result.success) {
      toast.success(result.message);
      setIsLoading(false);
      router.push('/auth/login');
      return;
    } else {
      setIsLoading(false);
      toast.error(result.message);
    }
    
  };
  return (
    <Button variant="outline" onClick={handleLogout}>{isLoading ? "Logout..." : "Logout"}</Button>

  )
}
