import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './context/AuthContext'

import Home           from './pages/Home'
import Events         from './pages/Events'
import EventDetail    from './pages/EventDetail'
import Highlights     from './pages/Highlights'
import About          from './pages/About'
import Contact        from './pages/Contact'
import VerifyCode     from './pages/VerifyCode'

import AdminLogin         from './pages/admin/AdminLogin'
import AdminLayout        from './components/admin/AdminLayout'
import AdminDashboard     from './pages/admin/AdminDashboard'
import AdminEvents        from './pages/admin/AdminEvents'
import AdminEventForm     from './pages/admin/AdminEventForm'
import AdminRegistrations from './pages/admin/AdminRegistrations'
import AdminHighlights    from './pages/admin/AdminHighlights'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

function RouteWatcher() {
  const location = useLocation()
  useEffect(() => {
    NProgress.start()
    window.scrollTo({ top: 0, behavior: 'instant' })
    const t = setTimeout(() => NProgress.done(), 350)
    return () => clearTimeout(t)
  }, [location.pathname])
  return null
}

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return admin ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteWatcher />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#fff', border: '1px solid #e5e7eb', color: '#111827',
            fontFamily: '"Inter", sans-serif', fontSize: '14px',
            borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          },
        }} />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/events"     element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/verify"     element={<VerifyCode />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index                  element={<AdminDashboard />} />
            <Route path="events"          element={<AdminEvents />} />
            <Route path="events/new"      element={<AdminEventForm />} />
            <Route path="events/edit/:id" element={<AdminEventForm />} />
            <Route path="registrations"   element={<AdminRegistrations />} />
            <Route path="highlights"      element={<AdminHighlights />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
