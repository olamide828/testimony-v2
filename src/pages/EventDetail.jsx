import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEvent, registerForEvent } from '../utils/api'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import NProgress from 'nprogress'
import { HiCalendar, HiLocationMarker, HiClock, HiArrowLeft, HiCheckCircle, HiUsers } from 'react-icons/hi'
import PublicLayout from '../components/layout/PublicLayout'
import { motion } from 'framer-motion'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  useEffect(() => {
    getEvent(id).then(r => setEvent(r.data.data)).catch(() => toast.error('Event not found.')).finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const res = await registerForEvent(id, data)
      setCode(res.data.data.confirmationCode)
      setRegistered(true)
      reset()
      toast.success('Registered successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const goBack = () => { NProgress.start(); navigate('/events') }

  if (loading) return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    </PublicLayout>
  )

  if (!event) return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center font-sans text-gray-400">Event not found.</div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className="pt-24 pb-16">
        {/* Hero image */}
        {event.imageUrl && (
          <div className="w-full h-56 md:h-80 overflow-hidden">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 mt-8">
          <button onClick={goBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors mb-8 group">
            <HiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" /> Back to Events
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left */}
            <div className="lg:col-span-3">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="badge bg-gray-100 text-gray-600 text-xs">{event.category}</span>
                {event.isFeatured && <span className="badge bg-accent text-white text-xs">Featured</span>}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-gray-900 leading-tight mb-6">{event.title}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-5 bg-gray-50 rounded-2xl">
                {[
                  [HiCalendar, 'Date', format(new Date(event.date), 'EEEE, MMMM d, yyyy')],
                  [HiClock, 'Time', event.time],
                  [HiLocationMarker, 'Location', event.location],
                  ...(event.capacity ? [[HiUsers, 'Capacity', `${event.registrationCount || 0} / ${event.capacity} registered`]] : []),
                ].map(([Icon, label, val]) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={14} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="font-sans text-sm text-gray-900 font-medium mt-0.5">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="prose prose-sm max-w-none">
                <h2 className="font-serif text-xl text-gray-900 mb-3">About this Event</h2>
                <p className="font-sans text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>

            {/* Registration card */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h2 className="font-serif text-xl text-gray-900">Register for this Event</h2>
                  <p className="font-sans text-sm text-gray-400 mt-1">Secure your spot below.</p>
                </div>

                {registered ? (
                  <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
                      <HiCheckCircle size={28} className="text-green-500" />
                    </div>
                    <h3 className="font-serif text-xl text-gray-900 mb-2">You're registered!</h3>
                    <p className="font-sans text-sm text-gray-500 mb-6">We look forward to seeing you. God bless you!</p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <p className="font-sans text-xs text-gray-400 mb-1.5 tracking-widest uppercase">Your Confirmation Code</p>
                      <p className="font-serif text-2xl text-gray-900 font-medium tracking-widest">{code}</p>
                      <p className="font-sans text-xs text-gray-400 mt-2">Save this code — you'll need it at the event.</p>
                    </div>
                    <button onClick={() => setRegistered(false)} className="btn-secondary w-full justify-center text-xs">
                      Register Another Person
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {event.isFull && (
                      <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-sans p-3 rounded-xl text-center">
                        This event is fully booked.
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">First Name *</label>
                        <input {...register('firstName', { required: true })} className="input" placeholder="John" />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">Required</p>}
                      </div>
                      <div>
                        <label className="label">Last Name *</label>
                        <input {...register('lastName', { required: true })} className="input" placeholder="Doe" />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">Required</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} type="email" className="input" placeholder="john@example.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input {...register('phone')} type="tel" className="input" placeholder="+234 xxx xxx xxxx" />
                    </div>
                    <div>
                      <label className="label">Number of Guests</label>
                      <select {...register('numberOfGuests')} className="input">
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?'person':'people'}</option>)}
                      </select>
                    </div>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input {...register('isMember')} type="checkbox" className="w-4 h-4 accent-gray-900 rounded" />
                      <span className="font-sans text-sm text-gray-600">I am a church member</span>
                    </label>
                    <div>
                      <label className="label">Notes (optional)</label>
                      <textarea {...register('notes')} rows={2} className="input resize-none" placeholder="Any special requirements…" />
                    </div>
                    <button type="submit" disabled={submitting || event.isFull} className="btn-primary w-full justify-center">
                      {submitting
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Registering…</>
                        : 'Register Now'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
