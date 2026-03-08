'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#FAFAFA]/90 backdrop-blur-md border-b border-black/8' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <a href="#" className="font-display text-2xl tracking-widest text-[#0A0A0A]">
            SENT<span className="text-[#E8001D]">INEL</span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {['How It Works', 'Model', 'Use Cases', 'Open Tool'].map((l) => (
              <motion.a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                whileHover={{ y: -1 }}
                className={`font-body text-sm tracking-wide transition-colors duration-200 ${
                  l === 'Open Tool'
                    ? 'bg-[#E8001D] text-white px-5 py-2 hover:bg-[#c0001a]'
                    : 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
                }`}
              >
                {l}
              </motion.a>
            ))}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <div className="w-6 flex flex-col gap-1.5">
              <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }} className="block h-[1.5px] bg-black" />
              <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-[1.5px] bg-black" />
              <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }} className="block h-[1.5px] bg-black" />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-10"
          >
            {['How It Works', 'Model', 'Use Cases', 'Open Tool'].map((l, i) => (
              <motion.a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="font-display text-5xl tracking-widest text-black"
                onClick={() => setOpen(false)}
              >
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
