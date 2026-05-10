import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { adminCreateEvent, adminUpdateEvent, adminGetEvents } from '../../utils/api'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import NProgress from 'nprogress'
import { HiArrowLeft } from 'react-icons/hi'

const CATS = ['Sunday Service','Prayer Meeting','Bible Study','Youth Program','Special Event','Conference','Outreach','Other']

export default function AdminEventForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [preview, setPreview] = useState(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { category: 'Special Event', registrationRequired: true, isPublished: true, isFeatured: false }
  })

  const imageUrl = watch('imageUrl')
  useEffect(() => { if (imageUrl) setPreview(imageUrl) }, [imageUrl])

  useEffect(() => {
    if (!isEdit) return
    adminGetEvents()
      .then(r => {
        const ev = r.data.data.find(e => e._id === id)
        if (ev) {
          reset({ ...ev, date: ev.date?.slice(0,10) || '', endDate: ev.endDate?.slice(0,10) || '', registrationDeadline: ev.registrationDeadline?.slice(0,16) || '' })
          if (ev.imageUrl) setPreview(ev.imageUrl)
        }
      })
      .catch(() => toast.error('Failed to load event.'))
      .finally(() => setFetching(false))
  }, [id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = { ...data, capacity: data.capacity ? Number(data.capacity) : null }
      if (isEdit) { await adminUpdateEvent(id, payload); toast.success('Event updated.') }
      else { await adminCreateEvent(payload); toast.success('Event created!') }
      NProgress.start()
      navigate('/admin/events')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event.')
    } finally { setLoading(false) }
  }

  if (fetching) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/events" className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
          <HiArrowLeft size={17} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-gray-900">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
          <p className="font-sans text-sm text-gray-400">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <h2 className="font-serif text-lg text-gray-900 pb-3 border-b border-gray-50">Event Details</h2>
          <div>
            <label className="label">Title *</label>
            <input {...register('title', { required: 'Title is required' })} className="input" placeholder="e.g. Annual Thanksgiving Service" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea {...register('description', { required: 'Description is required' })} rows={4} className="input resize-none" placeholder="Describe the event…" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select {...register('category')} className="input">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Image URL (optional)</label>
              <input {...register('imageUrl')} className="input" placeholder="https://…" />
            </div>
          </div>
          {preview && (
            <div className="rounded-xl overflow-hidden h-32 bg-gray-100">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview(null)} />
            </div>
          )}
        </div>

        {/* Date & Location */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <h2 className="font-serif text-lg text-gray-900 pb-3 border-b border-gray-50">Date & Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Event Date *</label>
              <input type="date" {...register('date', { required: 'Date is required' })} className="input" />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="label">End Date (optional)</label>
              <input type="date" {...register('endDate')} className="input" />
            </div>
            <div>
              <label className="label">Time *</label>
              <input {...register('time', { required: 'Time is required' })} className="input" placeholder="e.g. 10:00 AM" />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
            </div>
            <div>
              <label className="label">Location *</label>
              <input {...register('location', { required: 'Location is required' })} className="input" placeholder="Church auditorium / venue" />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>
          </div>
        </div>

        {/* Registration Settings */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <h2 className="font-serif text-lg text-gray-900 pb-3 border-b border-gray-50">Registration Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Capacity (blank = unlimited)</label>
              <input type="number" {...register('capacity')} className="input" placeholder="e.g. 200" min="1" />
            </div>
            <div>
              <label className="label">Registration Deadline</label>
              <input type="datetime-local" {...register('registrationDeadline')} className="input" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { name: 'registrationRequired', label: 'Registration Required' },
              { name: 'isPublished', label: 'Published (visible to public)' },
              { name: 'isFeatured', label: 'Featured on Homepage' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" {...register(name)} className="w-4 h-4 accent-gray-900 rounded" />
                <span className="font-sans text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{isEdit ? 'Saving…' : 'Creating…'}</> : isEdit ? 'Update Event' : 'Create Event'}
          </button>
          <Link to="/admin/events" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
