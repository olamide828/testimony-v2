import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'

// Replace this URL with your actual church hero image
const HERO_IMAGE = 'https://images.unsplash.com/photo-1438232992991-995b671e5784?w=1800&auto=format&fit=crop&q=80'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Testimony Parish Worship"
          className="w-full h-full object-cover"
        />
        {/* Overlay — light on right, darker on left for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <p className="eyebrow mb-4">New Testament Assembly Worldwide</p>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.05] mb-5">
            Welcome to<br />
            <span className="italic text-brand-600">Testimony</span>
            <br />Parish
          </h1>

          <div className="w-8 h-px bg-brand-400 mb-5" />

          <p className="font-body text-ink-muted text-base md:text-lg leading-relaxed mb-8 max-w-md">
            A community of faith, hope, and love — where every life becomes a testimony of God's grace.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/events" className="btn-primary gap-2 group">
              Upcoming Events
              <HiArrowRight className="group-hover:translate-x-0.5 transition-transform" size={16} />
            </Link>
            <Link to="/about" className="btn-outline">
              Our Story
            </Link>
          </div>

          {/* Service time hint */}
          <div className="mt-10 flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-400" />
            <div>
              <p className="font-body text-xs text-ink-muted uppercase tracking-widest">Sunday Services</p>
              <p className="font-body text-sm text-ink font-medium">8:00 AM &amp; 10:30 AM</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-ink-faint to-transparent"
        />
      </motion.div>
    </section>
  )
}
