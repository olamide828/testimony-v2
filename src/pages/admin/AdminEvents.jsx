import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminGetEvents, adminDeleteEvent } from '../../utils/api'
import { format } from 'date-fns'
import { toast } from 'sonner'
import NProgress from 'nprogress'
import { HiPlus, HiPencil, HiTrash, HiCalendar, HiEye, HiEyeOff } from 'react-icons/hi'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Drafts' },
]

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()
  const go = (to) => { NProgress.start(); navigate(to) }

  const load = () => {
    setLoading(true)
    adminGetEvents(filter !== 'all' ? { status: filter } : {})
      .then(r => setEvents(r.data.data))
      .catch(() => toast.error('Failed to load events.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const handleDelete = async (ev) => {
    if (!confirm(`Delete "${ev.title}" and all its registrations?`)) return
    setDeleting(ev._id)
    try {
      await adminDeleteEvent(ev._id)
      toast.success('Event deleted.')
      setEvents(prev => prev.filter(e => e._id !== ev._id))
    } catch { toast.error('Failed to delete.') }
    finally { setDeleting(null) }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Events</h1>
          <p className="font-sans text-sm text-gray-400 mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => go('/admin/events/new')} className="btn-primary text-xs gap-1.5">
          <HiPlus size={16} /> New Event
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`font-sans text-xs px-4 py-2 rounded-full border transition-all ${
              filter === f.value ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center">
          <HiCalendar size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="font-serif text-xl text-gray-300 mb-6">No events found</p>
          <button onClick={() => go('/admin/events/new')} className="btn-primary text-xs gap-1.5">
            <HiPlus size={14} /> Create First Event
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Event', 'Date', 'Category', 'Registered', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-sans text-xs text-gray-400 tracking-widest uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map(ev => (
                  <tr key={ev._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {ev.imageUrl
                          ? <img src={ev.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                          : <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <HiCalendar size={15} className="text-gray-400" />
                            </div>
                        }
                        <p className="font-sans text-sm text-gray-900 font-medium">{ev.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-sans text-sm text-gray-500 whitespace-nowrap">{format(new Date(ev.date), 'MMM d, yyyy')}</td>
                    <td className="px-5 py-4">
                      <span className="badge bg-gray-100 text-gray-600 text-xs">{ev.category}</span>
                    </td>
                    <td className="px-5 py-4 font-sans text-sm text-gray-500">{ev.registrationCount ?? 0}{ev.capacity ? `/${ev.capacity}` : ''}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {ev.isPublished
                          ? <span className="flex items-center gap-1.5 font-sans text-xs text-green-600"><HiEye size={12} />Live</span>
                          : <span className="flex items-center gap-1.5 font-sans text-xs text-gray-400"><HiEyeOff size={12} />Draft</span>
                        }
                        {ev.isFeatured && <span className="badge bg-accent/10 text-accent text-[10px]">Featured</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => go(`/admin/events/edit/${ev._id}`)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                          <HiPencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(ev)} disabled={deleting === ev._id}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50">
                          <HiTrash size={13} />
                        </button>
                      </div>
                    </td>
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
