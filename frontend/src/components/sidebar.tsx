import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Calendar,
  PieChart,
  Target,
  CreditCard,
  Receipt,
  BookOpen,
  Lightbulb,
  List,
  DollarSign,
  ChevronDown,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sidebarSections = [
  {
    name: "Month Summary",
    description: "Income, Spending",
    icon: DollarSign,
    href: "/home",
  },
  {
    name: "Spending Categories",
    description: "Charts",
    icon: PieChart,
    href: "/spending-categories",
  },
  {
    name: "Transactions Feed",
    icon: List,
    href: "/transactions",
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
]

const insightOfTheDay = {
  name: "AI Insights",
  description: "AI",
  icon: Lightbulb,
  href: "/insight",
}

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/")
  }

  return (
    <div className="flex h-screen w-72 flex-col bg-white shrink-0">
      {/* App Name */}
      <div className="p-4">
        <Link to="/home" className="flex items-center">
          <h1 className="text-xl font-bold text-blue-600">Bee Saver</h1>
        </Link>
      </div>
      
      {/* User Section */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold truncate">Alex</span>
              <span className="text-xs text-muted-foreground truncate">user@beesaver.com</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-destructive focus:text-destructive hover:bg-gray-100 hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col h-full">
          {/* Sidebar Sections */}
          <nav className="space-y-1 flex-1">
            {sidebarSections.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors min-h-[3.5rem] justify-center",
                    isActive
                      ? "border border-blue-500 text-blue-700 font-semibold "
                      : "text-muted-foreground hover:bg-gray-200 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.description && (
                    <span className={cn(
                      "text-xs pl-6",
                      isActive ? "text-blue-600" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-4">
            <Link
              to={insightOfTheDay.href}
              className={cn(
                "flex flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors min-h-[3.5rem] justify-center",
                "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20",
                "hover:from-yellow-500/20 hover:to-orange-500/20 hover:border-yellow-500/30",
                location.pathname === insightOfTheDay.href && "from-yellow-500/20 to-orange-500/20 border-yellow-500/40"
              )}
            >
              <div className="flex items-center gap-2">
                <insightOfTheDay.icon className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-foreground">{insightOfTheDay.name}</span>
              </div>
              {insightOfTheDay.description && (
                <span className="text-xs pl-6 text-muted-foreground">
                  {insightOfTheDay.description}
                </span>
              )}
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

