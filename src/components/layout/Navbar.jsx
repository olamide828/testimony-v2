import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import NProgress from 'nprogress'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/highlights', label: 'Highlights' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => { setOpen(false) }, [location])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleNav = (to) => {
    NProgress.start()
    navigate(to)
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {<Link to="/" className="flex flex-col leading-none ">
            <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-accent">NTA Worldwide</span>
            <span className="font-serif text-gray-900 text-lg font-semibold">Testimony Parish</span>
          </Link>}

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `font-sans text-sm transition-colors duration-150 ${
                    isActive ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'
                  }`
                }
              >{l.label}</NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => handleNav('/events')} className="btn-primary text-xs py-2 px-5">
              Join an Event
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-1 text-gray-600">
            {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} /> */}
          <div className="absolute top-0 right-0 bottom-0 w-[400px] bg-white shadow-2xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
              {/* <span className="font-serif text-gray-900 font-semibold">Menu</span> */}
              {/* <button onClick={() => setOpen(false)}><HiX size={20} className="text-gray-500" /></button> */}
            </div>
            <nav className="flex flex-col p-6 gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'}
                  className={({ isActive }) =>
                    `font-sans text-sm px-3 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >{l.label}</NavLink>
              ))}
            </nav>
            <div className="p-6 mt-auto border-t border-gray-100">
              <button onClick={() => handleNav('/events')} className="btn-primary w-full justify-center">
                Join an Event
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
