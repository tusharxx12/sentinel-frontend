'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = ['DISASTERS.', 'DAMAGE.', 'BUILDINGS.', 'CITIES.', 'CRISES.']

function AnimatedWord({ words, currentIdx }) {
  return (
    <div className="relative overflow-hidden" style={{ height: 'clamp(72px,14vw,200px)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <span className="font-display text-[clamp(72px,14vw,200px)] leading-none text-[#E8001D] tracking-wider">
            {words[currentIdx]}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-[3px] bg-[#E8001D] origin-left"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-2 h-2 bg-[#E8001D] rounded-full animate-pulse" />
          <span className="font-mono text-xs tracking-[0.4em] text-white/50 uppercase">AI · Satellite · Real-Time</span>
        </motion.div>
        <div className="mb-4 overflow-hidden">
          <motion.h1
            initial={{ y: 120 }} animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display text-[clamp(72px,14vw,200px)] leading-none text-white tracking-wider"
          >SEE THE</motion.h1>
        </div>
        <div className="mb-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <AnimatedWord words={WORDS} currentIdx={wordIdx} />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="font-body text-lg md:text-xl text-white/40 max-w-lg leading-relaxed mb-14"
        >
          Siamese neural network trained on 2,799 satellite image pairs.
          Detect infrastructure damage in seconds — not days.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-wrap gap-4 mb-20"
        >
          <motion.a href="#open-tool" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 bg-[#E8001D] text-white px-10 py-4 font-body text-sm tracking-widest uppercase font-medium hover:bg-[#c0001a] transition-colors">
            Open Tool <span>→</span>
          </motion.a>
          <motion.a href="#how-it-works" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 border border-white/20 text-white/70 px-10 py-4 font-body text-sm tracking-widest uppercase hover:border-white/50 hover:text-white transition-all">
            How It Works
          </motion.a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-white/10 pt-10"
        >
          {[
            { val: '2,799', label: 'Training Pairs' },
            { val: '43.8%', label: 'Validation IoU' },
            { val: '7.7M',  label: 'Parameters' },
            { val: '5',     label: 'Damage Classes' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
              className="pr-8 md:border-r border-white/10 last:border-0 mb-6 md:mb-0"
            >
              <div className="font-display text-4xl md:text-5xl text-white tracking-wider mb-1">{s.val}</div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
    </section>
  )
}
