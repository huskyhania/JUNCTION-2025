import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Menu,
  MessageSquare,
  LayoutDashboard,
  Calendar,
  PieChart,
  Target,
  CreditCard,
  Receipt,
  BookOpen,
  Lightbulb,
  List,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const navigation = [
  {
    name: "Dashboard",
    href: "/home",
    icon: LayoutDashboard,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
]

const sidebarSections = [
  {
    name: "Month Summary",
    description: "Income, Spending",
    icon: DollarSign,
    href: "/month-summary",
  },
  {
    name: "Spending Categories",
    description: "Bars/Bubbles",
    icon: PieChart,
    href: "/spending-categories",
  },
  {
    name: "Opportunity Cost Highlights",
    icon: Target,
    href: "/opportunity-cost",
  },
  {
    name: "Upcoming Payments",
    description: "Calendar",
    icon: Calendar,
    href: "/upcoming-payments",
  },
  {
    name: "Subscriptions Overview",
    icon: CreditCard,
    href: "/subscriptions",
  },
  {
    name: "BNPL / Klarna Overview",
    icon: Receipt,
    href: "/bnpl",
  },
  {
    name: "Money Story",
    description: "Weekly Digest",
    icon: BookOpen,
    href: "/money-story",
  },
  {
    name: "Insight of the Day",
    description: "AI",
    icon: Lightbulb,
    href: "/insight",
  },
  {
    name: "Transactions Feed",
    icon: List,
    href: "/transactions",
  },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b px-6">
                  <h1 className="text-xl font-bold text-blue-600">Bee Save</h1>
                </div>
                <div className="border-b p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">John Doe</span>
                      <span className="text-xs text-muted-foreground">john@example.com</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <nav className="space-y-1 p-4">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      )
                    })}
                    <Separator className="my-4" />
                    {sidebarSections.map((item) => {
                      const isActive = location.pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          {item.description && (
                            <span className={cn(
                              "text-xs pl-6",
                              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}>
                              {item.description}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/home" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-blue-600">Bee Save</h1>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

