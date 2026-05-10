import { useState, useEffect } from 'react'
import { adminAllRegistrations, adminGetEvents, adminGetRegistrations, adminUpdateRegStatus } from '../../utils/api'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { HiUsers, HiSearch } from 'react-icons/hi'

const statusCls = {
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-600 border-red-200',
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => { adminGetEvents().then(r => setEvents(r.data.data)).catch(() => {}) }, [])

  useEffect(() => {
    setLoading(true)
    const req = selectedEvent === 'all' ? adminAllRegistrations() : adminGetRegistrations(selectedEvent)
    req.then(r => {
      setRegistrations(r.data.data)
      setStats(selectedEvent !== 'all' ? r.data.stats : null)
    }).catch(() => toast.error('Failed to load.')).finally(() => setLoading(false))
  }, [selectedEvent])

  const updateStatus = async (id, status) => {
    try {
      await adminUpdateRegStatus(id, status)
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status } : r))
      toast.success(`Updated to ${status}.`)
    } catch { toast.error('Failed to update status.') }
  }

  const filtered = registrations.filter(r => {
    const q = search.toLowerCase()
    return r.firstName?.toLowerCase().includes(q) || r.lastName?.toLowerCase().includes(q) ||
           r.email?.toLowerCase().includes(q) || r.confirmationCode?.toLowerCase().includes(q)
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-900">Registrations</h1>
        <p className="font-sans text-sm text-gray-400 mt-0.5">Manage event registrations</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[['Total', stats.total], ['Confirmed', stats.confirmed], ['Cancelled', stats.cancelled], ['Members', stats.members], ['Total Guests', stats.totalGuests]].map(([label, value]) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <p className="font-serif text-2xl text-gray-900">{value}</p>
              <p className="font-sans text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or code…" className="input pl-10" />
        </div>
        <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="input sm:w-64">
          <option value="all">All Events</option>
          {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(6)].map((_,i) => <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center">
          <HiUsers size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="font-serif text-xl text-gray-300">No registrations found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Name', 'Email', 'Event', 'Code', 'Guests', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-sans text-xs text-gray-400 tracking-widest uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-serif text-accent text-xs">{r.firstName?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-sans text-sm text-gray-900 whitespace-nowrap">{r.firstName} {r.lastName}</p>
                          {r.isMember && <p className="font-sans text-xs text-accent">Member</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-sans text-sm text-gray-500 max-w-[160px] truncate">{r.email}</td>
                    <td className="px-5 py-4 font-sans text-xs text-gray-400 max-w-[140px] truncate">{r.event?.title || '—'}</td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-700 whitespace-nowrap">{r.confirmationCode}</td>
                    <td className="px-5 py-4 font-sans text-sm text-gray-500 text-center">{r.numberOfGuests}</td>
                    <td className="px-5 py-4">
                      <select value={r.status} onChange={e => updateStatus(r._id, e.target.value)}
                        className={`font-sans text-xs px-2.5 py-1 rounded-full border cursor-pointer bg-transparent ${statusCls[r.status] || 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                        <option value="confirmed">confirmed</option>
                        <option value="pending">pending</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 font-sans text-xs text-gray-400 whitespace-nowrap">{format(new Date(r.createdAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
