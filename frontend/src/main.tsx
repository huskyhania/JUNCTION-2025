import './tailwind.css';
import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import { Layout } from './components/layout'
import { UserProvider } from './contexts/UserContext'
import { Loader2 } from 'lucide-react'

// Lazy load pages for faster initial load
const App = lazy(() => import('./App.tsx'))
const Home = lazy(() => import('./pages/Home.tsx'))
const Chat = lazy(() => import('./pages/Chat.tsx'))
const MonthSummary = lazy(() => import('./pages/month-summary.tsx'))
const SpendingCategories = lazy(() => import('./pages/spending-categories.tsx'))
const OpportunityCost = lazy(() => import('./pages/opportunity-cost.tsx'))
const UpcomingPayments = lazy(() => import('./pages/upcoming-payments.tsx'))
const Subscriptions = lazy(() => import('./pages/subscriptions.tsx'))
const BNPL = lazy(() => import('./pages/bnpl.tsx'))
const MoneyStory = lazy(() => import('./pages/money-story.tsx'))
const Transactions = lazy(() => import('./pages/transactions.tsx'))
const Insight = lazy(() => import('./pages/insight.tsx'))
const Game = lazy(() => import('./pages/game.tsx'))
const Store = lazy(() => import('./pages/store.tsx'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/month-summary" element={<MonthSummary />} />
              <Route path="/spending-categories" element={<SpendingCategories />} />
              <Route path="/opportunity-cost" element={<OpportunityCost />} />
              <Route path="/upcoming-payments" element={<UpcomingPayments />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/bnpl" element={<BNPL />} />
              <Route path="/money-story" element={<MoneyStory />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/game" element={<Game />} />
              <Route path="/store" element={<Store />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
)