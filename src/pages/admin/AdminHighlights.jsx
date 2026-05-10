import { useState, useEffect, useRef } from 'react'
import { adminGetHighlights, adminCreateHighlight, adminDeleteHighlight, adminGetEvents } from '../../utils/api'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { HiPlus, HiTrash, HiPhotograph, HiX, HiPlay, HiUpload } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminHighlights() {
  const [highlights, setHighlights] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [previews, setPreviews] = useState([])
  const fileRef = useRef()
  const [form, setForm] = useState({ title: '', description: '', relatedEvent: '', isPublished: true })

  useEffect(() => {
    load()
    adminGetEvents().then(r => setEvents(r.data.data)).catch(() => {})
  }, [])

  const load = () => {
    setLoading(true)
    adminGetHighlights().then(r => setHighlights(r.data.data)).catch(() => toast.error('Failed to load.')).finally(() => setLoading(false))
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    setPreviews(prev => [...prev, ...files.map(f => ({ file: f, url: URL.createObjectURL(f), type: f.type.startsWith('video/') ? 'video' : 'image', name: f.name }))])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) { toast.error('Title is required.'); return }
    if (!previews.length) { toast.error('Please select at least one file.'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('isPublished', form.isPublished)
      if (form.relatedEvent) fd.append('relatedEvent', form.relatedEvent)
      previews.forEach(p => fd.append('media', p.file))
      await adminCreateHighlight(fd)
      toast.success('Highlight published!')
      setForm({ title: '', description: '', relatedEvent: '', isPublished: true })
      setPreviews([])
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.')
    } finally { setUploading(false) }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try {
      await adminDeleteHighlight(id)
      toast.success('Deleted.')
      setHighlights(prev => prev.filter(h => h._id !== id))
    } catch { toast.error('Failed to delete.') }
    finally { setDeleting(null) }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Highlights</h1>
          <p className="font-sans text-sm text-gray-400 mt-0.5">Upload photos and videos from events</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-xs gap-1.5">
          <HiPlus size={16} /> Add Highlight
        </button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ scale:0.96, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96 }}
              className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <h2 className="font-serif text-xl text-gray-900">New Highlight</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700"><HiX size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="label">Title *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="e.g. Sunday Service — May 2025" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="input resize-none" placeholder="Brief caption…" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Link to Event (optional)</label>
                    <select value={form.relatedEvent} onChange={e => setForm({...form, relatedEvent: e.target.value})} className="input">
                      <option value="">None</option>
                      {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="w-4 h-4 accent-gray-900 rounded" />
                      <span className="font-sans text-sm text-gray-600">Publish immediately</span>
                    </label>
                  </div>
                </div>

                {/* Drop zone */}
                <div>
                  <label className="label">Photos & Videos *</label>
                  <div onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl p-8 text-center cursor-pointer transition-colors group">
                    <HiUpload size={24} className="text-gray-300 group-hover:text-gray-500 mx-auto mb-2 transition-colors" />
                    <p className="font-sans text-sm text-gray-400 group-hover:text-gray-600">Click to select images or videos</p>
                    <p className="font-sans text-xs text-gray-300 mt-1">JPG, PNG, WEBP, MP4, MOV — up to 100MB each</p>
                    <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFiles} />
                  </div>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {previews.map((p, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                          {p.type === 'video'
                            ? <div className="w-full h-full flex items-center justify-center bg-gray-100"><HiPlay size={20} className="text-gray-400" /></div>
                            : <img src={p.url} alt="" className="w-full h-full object-cover" />
                          }
                          <button type="button" onClick={() => setPreviews(prev => prev.filter((_,j) => j !== i))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <HiX size={10} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={uploading} className="btn-primary">
                    {uploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading…</> : 'Publish Highlight'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">{[...Array(6)].map((_,i) => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : highlights.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center">
          <HiPhotograph size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="font-serif text-xl text-gray-300 mb-6">No highlights yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-xs gap-1.5"><HiPlus size={14} />Add First Highlight</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map(h => (
            <div key={h._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm hover:border-gray-200 transition-all">
              <div className="relative h-44 bg-gray-100">
                {h.media?.[0] ? (
                  h.media[0].resourceType === 'video'
                    ? <div className="w-full h-full flex items-center justify-center relative">
                        <img src={h.media[0].thumbnailUrl || h.media[0].url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"><HiPlay size={18} className="text-gray-700 ml-0.5" /></div>
                        </div>
                      </div>
                    : <img src={h.media[0].url} alt={h.title} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center"><HiPhotograph size={32} className="text-gray-300" /></div>}
                <span className={`absolute top-2 left-2 badge text-xs border ${h.isPublished ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                  {h.isPublished ? 'Published' : 'Draft'}
                </span>
                {h.media?.length > 1 && <span className="absolute top-2 right-2 bg-black/50 text-white font-sans text-xs px-2 py-0.5 rounded-full">+{h.media.length}</span>}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-gray-900 text-sm mb-1 line-clamp-1">{h.title}</h3>
                {h.description && <p className="font-sans text-gray-400 text-xs leading-relaxed line-clamp-2 mb-2">{h.description}</p>}
                <div className="flex items-center justify-between mt-2">
                  <span className="font-sans text-xs text-gray-300">{format(new Date(h.createdAt), 'MMM d, yyyy')}</span>
                  <button onClick={() => handleDelete(h._id, h.title)} disabled={deleting === h._id}
                    className="flex items-center gap-1 font-sans text-xs text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40">
                    <HiTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
