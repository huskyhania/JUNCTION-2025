import './tailwind.css';
import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import App from './App.tsx'
import Home from './pages/Home.tsx'
import Chat from './pages/Chat.tsx'
import MonthSummary from './pages/month-summary.tsx'
import SpendingCategories from './pages/spending-categories.tsx'
import OpportunityCost from './pages/opportunity-cost.tsx'
import UpcomingPayments from './pages/upcoming-payments.tsx'
import Subscriptions from './pages/subscriptions.tsx'
import BNPL from './pages/bnpl.tsx'
import MoneyStory from './pages/money-story.tsx'
import Transactions from './pages/transactions.tsx'
import Insight from './pages/insight.tsx'
import { Layout } from './components/layout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
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
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)