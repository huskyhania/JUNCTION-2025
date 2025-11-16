import { endOfDay, startOfDay, subDays } from "date-fns"
import { type Payment } from "./columns"

const BACKEND_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const MOCKBANK_USER_ID = import.meta.env.VITE_MOCKBANK_USER_ID || "demo1"

type MockbankTransaction = {
  id: string
  amount: number
  status?: string
  description?: string | null
  date: string
  category?: string | null
  merchant?: string | null
}

const KNOWN_CATEGORIES = [
  "Food",
  "Utilities",
  "Income",
  "Housing",
  "Transportation",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Travel",
  "Subscriptions",
  "Savings",
  "BNPL",
  "Other",
]

const CATEGORY_ALIASES: Record<string, string> = {
  grocery: "Food",
  groceries: "Food",
  transport: "Transportation",
  commute: "Transportation",
  fun: "Entertainment",
  subscription: "Subscriptions",
  subscriptions: "Subscriptions",
  membership: "Subscriptions",
  bnpl: "BNPL",
  "buy now pay later": "BNPL",
}

const ALLOWED_STATUSES: Payment["status"][] = ["pending", "processing", "success", "failed"]

const normalizeCategory = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  const lower = trimmed.toLowerCase()
  const alias = CATEGORY_ALIASES[lower]
  if (alias) {
    return alias
  }
  const match = KNOWN_CATEGORIES.find(
    (category) => category.toLowerCase() === lower
  )
  if (match) {
    return match
  }
  return trimmed
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ")
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Food: ["grocery", "restaurant", "coffee", "cafe", "bakery", "food", "dining","Groceries"],
  Utilities: ["electricity", "water", "internet", "phone", "gas bill", "utility"],
  Income: ["salary", "payroll", "bonus", "deposit", "freelance"],
  Housing: ["rent", "mortgage", "home", "property", "maintenance", "insurance"],
  Transportation: ["uber", "taxi", "gas", "fuel", "car", "parking", "transport", "Transport"],
  Shopping: ["shopping", "store", "amazon", "retail", "clothing", "furniture", "electronics"],
  Health: ["pharmacy", "doctor", "clinic", "health", "gym", "dental"],
  Entertainment: ["movie", "concert", "game", "museum", "theater", "Subscription","subscription", "netflix","fun","Bnpl"],
  Education: ["course", "books", "tuition", "education", "workshop"],
  Travel: ["flight", "hotel", "travel", "car rental", "airbnb"],
  Subscriptions: ["subscription", "membership", "service", "streaming"],
  Savings: ["savings", "investment", "deposit"],
  BNPL: ["bnpl", "klarna", "afterpay", "zip", "affirm", "pay later"],
}

const inferCategory = (tx: MockbankTransaction): string | undefined => {
  const normalized = normalizeCategory(tx.category)
  if (normalized) {
    return normalized
  }

  const haystack = [
    tx.description?.toLowerCase() ?? "",
    tx.merchant?.toLowerCase() ?? "",
  ].join(" ")

  if (!haystack.trim()) {
    return undefined
  }

  for (const category of KNOWN_CATEGORIES) {
    const keywords = CATEGORY_KEYWORDS[category]
    if (!keywords) continue
    if (keywords.some((keyword) => keyword && haystack.includes(keyword.toLowerCase()))) {
      return category
    }
  }

  return undefined
}

