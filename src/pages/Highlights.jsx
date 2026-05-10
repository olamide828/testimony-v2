import { useState, useEffect } from 'react'
import { getHighlights } from '../utils/api'
import { format } from 'date-fns'
import PublicLayout from '../components/layout/PublicLayout'
import PageHero from '../components/ui/PageHero'
import { HiPhotograph, HiPlay, HiX } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'

const HERO = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80'

export default function Highlights() {
  const [highlights, setHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [mediaIdx, setMediaIdx] = useState(0)

  useEffect(() => {
    getHighlights()
      .then(r => setHighlights(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const open = (h, i = 0) => { setSelected(h); setMediaIdx(i); document.body.style.overflow = 'hidden' }
  const close = () => { setSelected(null); document.body.style.overflow = '' }

  return (
    <PublicLayout>
      <PageHero image={HERO} eyebrow="Gallery & Moments" title="Highlights" subtitle="A glimpse into the moments of worship, fellowship, and community at Testimony Parish." />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_,i) => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : highlights.length === 0 ? (
          <div className="text-center py-24">
            <HiPhotograph size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="font-serif text-2xl text-gray-300">No highlights yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {highlights.map((h, i) => (
              <motion.div key={h._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => open(h)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-gray-100 aspect-square relative">
                {h.media?.[0] ? (
                  <img
                    src={h.media[0].thumbnailUrl || h.media[0].url}
                    alt={h.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiPhotograph size={36} className="text-gray-300" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/50 transition-all duration-300 flex flex-col items-start justify-end p-4">
                  <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-serif text-white text-sm font-medium line-clamp-1">{h.title}</p>
                    <p className="font-sans text-white/60 text-xs mt-0.5">{format(new Date(h.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>

                {/* Video badge */}
                {h.media?.[0]?.resourceType === 'video' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <HiPlay size={18} className="text-gray-800 ml-0.5" />
                  </div>
                )}

                {h.media?.length > 1 && (
                  <span className="absolute top-3 right-3 bg-black/50 text-white font-sans text-xs px-2 py-0.5 rounded-full">+{h.media.length}</span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={close}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }}
              onClick={e => e.stopPropagation()}
              className="max-w-4xl w-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-white text-lg">{selected.title}</p>
                  {selected.description && <p className="font-sans text-white/50 text-sm mt-0.5">{selected.description}</p>}
                </div>
                <button onClick={close} className="text-white/50 hover:text-white p-1"><HiX size={22} /></button>
              </div>
              <div className="bg-black rounded-2xl overflow-hidden flex items-center justify-center max-h-[70vh]">
                {selected.media?.[mediaIdx]?.resourceType === 'video'
                  ? <video src={selected.media[mediaIdx].url} controls autoPlay className="max-h-[70vh] max-w-full" />
                  : <img src={selected.media?.[mediaIdx]?.url} alt={selected.title} className="max-h-[70vh] max-w-full object-contain" />
                }
              </div>
              {selected.media?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selected.media.map((m, i) => (
                    <button key={i} onClick={() => setMediaIdx(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === mediaIdx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-75'
                      }`}>
                      <img src={m.thumbnailUrl || m.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PublicLayout>
  )
}
