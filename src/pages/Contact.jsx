import { useState } from 'react'
import { toast } from 'sonner'
import PublicLayout from '../components/layout/PublicLayout'
import PageHero from '../components/ui/PageHero'
import { HiLocationMarker, HiPhone, HiMail, HiClock } from 'react-icons/hi'
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'

const HERO = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill in all required fields.'); return }
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Message sent! We\'ll get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <PublicLayout>
      <PageHero image={HERO} eyebrow="Reach Out" title="Contact Us"
        subtitle="We'd love to hear from you — questions, prayer requests, or just wanting to connect." />

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-14">

        {/* Info */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <p className="font-sans text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5">Find Us</p>
            <div className="space-y-5">
              {[
                [HiLocationMarker, 'Address', 'New Testament Assembly Worldwide,\nTestimony Parish, Lagos, Nigeria'],
                [HiPhone, 'Phone', '+234 000 000 0000'],
                [HiMail, 'Email', 'info@testimonyparish.org'],
              ].map(([Icon, label, value]) => (
                <div key={label} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="font-sans text-sm text-gray-700 whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5">Service Times</p>
            <div className="space-y-3">
              {[['Sunday Service', '8:00 AM & 10:30 AM'], ['Bible Study', 'Wednesdays, 6:00 PM'], ['Prayer Meeting', 'Fridays, 6:00 PM'], ['Youth Service', 'Saturdays, 4:00 PM']].map(([d, t]) => (
                <div key={d} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                  <HiClock size={13} className="text-accent flex-shrink-0" />
                  <span className="font-sans text-sm text-gray-700 flex-1">{d}</span>
                  <span className="font-sans text-sm text-accent font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Social Media</p>
            <div className="flex gap-3">
              {[[FaFacebookF, 'Facebook'], [FaInstagram, 'Instagram'], [FaYoutube, 'YouTube'], [FaWhatsapp, 'WhatsApp']].map(([Icon, label]) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-colors">
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h2 className="font-serif text-2xl text-gray-900 mb-1">Send a Message</h2>
            <p className="font-sans text-sm text-gray-400 mb-8">We typically respond within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Full Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="John Doe" />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="label">Subject</label>
                <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input" placeholder="How can we help?" />
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={6} className="input resize-none" placeholder="Your message, prayer request, or question…" />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto justify-center">
                {sending
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                  : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