// Static payment data used as fallback when the MockBank API is unavailable.
const STATIC_PAYMENTS: Payment[] = [
  // Food category
  { id: "1", amount: 100.0, status: "pending", description: "Grocery Store", date: "2025-11-15", category: "Food" },
  { id: "4", amount: 75.25, status: "failed", description: "Coffee Shop", date: "2025-11-12", category: "Food" },
  { id: "8", amount: 125.0, status: "success", description: "Restaurant", date: "2025-11-08", category: "Food" },
  { id: "11", amount: 85.5, status: "success", description: "Supermarket", date: "2025-11-14", category: "Food" },
  { id: "12", amount: 45.75, status: "success", description: "Fast Food", date: "2025-11-13", category: "Food" },
  { id: "13", amount: 120.0, status: "processing", description: "Restaurant Dinner", date: "2025-11-15", category: "Food" },
  { id: "14", amount: 95.25, status: "success", description: "Grocery Shopping", date: "2025-11-11", category: "Food" },
  { id: "15", amount: 65.5, status: "success", description: "Cafe", date: "2025-11-10", category: "Food" },
  { id: "16", amount: 180.0, status: "success", description: "Fine Dining", date: "2025-11-09", category: "Food" },
  { id: "17", amount: 55.75, status: "pending", description: "Bakery", date: "2025-11-07", category: "Food" },

  // Utilities category
  { id: "2", amount: 250.5, status: "processing", description: "Electricity Bill", date: "2025-11-11", category: "Utilities" },
  { id: "18", amount: 85.0, status: "success", description: "Water Bill", date: "2025-11-14", category: "Utilities" },
  { id: "19", amount: 120.5, status: "success", description: "Internet Bill", date: "2025-11-13", category: "Utilities" },
  { id: "20", amount: 45.25, status: "success", description: "Phone Bill", date: "2025-11-12", category: "Utilities" },
  { id: "21", amount: 95.75, status: "processing", description: "Gas Bill", date: "2025-11-10", category: "Utilities" },

  // Income category
  { id: "3", amount: 500.0, status: "success", description: "Salary Deposit", date: "2025-11-10", category: "Income" },
  { id: "10", amount: 675.0, status: "success", description: "Freelance Payment", date: "2025-11-05", category: "Income" },
  { id: "22", amount: 4200.0, status: "success", description: "Monthly Salary", date: "2025-11-01", category: "Income" },
  { id: "23", amount: 350.0, status: "success", description: "Side Project", date: "2025-11-14", category: "Income" },
  { id: "24", amount: 200.0, status: "pending", description: "Consulting Fee", date: "2025-11-15", category: "Income" },
  { id: "25", amount: 150.0, status: "success", description: "Bonus", date: "2025-11-12", category: "Income" },

  // Housing category
  { id: "5", amount: 1200.0, status: "success", description: "Rent Payment", date: "2025-11-05", category: "Housing" },
  { id: "26", amount: 150.0, status: "success", description: "Home Insurance", date: "2025-11-04", category: "Housing" },
  { id: "27", amount: 85.5, status: "success", description: "Maintenance", date: "2025-11-03", category: "Housing" },
  { id: "28", amount: 200.0, status: "processing", description: "Property Tax", date: "2025-11-02", category: "Housing" },

  // Transportation category
  { id: "6", amount: 350.75, status: "pending", description: "Gas Station", date: "2025-11-15", category: "Transportation" },
  { id: "29", amount: 45.0, status: "success", description: "Uber Ride", date: "2025-11-14", category: "Transportation" },
  { id: "30", amount: 120.0, status: "success", description: "Public Transport Pass", date: "2025-11-13", category: "Transportation" },
  { id: "31", amount: 280.5, status: "success", description: "Car Insurance", date: "2025-11-12", category: "Transportation" },
  { id: "32", amount: 65.75, status: "success", description: "Parking Fee", date: "2025-11-11", category: "Transportation" },
  { id: "33", amount: 150.0, status: "processing", description: "Car Maintenance", date: "2025-11-09", category: "Transportation" },
  { id: "34", amount: 95.25, status: "success", description: "Taxi", date: "2025-11-08", category: "Transportation" },

  // Shopping category
  { id: "7", amount: 890.5, status: "processing", description: "Online Shopping", date: "2025-11-06", category: "Shopping" },
  { id: "35", amount: 250.0, status: "success", description: "Clothing Store", date: "2025-11-14", category: "Shopping" },
  { id: "36", amount: 180.75, status: "success", description: "Electronics", date: "2025-11-13", category: "Shopping" },
  { id: "37", amount: 125.5, status: "pending", description: "Amazon Purchase", date: "2025-11-15", category: "Shopping" },
  { id: "38", amount: 95.0, status: "success", description: "Bookstore", date: "2025-11-12", category: "Shopping" },
  { id: "39", amount: 320.25, status: "success", description: "Furniture", date: "2025-11-10", category: "Shopping" },
  { id: "40", amount: 75.5, status: "success", description: "Home Decor", date: "2025-11-09", category: "Shopping" },
  { id: "41", amount: 210.0, status: "processing", description: "Department Store", date: "2025-11-07", category: "Shopping" },

  // Health category
  { id: "9", amount: 450.25, status: "failed", description: "Gym Membership", date: "2025-11-04", category: "Health" },
  { id: "42", amount: 120.0, status: "success", description: "Pharmacy", date: "2025-11-14", category: "Health" },
  { id: "43", amount: 85.5, status: "success", description: "Doctor Visit", date: "2025-11-13", category: "Health" },
  { id: "44", amount: 200.0, status: "success", description: "Dental Checkup", date: "2025-11-12", category: "Health" },
  { id: "45", amount: 65.75, status: "success", description: "Vitamins", date: "2025-11-11", category: "Health" },
  { id: "46", amount: 150.0, status: "processing", description: "Health Insurance", date: "2025-11-09", category: "Health" },

  // Entertainment category
  { id: "47", amount: 25.0, status: "success", description: "Movie Ticket", date: "2025-11-14", category: "Entertainment" },
  { id: "48", amount: 150.0, status: "success", description: "Concert Ticket", date: "2025-11-13", category: "Entertainment" },
  { id: "49", amount: 45.5, status: "success", description: "Streaming Service", date: "2025-11-12", category: "Entertainment" },
  { id: "50", amount: 85.0, status: "success", description: "Video Games", date: "2025-11-11", category: "Entertainment" },
  { id: "51", amount: 120.75, status: "pending", description: "Theater", date: "2025-11-15", category: "Entertainment" },
  { id: "52", amount: 65.25, status: "success", description: "Sports Event", date: "2025-11-10", category: "Entertainment" },
  { id: "53", amount: 95.5, status: "success", description: "Museum", date: "2025-11-08", category: "Entertainment" },

  // Education category
  { id: "54", amount: 500.0, status: "success", description: "Online Course", date: "2025-11-12", category: "Education" },
  { id: "55", amount: 250.0, status: "processing", description: "Books", date: "2025-11-11", category: "Education" },
  { id: "56", amount: 180.0, status: "success", description: "Workshop", date: "2025-11-09", category: "Education" },

  // Travel category
  { id: "57", amount: 850.0, status: "success", description: "Flight Ticket", date: "2025-11-07", category: "Travel" },
  { id: "58", amount: 320.0, status: "success", description: "Hotel Booking", date: "2025-11-06", category: "Travel" },
  { id: "59", amount: 150.0, status: "success", description: "Travel Insurance", date: "2025-11-05", category: "Travel" },
  { id: "60", amount: 95.5, status: "success", description: "Car Rental", date: "2025-11-04", category: "Travel" },
  { id: "61", amount: 78.78, status: "success", description: "movie", date: "2025-11-06", category: "Entertainment" },
]

