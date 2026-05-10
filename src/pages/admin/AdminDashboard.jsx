import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDashboard } from '../../utils/api'
import { format } from 'date-fns'
import NProgress from 'nprogress'
import { useAuth } from '../../context/AuthContext'
import { HiCalendar, HiUsers, HiClock, HiPhotograph, HiArrowRight, HiPlus } from 'react-icons/hi'

function StatCard({ icon: Icon, label, value, to }) {
  const navigate = useNavigate()
  return (
    <button onClick={() => { NProgress.start(); navigate(to) }}
      className="bg-white border border-gray-100 rounded-2xl p-6 text-left hover:shadow-sm hover:border-gray-200 transition-all group w-full">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <Icon size={18} className="text-accent" />
        </div>
        <HiArrowRight size={15} className="text-gray-200 group-hover:text-gray-400 transition-colors mt-1" />
      </div>
      <p className="font-serif text-3xl text-gray-900 mb-1">{value ?? '—'}</p>
      <p className="font-sans text-sm text-gray-400">{label}</p>
    </button>
  )
}

export default function AdminDashboard() {
  const { admin } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const go = (to) => { NProgress.start(); navigate(to) }

  useEffect(() => {
    getDashboard().then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const statusCls = { confirmed: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-600', pending: 'bg-yellow-50 text-yellow-700' }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="font-sans text-sm text-gray-400">{greeting},</p>
        <h1 className="font-serif text-3xl text-gray-900">{admin?.name}</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_,i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={HiCalendar} label="Total Events" value={data?.totalEvents} to="/admin/events" />
          <StatCard icon={HiClock} label="Upcoming" value={data?.upcomingEvents} to="/admin/events" />
          <StatCard icon={HiUsers} label="Registrations" value={data?.totalRegistrations} to="/admin/registrations" />
          <StatCard icon={HiPhotograph} label="Highlights" value="—" to="/admin/highlights" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-serif text-lg text-gray-900">Recent Registrations</h2>
            <button onClick={() => go('/admin/registrations')} className="font-sans text-xs text-accent hover:underline">View all</button>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />)}</div>
          ) : !data?.recentRegistrations?.length ? (
            <div className="py-16 text-center font-sans text-sm text-gray-300 italic">No registrations yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {data.recentRegistrations.map(r => (
                <div key={r._id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-accent text-xs">{r.firstName?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-gray-900 truncate">{r.firstName} {r.lastName}</p>
                    <p className="font-sans text-xs text-gray-400 truncate">{r.event?.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`font-sans text-xs px-2 py-0.5 rounded-full ${statusCls[r.status] || 'bg-gray-50 text-gray-400'}`}>{r.status}</span>
                    <p className="font-sans text-xs text-gray-300 mt-1">{format(new Date(r.createdAt), 'MMM d')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg text-gray-900 px-1">Quick Actions</h2>
          {[
            { icon: HiCalendar, title: 'Create Event', sub: 'Publish a new programme', to: '/admin/events/new' },
            { icon: HiPhotograph, title: 'Add Highlight', sub: 'Upload photos or videos', to: '/admin/highlights' },
            { icon: HiUsers, title: 'View Registrations', sub: 'Manage attendees', to: '/admin/registrations' },
          ].map(item => (
            <button key={item.to} onClick={() => go(item.to)}
              className="w-full flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm hover:border-gray-200 transition-all group text-left">
              <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <item.icon size={17} className="text-accent" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-gray-900">{item.title}</p>
                <p className="font-sans text-xs text-gray-400">{item.sub}</p>
              </div>
              <HiArrowRight size={15} className="ml-auto text-gray-200 group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
