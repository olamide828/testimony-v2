import { useState } from 'react'
import { verifyCode } from '../utils/api'
import { format } from 'date-fns'
import PublicLayout from '../components/layout/PublicLayout'
import PageHero from '../components/ui/PageHero'
import { HiCheckCircle, HiXCircle, HiCalendar, HiClock, HiLocationMarker, HiSearch } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'

const HERO = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80'

export default function VerifyCode() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await verifyCode(code.trim().toUpperCase())
      setResult(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'No registration found for this code.')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = {
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <PublicLayout>
      <PageHero
        image={HERO}
        eyebrow="Registration Lookup"
        title="Verify Your Registration"
        subtitle="Enter your confirmation code to view your registration details."
      />

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Search box */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="font-serif text-xl text-gray-900 mb-1">Enter Confirmation Code</h2>
          <p className="font-sans text-sm text-gray-400 mb-6">
            Your code was shown after registration and looks like: <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">TP-XXXXXX-XXXX</span>
          </p>
          <form onSubmit={handleVerify} className="flex gap-3">
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="TP-XXXXXX-XXXX"
              className="input flex-1 font-mono uppercase tracking-widest"
              maxLength={20}
            />
            <button type="submit" disabled={loading || !code.trim()} className="btn-primary whitespace-nowrap">
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><HiSearch size={16} /> Verify</>
              }
            </button>
          </form>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-5 mb-6"
            >
              <HiXCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans font-medium text-red-700 text-sm">Registration not found</p>
                <p className="font-sans text-red-500 text-sm mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-green-50 border-b border-green-100 p-6 flex items-start gap-4">
                <HiCheckCircle size={28} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans font-semibold text-green-800">Registration Confirmed</p>
                  <p className="font-mono text-green-600 text-sm mt-0.5 tracking-widest">{result.confirmationCode}</p>
                </div>
                <span className={`ml-auto badge border text-xs capitalize ${statusColor[result.status]}`}>
                  {result.status}
                </span>
              </div>

              {/* Registrant details */}
              <div className="p-6 border-b border-gray-50">
                <p className="font-sans text-xs text-gray-400 uppercase tracking-widest mb-4">Registrant Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-xs text-gray-400">Full Name</p>
                    <p className="font-sans text-sm font-medium text-gray-900 mt-0.5">{result.name}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-gray-400">Email</p>
                    <p className="font-sans text-sm font-medium text-gray-900 mt-0.5 truncate">{result.email}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-gray-400">Number of Guests</p>
                    <p className="font-sans text-sm font-medium text-gray-900 mt-0.5">{result.numberOfGuests}</p>
                  </div>
                </div>
              </div>

              {/* Event details */}
              {result.event && (
                <div className="p-6">
                  <p className="font-sans text-xs text-gray-400 uppercase tracking-widest mb-4">Event Details</p>
                  <h3 className="font-serif text-lg text-gray-900 mb-4">{result.event.title}</h3>
                  <div className="space-y-3">
                    {[
                      [HiCalendar, format(new Date(result.event.date), 'EEEE, MMMM d, yyyy')],
                      [HiClock, result.event.time],
                      [HiLocationMarker, result.event.location],
                    ].map(([Icon, text], i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-sans text-gray-600">
                        <Icon size={15} className="text-accent flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                  {result.event.imageUrl && (
                    <div className="mt-5 rounded-xl overflow-hidden h-32">
                      <img src={result.event.imageUrl} alt={result.event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PublicLayout>
  )
}
