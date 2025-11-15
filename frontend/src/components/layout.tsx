import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Primary element */}
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>
      
      {/* Main content area with navbar */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

