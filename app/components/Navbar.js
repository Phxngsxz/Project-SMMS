"use client"

import { useState, useEffect } from "react"
import { auth } from "../firebaseConfig"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Settings, User, LogOut, ChevronRight } from "lucide-react"

export default function Navbar({ title = "หน้าหลัก", breadcrumbs = [] }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [notifications, setNotifications] = useState(3) // Mock notification count

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserProfile(userDoc.data())
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "user":
        return "ลูกค้า"
      case "admin":
        return "ช่าง"
      case "superadmin":
        return "ผู้ดูแลระบบ"
      default:
        return "ผู้ใช้"
    }
  }

  const getRoleVariant = (role) => {
    switch (role) {
      case "superadmin":
        return "destructive"
      case "admin":
        return "default"
      case "user":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <header className="h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium text-foreground">{title}</span>
            {breadcrumbs.length > 0 && (
              <>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {crumb.label}
                      </span>
                      {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* User Profile Dropdown */}
          {userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 hover:bg-accent">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={userProfile.photoURL || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="text-xs">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium leading-none">{userProfile.displayName}</span>
                      <Badge variant={getRoleVariant(userProfile.role)} className="text-xs mt-1 h-4">
                        {getRoleDisplayName(userProfile.role)}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile.photoURL || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">{userProfile.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">{userProfile.email}</p>
                      </div>
                    </div>
                    <Badge variant={getRoleVariant(userProfile.role)} className="w-fit text-xs">
                      {getRoleDisplayName(userProfile.role)}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>โปรไฟล์</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>ตั้งค่า</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
