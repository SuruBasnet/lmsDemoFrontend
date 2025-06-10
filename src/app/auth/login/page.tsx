"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link';
import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from lucide-react
import { toast } from "sonner"
import LoginApi from "./actions/api.login";
import { useRouter } from 'next/navigation';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const credentials = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    const result = await LoginApi(credentials);
    
    if (result.success) {
      toast.success(result.message);
      setIsLoading(false);
      router.push('/');
      return;
    } else {
      setIsLoading(false);
      toast.error(result.message);
    }
    
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Sign up if you dont have a account!
          </CardDescription>
          <CardAction>
            <Link  href="/auth/register"><Button variant="link">Sign Up</Button></Link>
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
                {isLoading ? "Logingg..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
