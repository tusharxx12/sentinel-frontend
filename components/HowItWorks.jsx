'use client'
import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Select Location',
    desc: 'Click any point on the interactive map. Works anywhere on Earth with satellite coverage.',
    icon: '🗺',
  },
  {
    num: '02',
    title: 'Fetch Imagery',
    desc: 'NASA GIBS satellite tiles are fetched for your before and after dates automatically.',
    icon: '🛰',
  },
  {
    num: '03',
    title: 'AI Analysis',
    desc: 'Our Siamese U-Net compares pre and post-event imagery pixel by pixel at 256×256 resolution.',
    icon: '⚡',
  },
  {
    num: '04',
    title: 'Damage Map',
    desc: 'Results overlaid on map — 5 classes from no damage to destroyed, with pixel-level precision.',
    icon: '📊',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 md:py-48 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-6 h-[2px] bg-[#E8001D]" />
            <span className="font-mono text-xs tracking-[0.4em] text-[#8A8A8A] uppercase">Process</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(52px,8vw,110px)] leading-none text-[#0A0A0A] tracking-wider"
          >
            HOW IT<br /><span className="text-[#E8001D]">WORKS</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-t-2 border-[#0A0A0A]/10 pt-8 pr-8 pb-8 hover:border-[#E8001D] transition-colors duration-300 group"
            >
              <div className="font-display text-7xl text-[#0A0A0A]/5 group-hover:text-[#E8001D]/10 transition-colors leading-none mb-6">
                {step.num}
              </div>
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3 className="font-display text-2xl tracking-wider text-[#0A0A0A] mb-3">{step.title}</h3>
              <p className="font-body text-sm text-[#8A8A8A] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 bg-[#0A0A0A] p-8 md:p-12"
        >
          <div className="font-mono text-xs tracking-[0.3em] text-white/30 uppercase mb-8">
            // Model Architecture
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {[
              { label: 'PRE IMAGE', color: 'bg-white/10 text-white/60' },
              { label: '→', color: 'text-[#E8001D] text-xl' },
              { label: 'SIAMESE ENCODER', color: 'bg-[#E8001D]/20 text-[#E8001D]' },
              { label: '→', color: 'text-[#E8001D] text-xl' },
              { label: '|Δ FEATURES|', color: 'bg-white/5 text-white/60' },
              { label: '→', color: 'text-[#E8001D] text-xl' },
              { label: 'U-NET DECODER', color: 'bg-[#E8001D]/20 text-[#E8001D]' },
              { label: '→', color: 'text-[#E8001D] text-xl' },
              { label: 'DAMAGE MASK', color: 'bg-white/10 text-white' },
            ].map((item, i) => (
              <div key={i} className={`font-mono text-xs tracking-widest px-3 py-2 ${item.color}`}>
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {[
              { label: 'POST IMAGE', color: 'bg-white/10 text-white/60' },
              { label: '→', color: 'text-[#E8001D] text-xl' },
              { label: 'SHARED WEIGHTS', color: 'bg-white/5 text-white/40' },
            ].map((item, i) => (
              <div key={i} className={`font-mono text-xs tracking-widest px-3 py-2 ${item.color}`}>
                {item.label}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Architecture', val: 'Siamese U-Net' },
              { label: 'Input Size', val: '256 × 256px' },
              { label: 'Output', val: '5-class mask' },
              { label: 'Framework', val: 'PyTorch' },
            ].map(item => (
              <div key={item.label}>
                <div className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-1">{item.label}</div>
                <div className="font-mono text-sm text-white/70">{item.val}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
