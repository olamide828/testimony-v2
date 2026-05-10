import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvents } from '../utils/api'
import { format } from 'date-fns'
import NProgress from 'nprogress'
import PublicLayout from '../components/layout/PublicLayout'
import PageHero from '../components/ui/PageHero'
import { HiCalendar, HiLocationMarker, HiClock, HiSearch } from 'react-icons/hi'

const CATS = ['All', 'Sunday Service', 'Prayer Meeting', 'Bible Study', 'Youth Program', 'Special Event', 'Conference', 'Outreach', 'Other']
const HERO = 'https://images.unsplash.com/photo-1609234656388-0ff363383899?w=1600&q=80'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getEvents(cat !== 'All' ? { category: cat } : {})
      .then(r => setEvents(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cat])

  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    ev.location.toLowerCase().includes(search.toLowerCase())
  )

  const go = (to) => { NProgress.start(); navigate(to) }

  return (
    <PublicLayout>
      <PageHero
        image={HERO}
        eyebrow="Programmes & Gatherings"
        title="Upcoming Events"
        subtitle="Register for events, programmes, and gatherings at Testimony Parish."
      />

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search events…" className="input pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`font-sans text-xs px-4 py-2 rounded-full border transition-all ${
                  cat === c ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,i) => <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-gray-300 mb-2">No events found</p>
            <p className="font-sans text-sm text-gray-400">Try a different filter or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(ev => (
              <button key={ev._id} onClick={() => go(`/events/${ev._id}`)}
                className="card text-left group cursor-pointer w-full">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {ev.imageUrl
                    ? <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <HiCalendar size={36} className="text-gray-200" />
                      </div>
                  }
                  {ev.isFeatured && (
                    <span className="absolute top-3 right-3 badge bg-accent text-white text-[10px]">Featured</span>
                  )}
                  <span className="absolute top-3 left-3 badge bg-white text-gray-700 text-xs shadow-sm">{ev.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-gray-900 text-base leading-snug mb-4 line-clamp-2 group-hover:text-accent transition-colors">{ev.title}</h3>
                  <div className="space-y-2">
                    {[
                      [HiCalendar, format(new Date(ev.date), 'EEEE, MMMM d, yyyy')],
                      [HiClock, ev.time],
                      [HiLocationMarker, ev.location],
                    ].map(([Icon, text], i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-400 text-xs font-sans">
                        <Icon size={12} className="text-accent flex-shrink-0" />
                        <span className="truncate">{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="font-sans text-xs text-gray-400">
                      {ev.capacity ? `${ev.registrationCount || 0}/${ev.capacity} spots` : 'Open registration'}
                    </span>
                    <span className="font-sans text-xs font-medium text-accent group-hover:gap-2 transition-all">Register →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