const normalizeDate = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return parsed.toISOString().split("T")[0]!
}

const deriveStatus = (tx: MockbankTransaction): Payment["status"] => {
  const normalized = tx.status?.toLowerCase()
  if (normalized) {
    const matched = ALLOWED_STATUSES.find((status) => status === normalized)
    if (matched) {
      return matched
    }
  }
  return tx.amount >= 0 ? "success" : "processing"
}

const mapTransaction = (tx: MockbankTransaction): Payment => {
  const description =
    tx.description?.trim() ||
    tx.merchant?.trim() ||
    tx.category?.toString() ||
    "Transaction"

  return {
    id: tx.id,
    amount: Math.abs(tx.amount),
    status: deriveStatus(tx),
    description,
    date: normalizeDate(tx.date),
    category: inferCategory(tx) ?? "Other",
  }
}

const harmonizeWithStaticTemplate = (transactions: Payment[]): Payment[] => {
  const categorized = new Map<string, Payment[]>()
  for (const tx of transactions) {
    const group = tx.category ?? "Other"
    if (!categorized.has(group)) {
      categorized.set(group, [])
    }
    categorized.get(group)!.push(tx)
  }

  for (const bucket of categorized.values()) {
    bucket.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const consumed = new Set<string>()
  const projected = STATIC_PAYMENTS.map((template) => {
    const category = template.category ?? "Other"
    const bucket = categorized.get(category)
    if (bucket && bucket.length) {
      const tx = bucket.shift()!
      consumed.add(tx.id)
      return {
        ...template,
        id: tx.id,
        amount: tx.amount,
        status: tx.status,
        date: tx.date,
        description: tx.description ?? template.description,
        category: template.category,
      }
    }
    return { ...template }
  })

  for (const tx of transactions) {
    if (!consumed.has(tx.id)) {
      projected.push(tx)
    }
  }

  return projected
}

export type PaymentDateRange = {
  from?: Date
  to?: Date
}

export const filterPaymentsByDateRange = (
  payments: Payment[],
  range?: PaymentDateRange
): Payment[] => {
  if (!range || (!range.from && !range.to)) {
    return payments
  }

  const fromTime = range.from ? startOfDay(range.from).getTime() : undefined
  const toTime = range.to ? endOfDay(range.to).getTime() : undefined

  return payments.filter((payment) => {
    const paymentTime = new Date(payment.date).getTime()
    if (Number.isNaN(paymentTime)) {
      return false
    }
    if (typeof fromTime === "number" && paymentTime < fromTime) {
      return false
    }
    if (typeof toTime === "number" && paymentTime > toTime) {
      return false
    }
    return true
  })
}

async function fetchFromMockbank(): Promise<Payment[]> {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/mockbank/users/${encodeURIComponent(MOCKBANK_USER_ID)}/transactions`
    )

    if (!response.ok) {
      throw new Error(`MockBank request failed with status ${response.status}`)
    }

    const payload = await response.json()
    if (!payload || !Array.isArray(payload.transactions)) {
      throw new Error("MockBank response missing transactions array")
    }

    const mapped = payload.transactions.map(mapTransaction)
    return harmonizeWithStaticTemplate(mapped)
  } catch (err) {
    console.warn(
      "Falling back to bundled payment data because MockBank could not be reached:",
      err
    )
    return STATIC_PAYMENTS.map((payment) => ({ ...payment }))
  }
}

const DEFAULT_INSIGHTS_LOOKBACK_DAYS = 30
const DEFAULT_INSIGHTS_RANGE: PaymentDateRange = {
  from: startOfDay(subDays(new Date(), DEFAULT_INSIGHTS_LOOKBACK_DAYS - 1)),
  to: endOfDay(new Date()),
}

const resolvedPayments = await fetchFromMockbank()
export const paymentsData: Payment[] = resolvedPayments
export const insightsTransactions: Payment[] = filterPaymentsByDateRange(
  resolvedPayments,
  DEFAULT_INSIGHTS_RANGE
)
export const defaultInsightsRange = DEFAULT_INSIGHTS_RANGE
