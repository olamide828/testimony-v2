import { motion } from 'framer-motion'
import { GiOpenBook } from 'react-icons/gi'
import { HiUserGroup, HiHeart, HiGlobe, HiSparkles, HiLightningBolt } from 'react-icons/hi'

const pillars = [
  { icon: GiOpenBook,      title: 'Word-Centred',        desc: 'Every sermon and study is anchored in the truth of Scripture.' },
  { icon: HiSparkles,      title: 'Spirit-Led',          desc: 'We cultivate genuine worship where the Holy Spirit moves freely.' },
  { icon: HiUserGroup,     title: 'Family First',        desc: 'Testimony Parish is a family. We do life together in every season.' },
  { icon: HiHeart,         title: 'Love in Action',      desc: 'Our faith is shown through service, care, and community outreach.' },
  { icon: HiLightningBolt, title: 'Healing & Restoration', desc: 'We believe in God\'s power to heal bodies and restore lives.' },
  { icon: HiGlobe,         title: 'Kingdom Impact',      desc: 'From Lagos to the nations — we carry the Gospel to every corner.' },
]

export default function Features() {
  return (
    <section className="py-24 bg-surface-soft border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="eyebrow mb-2">Our Foundation</p>
          <h2 className="section-heading max-w-sm">What We Stand For</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-border">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 hover:bg-surface-soft transition-colors group"
            >
              <p.icon className="text-brand-400 mb-4" size={22} />
              <h3 className="font-display text-lg text-ink mb-2">{p.title}</h3>
              <p className="font-body text-sm text-ink-muted leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
