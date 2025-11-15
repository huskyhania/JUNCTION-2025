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
import { Layout } from './components/layout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)