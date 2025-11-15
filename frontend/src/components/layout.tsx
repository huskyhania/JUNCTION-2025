import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { useUser } from "@/contexts/UserContext"
import { cn } from "@/lib/utils"

export function Layout() {
  const { currentWallpaper } = useUser()
  
  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Apply wallpaper gradient if set */}
      {currentWallpaper ? (
        <div className={cn("fixed inset-0 -z-10", currentWallpaper)} />
      ) : (
        <div className="fixed inset-0 -z-10 bg-slate-200/60" />
      )}
      
      {/* Sidebar - Primary element */}
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>
      
      {/* Main content area with navbar */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

