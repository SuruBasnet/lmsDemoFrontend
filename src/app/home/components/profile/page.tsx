"use client"

import { useEffect, useState } from "react";
import { getUser } from "../../actions/api.user";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Use the shadcn/ui Avatar

export function Profile() {
    const [user, setUser] = useState<any>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResult = await getUser();
                if (userResult.success) {
                    console.log(userResult.data)
                    setUser(userResult.data);
                } else {
                    toast.error("Error", {
                        description: userResult.message || "Failed to load user data"
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
        <div className="flex items-center gap-3"> {/* Reduced gap */}
            {user && (
                <>
                    <Avatar className="h-8 w-8">
                        <AvatarImage 
                            src={user.profile || "/default-avatar.png"} 
                            alt={user.username || "User"} 
                            className="object-cover"
                        />
                        <AvatarFallback className="text-xs"> 
                            {user.username ? user.username.slice(0, 2).toUpperCase() : "US"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                        <h1 className="text-sm font-medium leading-none">{user.username || "User"}</h1>
                        <p className="text-xs text-muted-foreground leading-none">
                            {user.email || "No email"}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}