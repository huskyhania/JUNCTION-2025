// User types for the application

export type Plan = {
  goal: number
  item?: string // Optional item in the plan
}

export type User = {
  id: string
  email: string
  name: string
  currentBadge: string | null
  badges: string[]
  coin: number
  plan: Plan | null
  createdAt?: string
  updatedAt?: string
}

// Example badge types (you can expand this)
export type BadgeType = 
  | "SMART_SAVER"
  | "DEBT_RISK_TAKER"
  | "BUDGET_MASTER"
  | "SAVINGS_CHAMPION"
  | "GOAL_ACHIEVER"
  | string

