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
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Default mock user data
const defaultUser: User = {
  id: "1",
  email: "john@example.com",
  name: "John Doe",
  currentBadge: null,
  badges: [],
  coin: 0,
  plan: null,
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser)

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

