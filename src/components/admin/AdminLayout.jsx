import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NProgress from 'nprogress'
import { HiViewGrid, HiCalendar, HiUsers, HiPhotograph, HiLogout, HiMenuAlt2, HiChevronRight, HiExternalLink } from 'react-icons/hi'

const navItems = [
  { to: '/admin', end: true, icon: HiViewGrid, label: 'Dashboard' },
  { to: '/admin/events', icon: HiCalendar, label: 'Events' },
  { to: '/admin/registrations', icon: HiUsers, label: 'Registrations' },
  { to: '/admin/highlights', icon: HiPhotograph, label: 'Highlights' },
]

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); NProgress.start(); navigate('/admin/login') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100">
        <Link to="/" target="_blank">
          <p className="font-sans text-[10px] text-accent font-semibold tracking-[0.2em] uppercase">NTA Worldwide</p>
          <p className="font-serif text-gray-900 text-lg">Testimony Parish</p>
        </Link>
        <span className="inline-block mt-1.5 font-sans text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, end, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm transition-all group ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}>
            <Icon size={17} />{label}
            <HiChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-accent text-sm font-medium">{admin?.name?.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-sans text-gray-900 text-xs font-medium truncate">{admin?.name}</p>
            <p className="font-sans text-gray-400 text-xs truncate">{admin?.role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/" target="_blank" className="flex-1 flex items-center justify-center gap-1.5 font-sans text-xs text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
            <HiExternalLink size={13} /> View Site
          </Link>
          <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-1.5 font-sans text-xs text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
            <HiLogout size={13} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="hidden lg:flex w-60 flex-shrink-0 flex-col h-full"><SidebarContent /></div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full"><SidebarContent /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-700">
            <HiMenuAlt2 size={20} />
          </button>
          <div className="hidden lg:block" />
          <p className="font-sans text-xs text-gray-400">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </header>
        <div className="flex-1 overflow-y-auto p-6"><Outlet /></div>
      </div>
    </div>
  )
}
