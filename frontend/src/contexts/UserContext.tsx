import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import type { User, Plan } from "@/types/user"

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  addBadge: (badge: string) => void
  setCurrentBadge: (badge: string | null) => void
  addCoins: (amount: number) => void
  updatePlan: (plan: Plan | null) => void
  currentWallpaper: string | null
  setCurrentWallpaper: (wallpaper: string | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Default mock user data
const defaultUser: User = {
  id: "1",
  email: "user@beesaver.com",
  name: "Alex",
  currentBadge: null,
  badges: [],
  coin: 250,
  plan: null,
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser)
  const [currentWallpaper, setCurrentWallpaper] = useState<string | null>(
    localStorage.getItem("currentWallpaper") || null
  )

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const addBadge = (badge: string) => {
    if (user && !user.badges.includes(badge)) {
      setUser({
        ...user,
        badges: [...user.badges, badge],
      })
    }
  }

  const setCurrentBadge = (badge: string | null) => {
    if (user) {
      setUser({
        ...user,
        currentBadge: badge,
      })
    }
  }

  const addCoins = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        coin: user.coin + amount,
      })
    }
  }

  const updatePlan = (plan: Plan | null) => {
    if (user) {
      setUser({
        ...user,
        plan,
      })
    }
  }

  const handleSetWallpaper = (wallpaper: string | null) => {
    setCurrentWallpaper(wallpaper)
    if (wallpaper) {
      localStorage.setItem("currentWallpaper", wallpaper)
    } else {
      localStorage.removeItem("currentWallpaper")
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        addBadge,
        setCurrentBadge,
        addCoins,
        updatePlan,
        currentWallpaper,
        setCurrentWallpaper: handleSetWallpaper,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

