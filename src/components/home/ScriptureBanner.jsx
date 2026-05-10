import { motion } from 'framer-motion'

export default function ScriptureBanner() {
  return (
    <section className="py-20 bg-ink">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-[10px] text-brand-400 uppercase tracking-[0.25em] mb-6">This Week's Verse</p>
          <blockquote className="font-display text-white text-2xl md:text-3xl lg:text-4xl leading-relaxed italic mb-6">
            "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."
          </blockquote>
          <div className="w-8 h-px bg-brand-400 mx-auto mb-4" />
          <cite className="font-body text-brand-400 text-xs tracking-widest uppercase not-italic">
            Jeremiah 29:11
          </cite>
        </motion.div>
      </div>
    </section>
  )
}
