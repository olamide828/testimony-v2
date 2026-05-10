import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-accent mb-1">NTA Worldwide</p>
          <h3 className="font-serif text-2xl text-white mb-4">Testimony Parish</h3>
          <p className="font-sans text-gray-400 text-sm leading-relaxed max-w-xs">
            A community of faith, hope, and love — where every life becomes a testimony of God's grace.
          </p>
          <div className="flex gap-3 mt-6">
            {[FaFacebookF, FaInstagram, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-gray-500 mb-5">Pages</p>
          <ul className="space-y-3">
            {[['/', 'Home'], ['/about', 'About'], ['/events', 'Events'], ['/highlights', 'Highlights'], ['/contact', 'Contact'], ['/verify', 'Verify Registration']].map(([to, label]) => (
              <li key={to}><Link to={to} className="font-sans text-sm text-gray-400 hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-gray-500 mb-5">Service Times</p>
          <ul className="space-y-4">
            {[['Sunday Service', '8:00 AM & 10:30 AM'], ['Bible Study', 'Wednesdays, 6 PM'], ['Prayer Meeting', 'Fridays, 6 PM']].map(([d, t]) => (
              <li key={d}>
                <p className="font-sans text-sm text-white">{d}</p>
                <p className="font-sans text-xs text-gray-500 mt-0.5">{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-gray-500">© {new Date().getFullYear()} Testimony Parish — NTA Worldwide</p>
          <Link to="/admin/login" className="font-sans text-xs text-gray-600 hover:text-gray-400 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
