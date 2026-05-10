export default function PageHero({ eyebrow, title, subtitle, image, children }) {
  return (
    <section className="relative pt-16 overflow-hidden">
      {/* Hero image */}
      {image && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-white" />
        </div>
      )}
      {!image && <div className="absolute inset-0 bg-gray-50 z-0" />}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        {eyebrow && <p className={`eyebrow mb-3 ${image ? 'text-white/70' : ''}`}>{eyebrow}</p>}
        <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl leading-tight max-w-2xl ${image ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`font-sans text-lg mt-4 max-w-xl leading-relaxed ${image ? 'text-white/70' : 'text-gray-500'}`}>
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
