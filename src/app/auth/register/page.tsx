"use client"; // Add this at the top for client-side interactivity

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import RegisterApi from "./actions/api.register";
import { FormEvent, useState } from "react";
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from lucide-react
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        profile: formData.get("profile") as File
      };

      const result = await RegisterApi(data);
      
      if (result.success) {
        toast.success("Success",{
          description: result.message,
        });
        router.push('/auth/login/');
        
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
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register your account</CardTitle>
          <CardDescription>
            Signin if you already have a account!
          </CardDescription>
          <CardAction>
            <Link href="/auth/login"><Button variant="link">Sign In</Button></Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="username">Username</Label>
                    </div>
                    <Input id="username" name="username" type="text" required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="profile">Profile</Label>
                    </div>
                    <Input id="profile" name="profile" type="file" required />
                </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                />
              </div>
             <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <Button
                  type="button" // Important: Prevents form submission
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>
            </div>
            <CardFooter className="flex-col p-0 pt-6 gap-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}