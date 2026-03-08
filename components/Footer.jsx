'use client'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <>
      {/* CTA section */}
      <section id="open-tool" className="bg-[#0A0A0A] py-32 md:py-48 relative overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        {/* Red glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: '#E8001D' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-6 h-[2px] bg-[#E8001D]" />
            <span className="font-mono text-xs tracking-[0.4em] text-white/30 uppercase">Live Tool</span>
            <div className="w-6 h-[2px] bg-[#E8001D]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(52px,10vw,140px)] leading-none text-white tracking-wider mb-8"
          >
            TRY IT<br /><span className="text-[#E8001D]">NOW.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-white/40 max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Select any location. Pick your dates. Let the AI do the rest.
            No signup required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-4 bg-[#E8001D] text-white px-12 py-5 font-display text-2xl tracking-widest hover:bg-[#c0001a] transition-colors"
            >
              OPEN SENTINEL <span>→</span>
            </motion.a>
          </motion.div>

          {/* Tech stack pills */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-14"
          >
            {['PyTorch', 'FastAPI', 'Leaflet.js', 'NASA GIBS', 'xBD Dataset', 'Siamese U-Net'].map(t => (
              <span key={t} className="font-mono text-xs tracking-widest text-white/25 border border-white/10 px-4 py-2">
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display text-2xl tracking-widest text-white">
            SENT<span className="text-[#E8001D]">INEL</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {['How It Works', 'Model', 'Use Cases', 'GitHub'].map(l => (
              <a key={l} href="#"
                className="font-body text-xs tracking-widest text-white/30 hover:text-white transition-colors uppercase">
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8001D] animate-pulse" />
            <span className="font-mono text-xs text-white/20 tracking-wider">
              Built with PyTorch + xBD
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
