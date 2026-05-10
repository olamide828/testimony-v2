import { useNavigate } from 'react-router-dom'
import NProgress from 'nprogress'
import PublicLayout from '../components/layout/PublicLayout'
import PageHero from '../components/ui/PageHero'
import { HiCheckCircle } from 'react-icons/hi'

const HERO = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=80'

export default function About() {
  const navigate = useNavigate()
  const go = (to) => { NProgress.start(); navigate(to) }

  return (
    <PublicLayout>
      <PageHero image={HERO} eyebrow="Who We Are" title="Our Story, Our Mission, Our Faith" />

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow mb-3">Our Purpose</p>
            <h2 className="section-heading mb-5">More Than a Church</h2>
            <p className="section-sub mb-5">
              Testimony Parish is a vibrant assembly under the New Testament Assembly Worldwide family of churches. We exist to glorify God, preach the undiluted Word, and build a community where every believer grows in faith, character, and purpose.
            </p>
            <p className="section-sub mb-8">
              Our name is our declaration — every life touched by God's grace is a testimony. We celebrate salvation, healing, restoration, and breakthrough as the normal Christian experience.
            </p>
            <ul className="space-y-3">
              {['Evangelism & Soul Winning', 'Discipleship & Spiritual Growth', 'Community Service & Outreach', 'Family & Youth Empowerment'].map(item => (
                <li key={item} className="flex items-center gap-3 font-sans text-sm text-gray-700">
                  <HiCheckCircle size={17} className="text-accent flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-10">
              <div className="text-center">
                <p className="font-serif text-7xl text-accent/20 mb-2">"</p>
                <p className="font-serif text-gray-700 text-xl italic leading-relaxed">
                  And they overcame him by the blood of the Lamb and by the word of their testimony.
                </p>
                <p className="font-sans text-sm text-accent font-semibold mt-4 tracking-widest uppercase">Revelation 12:11</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Our Convictions</p>
            <h2 className="section-heading">What drives us forward</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Our Vision', text: "To be a city set on a hill — a glorious expression of Christ's church in Lagos and beyond, impacting every sphere of society with Kingdom values." },
              { label: 'Our Mission', text: 'To win souls, make disciples, build godly families, and transform communities through the power of the Holy Spirit and the Word of God.' },
              { label: 'Our Values', text: 'Integrity. Excellence. Love. Faith. Prayer. Community. We pursue these not as programs but as the fabric of who we are.' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-sm transition-all">
                <p className="eyebrow mb-4">{item.label}</p>
                <p className="font-sans text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service times */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="eyebrow mb-3">Join Us</p>
          <h2 className="section-heading mb-12">Service Times</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[['Sunday Service', '8:00 AM & 10:30 AM'], ['Bible Study', 'Wednesdays\n6:00 PM'], ['Prayer Meeting', 'Fridays\n6:00 PM'], ['Youth Service', 'Saturdays\n4:00 PM']].map(([name, time]) => (
              <div key={name} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="font-serif text-gray-900 text-base mb-1">{name}</p>
                <p className="font-sans text-accent text-sm whitespace-pre-line">{time}</p>
              </div>
            ))}
          </div>
          <button onClick={() => go('/contact')} className="btn-primary mt-10">Get in Touch</button>
        </div>
      </section>
    </PublicLayout>
  )
}
