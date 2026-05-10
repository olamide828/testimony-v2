import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../../utils/api'
import { format } from 'date-fns'
import { HiArrowRight, HiCalendar, HiLocationMarker, HiClock } from 'react-icons/hi'
import { motion } from 'framer-motion'

export default function HomeEvents() {
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [featured, setFeatured] = useState(true)

  const load = (featuredOnly) => {
    setLoading(true)
    getEvents(featuredOnly ? { featured: true } : {})
      .then((r) => setEvents(r.data.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(true) }, [])

  const handleShowAll = () => {
    setFeatured(false)
    load(false)
  }

  return (
    <section className="py-24 bg-white border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-2">What's Coming</p>
            <h2 className="section-heading">Upcoming Events</h2>
          </div>
          <Link to="/events" className="flex items-center gap-1.5 font-body text-sm text-ink-muted hover:text-ink transition-colors group">
            View all events
            <HiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-surface-muted h-48 mb-4" />
                <div className="bg-surface-muted h-4 w-3/4 mb-2" />
                <div className="bg-surface-muted h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          /* ── Empty state ── */
          <div className="border border-surface-border py-16 flex flex-col items-center gap-4 text-center">
            <HiCalendar className="text-surface-border" size={40} />
            {featured ? (
              <>
                <div>
                  <p className="font-display text-xl text-ink mb-1">No featured events right now</p>
                  <p className="font-body text-sm text-ink-muted max-w-xs mx-auto">
                    No events have been marked as featured. You can browse all upcoming programmes instead.
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={handleShowAll} className="btn-primary text-xs">
                    Show All Upcoming Events
                  </button>
                  <Link to="/events" className="btn-outline text-xs">
                    Go to Events Page
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="font-display text-xl text-ink mb-1">No upcoming events</p>
                  <p className="font-body text-sm text-ink-muted">
                    There are no events scheduled at the moment. Please check back soon.
                  </p>
                </div>
                <Link to="/events" className="btn-outline text-xs mt-2">
                  Go to Events Page
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {!featured && (
              <p className="text-xs text-ink-faint font-body mb-6">
                Showing all upcoming events ·{' '}
                <button onClick={() => { setFeatured(true); load(true) }} className="text-brand-500 hover:underline">
                  featured only
                </button>
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev, i) => (
                <motion.div
                  key={ev._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={`/events/${ev._id}`}
                    className="group block border border-surface-border hover:border-ink transition-colors duration-200"
                  >
                    {/* Image */}
                    <div className="h-48 bg-surface-muted overflow-hidden">
                      {ev.imageUrl ? (
                        <img
                          src={ev.imageUrl}
                          alt={ev.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-soft">
                          <span className="font-display text-4xl text-surface-border">{ev.category?.charAt(0) || 'E'}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <span className="eyebrow mb-2 block">{ev.category}</span>
                      <h3 className="font-display text-lg text-ink leading-snug mb-4 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {ev.title}
                      </h3>
                      <div className="space-y-1.5 text-xs text-ink-muted font-body">
                        <div className="flex items-center gap-2">
                          <HiCalendar className="text-brand-400 flex-shrink-0" size={12} />
                          {format(new Date(ev.date), 'EEE, MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <HiClock className="text-brand-400 flex-shrink-0" size={12} />
                          {ev.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <HiLocationMarker className="text-brand-400 flex-shrink-0" size={12} />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
