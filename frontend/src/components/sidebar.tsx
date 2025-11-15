import { Link, useLocation } from "react-router-dom"
import {
  MessageSquare,
  LayoutDashboard,
  Calendar,
  TrendingUp,
  PieChart,
  Target,
  CreditCard,
  Receipt,
  BookOpen,
  Lightbulb,
  List,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
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

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex h-full w-72 flex-col border-r bg-background">
      {/* Header with Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-blue-600">Bee Save</h1>
      </div>

      {/* User Section */}
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

      {/* Main Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
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
          </nav>

          <Separator className="my-4" />

          {/* Sidebar Sections */}
          <nav className="space-y-1">
            {sidebarSections.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
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
      </ScrollArea>
    </div>
  )
}

