'use client'
import { motion } from 'framer-motion'

const cases = [
  {
    tag: 'Humanitarian',
    title: 'Disaster Response',
    desc: 'First responders identify the hardest-hit areas within minutes of a disaster, optimizing rescue routes and resource deployment.',
    stat: '10x',
    statLabel: 'Faster than manual survey',
    bg: 'bg-[#0A0A0A]',
    textColor: 'text-white',
    tagColor: 'text-[#E8001D]',
    statColor: 'text-[#E8001D]',
  },
  {
    tag: 'Government',
    title: 'Infrastructure Audit',
    desc: 'Automatically assess damage to roads, bridges, and buildings across entire regions. No field teams required for initial triage.',
    stat: '1000s',
    statLabel: 'Buildings assessed per run',
    bg: 'bg-[#F2F2F2]',
    textColor: 'text-[#0A0A0A]',
    tagColor: 'text-[#E8001D]',
    statColor: 'text-[#0A0A0A]',
  },
  {
    tag: 'Insurance',
    title: 'Claims Processing',
    desc: 'Validate and prioritize insurance claims using objective satellite data. Reduce fraud and accelerate payouts to those in need.',
    stat: '95%',
    statLabel: 'Area coverage rate',
    bg: 'bg-[#E8001D]',
    textColor: 'text-white',
    tagColor: 'text-white/70',
    statColor: 'text-white',
  },
]

export default function UseCases() {
  return (
    <section id="use-cases" className="py-32 md:py-48 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-6 h-[2px] bg-[#E8001D]" />
            <span className="font-mono text-xs tracking-[0.4em] text-[#8A8A8A] uppercase">Applications</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(52px,8vw,110px)] leading-none tracking-wider"
          >
            USE <span className="text-[#E8001D]">CASES</span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className={`${c.bg} p-8 md:p-10 cursor-default`}
            >
              <div className={`font-mono text-xs tracking-[0.3em] uppercase mb-8 ${c.tagColor}`}>
                {c.tag}
              </div>
              <h3 className={`font-display text-4xl tracking-wider mb-4 ${c.textColor}`}>
                {c.title}
              </h3>
              <p className={`font-body text-sm leading-relaxed mb-12 ${
                c.bg === 'bg-[#F2F2F2]' ? 'text-[#8A8A8A]' : 'opacity-60'
              } ${c.textColor}`}>
                {c.desc}
              </p>
              <div className="border-t border-current opacity-10 mb-6" />
              <div className={`font-display text-6xl tracking-wider ${c.statColor}`}>{c.stat}</div>
              <div className={`font-mono text-xs tracking-widest uppercase mt-1 opacity-50 ${c.textColor}`}>
                {c.statLabel}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
