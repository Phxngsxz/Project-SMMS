"use client"

import { auth } from "../firebaseConfig"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Home, Wrench, Clock, Star, History, Bell, LogOut, User, Menu, ChevronLeft , PanelLeftClose , PanelLeft } from "lucide-react"
import ServiceLogo from "./service-logo"

export default function Sidebar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [displayedText, setDisplayedText] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const fullText = "Service and Maintenance System"

  useEffect(() => {
    if (isLoading) {
      let currentIndex = 0
      const typewriterInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typewriterInterval)
        }
      }, 100)

      return () => clearInterval(typewriterInterval)
    } else {
      setDisplayedText(fullText)
    }
  }, [isLoading])

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)

        const db = getFirestore()
        const userDoc = await getDoc(doc(db, "users", user.uid))

        if (userDoc.exists()) {
          setUserProfile(userDoc.data())
        }
      } else {
        setUser(null)
        router.push("/login")
      }
    })

    return () => {
      unsubscribe()
      clearTimeout(loadingTimer)
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getLink = (basePath) => {
    return userProfile?.role === "admin" ? `/admin${basePath}` : `/user${basePath}`
  }

  const menuItems = [
    {
      href: getLink("/"),
      label: "หน้าหลัก",
      icon: Home,
    },
    {
      href: getLink("/repair-requests"),
      label: "ระบบจัดการคำขอซ่อม",
      icon: Wrench,
    },
    {
      href: getLink("/repair-status"),
      label: "ระบบติดตามสถานะการซ่อม",
      icon: Clock,
    },
    {
      href: getLink("/service-evaluation"),
      label: "ระบบประเมินผลการบริการ",
      icon: Star,
    },
    {
      href: getLink("/repair-history"),
      label: "ระบบประวัติการซ่อม",
      icon: History,
    },
  ]

  const adminMenuItems = [
    {
      href: "/admin/notifications",
      label: "ระบบแจ้งเตือน",
      icon: Bell,
    },
  ]

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
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border h-screen flex flex-col shadow-lg",
        "transition-all duration-500 ease-out",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <div className="border-b border-sidebar-border bg-gradient-to-b from-sidebar to-sidebar/95">
        <div className={cn("px-6 py-6 transition-all duration-400 ease-out", isCollapsed && "px-4 py-4")}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <ServiceLogo className="w-12 h-12 transition-transform duration-300 ease-out" />
              <Button
                onClick={() => setIsCollapsed(!isCollapsed)}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 rounded-lg transition-all duration-300 ease-out",
                  "hover:bg-sidebar-accent/80 hover:scale-105",
                  "border border-sidebar-border/30 hover:border-sidebar-border/60",
                  "shadow-sm hover:shadow-md",
                  "backdrop-blur-sm bg-sidebar/50",
                )}
                title="ขยาย Sidebar"
              >
                <PanelLeft className="h-4 w-4 text-sidebar-foreground transition-all duration-300 ease-out" />
              </Button>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <ServiceLogo className="w-12 h-12 flex-shrink-0 transition-transform duration-300 ease-out" />
                <h2
                  className={cn(
                    "text-lg font-bold leading-tight tracking-wide",
                    "transition-all duration-600 ease-out transform",
                    isLoading ? "text-blue-500" : "text-sidebar-foreground",
                    !isCollapsed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
                  )}
                >
                  {displayedText}
                  {isLoading && <span className="animate-pulse text-blue-400 ml-1">|</span>}
                </h2>
              </div>
              <Button
                onClick={() => setIsCollapsed(!isCollapsed)}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 w-9 p-0 rounded-lg ml-3 flex-shrink-0",
                  "transition-all duration-300 ease-out",
                  "hover:bg-sidebar-accent/80 hover:scale-105",
                  "border border-sidebar-border/30 hover:border-sidebar-border/60",
                  "shadow-sm hover:shadow-md",
                  "backdrop-blur-sm bg-sidebar/50",
                )}
                title="ย่อ Sidebar"
              >
                <PanelLeftClose className="h-4 w-4 text-sidebar-foreground transition-all duration-300 ease-out" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-12 px-4 text-left font-normal rounded-lg",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                    "transition-all duration-200 group",
                    isCollapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform",
                      !isCollapsed && "mr-4",
                    )}
                  />
                  {!isCollapsed && <span className="text-sm leading-relaxed font-medium">{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </div>

        {(userProfile?.role === "admin" || userProfile?.role === "superadmin") && adminMenuItems.length > 0 && (
          <div className="mt-8">
            <Separator className="mb-6" />
            <div className="space-y-2">
              {!isCollapsed && (
                <div className="px-4 mb-4">
                  <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                    เมนูผู้ดูแลระบบ
                  </p>
                </div>
              )}
              {adminMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full h-12 px-4 text-left font-normal rounded-lg",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                        "transition-all duration-200 group",
                        isCollapsed ? "justify-center" : "justify-start",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform",
                          !isCollapsed && "mr-4",
                        )}
                      />
                      {!isCollapsed && <span className="text-sm leading-relaxed font-medium">{item.label}</span>}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {userProfile && (
        <div className="p-4 border-t border-sidebar-border bg-gradient-to-t from-sidebar-accent/20 to-transparent">
          <div className="bg-sidebar/80 backdrop-blur-sm rounded-xl border border-sidebar-border/50 p-5 shadow-sm">
            {isCollapsed ? (
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-10 w-10 ring-2 ring-sidebar-border/50 shadow-sm">
                  <AvatarImage src={userProfile.photoURL || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 rounded-lg",
                    "text-destructive hover:bg-destructive/10 hover:text-destructive",
                    "transition-all duration-200 group",
                    "border border-destructive/20 hover:border-destructive/30",
                  )}
                >
                  <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12 ring-2 ring-sidebar-border/50 shadow-sm">
                    <AvatarImage src={userProfile.photoURL || "/placeholder.svg"} alt="Profile" />
                    <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold text-sidebar-foreground truncate">
                        {userProfile.displayName}
                      </p>
                      <Badge variant={getRoleVariant(userProfile.role)} className="text-xs px-2 py-1">
                        {getRoleDisplayName(userProfile.role)}
                      </Badge>
                    </div>
                    <p className="text-xs text-sidebar-foreground/60 truncate leading-relaxed">{userProfile.email}</p>
                  </div>
                </div>

                <Separator className="bg-sidebar-border/30 mb-4" />

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-center h-10 px-4 rounded-lg",
                    "text-destructive hover:bg-destructive/10 hover:text-destructive",
                    "transition-all duration-200 group font-medium",
                    "border border-destructive/20 hover:border-destructive/30",
                  )}
                >
                  <LogOut className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">ออกจากระบบ</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
