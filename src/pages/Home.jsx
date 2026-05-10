import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEvents } from "../utils/api";
import { format } from "date-fns";
import NProgress from "nprogress";
import PublicLayout from "../components/layout/PublicLayout";
import {
  HiArrowRight,
  HiCalendar,
  HiLocationMarker,
  HiClock,
  HiArrowNarrowRight,
} from "react-icons/hi";
import { GiOpenBook } from "react-icons/gi";
import { FiHeart, FiUsers, FiGlobe } from "react-icons/fi";

const HERO_IMG =
  "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2h1cmNofGVufDB8fDB8fHww";

const pillars = [
  {
    icon: GiOpenBook,
    title: "Word-Centred",
    desc: "Every sermon rooted in the truth of Scripture. We believe God's Word is living and active.",
  },
  {
    icon: FiHeart,
    title: "Spirit-Led Worship",
    desc: "An atmosphere where the Holy Spirit moves freely and transforms hearts through genuine praise.",
  },
  {
    icon: FiUsers,
    title: "Family & Community",
    desc: "More than a church — a family. We do life together through every season and circumstance.",
  },
  {
    icon: FiGlobe,
    title: "Kingdom Impact",
    desc: "From Lagos to the nations. Carrying the Gospel of Jesus Christ to every corner of the earth.",
  },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [evLoading, setEvLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents({ featured: true })
      .then((r) => {
        const data = r.data.data.slice(0, 3);
        if (data.length === 0 && !showAll) {
          getEvents()
            .then((r2) => setEvents(r2.data.data.slice(0, 3)))
            .finally(() => setEvLoading(false));
        } else {
          setEvents(data);
          setEvLoading(false);
        }
      })
      .catch(() => setEvLoading(false));
  }, []);

  const go = (to) => {
    NProgress.start();
    navigate(to);
  };

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Church worship"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 pt-40">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">
            New Testament Assembly Worldwide
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-[1.05] max-w-2xl mb-6">
            Welcome to
            <br />
            <em className="text-accent not-italic">Testimony Parish</em>
          </h1>
          <p className="font-sans text-white/60 text-lg max-w-md leading-relaxed mb-10">
            A community of faith, hope, and love in the heart of Ogun — where
            every life becomes a testimony.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => go("/events")} className="btn-accent gap-2">
              Upcoming Events <HiArrowRight />
            </button>
            <button
              onClick={() => go("/about")}
              className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-white animate-pulse" />
        </div>
      </section>

      {/* ── SCRIPTURE STRIP ── */}
      <section className="bg-accent/10 border-y border-accent/20 py-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-serif text-xl text-gray-800 italic leading-relaxed">
            "And they overcame him by the blood of the Lamb and by the word of
            their testimony."
          </p>
          <p className="font-sans text-sm text-accent font-semibold mt-3 tracking-widest uppercase">
            Revelation 12:11
          </p>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-14">
            <p className="eyebrow mb-3">What We Stand For</p>
            <h2 className="section-heading">
              Built on an unshakeable foundation
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-accent/10 flex items-center justify-center mb-5 transition-colors">
                  <p.icon
                    size={20}
                    className="text-gray-600 group-hover:text-accent transition-colors"
                  />
                </div>
                <h3 className="font-serif text-gray-900 text-lg mb-2">
                  {p.title}
                </h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="eyebrow mb-3">What's Coming</p>
              <h2 className="section-heading">Upcoming Events</h2>
            </div>
            <button
              onClick={() => go("/events")}
              className="flex items-center gap-1.5 font-sans text-sm text-gray-500 hover:text-gray-900 transition-colors group"
            >
              View all events{" "}
              <HiArrowNarrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {evLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <HiCalendar size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="font-serif text-xl text-gray-400 mb-2">
                No events scheduled yet
              </p>
              <p className="font-sans text-sm text-gray-400">
                Check back soon for upcoming programmes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev) => (
                <button
                  key={ev._id}
                  onClick={() => go(`/events/${ev._id}`)}
                  className="card text-left group cursor-pointer w-full"
                >
                  <div className="h-44 bg-gray-100 relative overflow-hidden">
                    {ev.imageUrl ? (
                      <img
                        src={ev.imageUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <HiCalendar size={32} className="text-gray-300" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 badge bg-white text-gray-700 text-xs shadow-sm">
                      {ev.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-gray-900 text-base leading-snug mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                      {ev.title}
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-sans">
                        <HiCalendar
                          size={12}
                          className="text-accent flex-shrink-0"
                        />
                        {format(new Date(ev.date), "EEE, MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-sans">
                        <HiClock
                          size={12}
                          className="text-accent flex-shrink-0"
                        />
                        {ev.time}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-sans">
                        <HiLocationMarker
                          size={12}
                          className="text-accent flex-shrink-0"
                        />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="eyebrow text-white/40 mb-4">You Belong Here</p>
          <h2 className="font-serif text-4xl text-white mb-5 leading-tight">
            Ready to join our family?
          </h2>
          <p className="font-sans text-gray-400 text-base mb-10 leading-relaxed">
            Whether you're exploring faith for the first time or looking for a
            spiritual home — we welcome you with open arms.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => go("/contact")} className="btn-accent">
              Get in Touch
            </button>
            <button
              onClick={() => go("/highlights")}
              className="btn-secondary bg-white/10 border-white/10 text-white hover:bg-white/20"
            >
              View Highlights
            </button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
