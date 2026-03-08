'use client'
import { motion } from 'framer-motion'

const classes = [
  { label: 'No Damage',     color: '#22C55E', pct: 72, val: '0' },
  { label: 'Minor Damage',  color: '#EAB308', pct: 14, val: '1' },
  { label: 'Major Damage',  color: '#F97316', pct: 8,  val: '2' },
  { label: 'Destroyed',     color: '#E8001D', pct: 4,  val: '3' },
  { label: 'Unclassified',  color: '#6B7280', pct: 2,  val: '4' },
]

const runs = [
  { name: 'Run 1 — Scratch CNN',         iou: 45.8, note: 'Baseline' },
  { name: 'Run 2 — ResNet34 aggressive', iou: 29.6, note: 'Unstable LR' },
  { name: 'Run 3 — ResNet34 gentle',     iou: 30.1, note: 'Better but slow' },
  { name: 'Run 4 — Swin Pretrained',     iou: 22.2, note: 'Too large for data' },
  { name: 'Run 5 — Scratch + Augment',   iou: 43.8, note: 'Current best ✓', current: true },
]

export default function ModelSection() {
  return (
    <section id="model" className="py-32 md:py-48 bg-[#F2F2F2]">
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
            <span className="font-mono text-xs tracking-[0.4em] text-[#8A8A8A] uppercase">Performance</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(52px,8vw,110px)] leading-none tracking-wider"
          >
            THE <span className="text-[#E8001D]">MODEL</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Damage class breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-10"
          >
            <h3 className="font-display text-3xl tracking-wider mb-2">DAMAGE CLASSES</h3>
            <p className="font-body text-sm text-[#8A8A8A] mb-8">xBD dataset distribution across 5 severity levels</p>
            <div className="space-y-5">
              {classes.map((c, i) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ background: c.color }} />
                      <span className="font-body text-sm text-[#0A0A0A]">{c.label}</span>
                      <span className="font-mono text-xs text-[#8A8A8A]">class {c.val}</span>
                    </div>
                    <span className="font-mono text-sm text-[#0A0A0A]">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#F2F2F2] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Training runs */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-10"
          >
            <h3 className="font-display text-3xl tracking-wider mb-2">TRAINING RUNS</h3>
            <p className="font-body text-sm text-[#8A8A8A] mb-8">Validation IoU across all experiments</p>
            <div className="space-y-4">
              {runs.map((run, i) => (
                <motion.div
                  key={run.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-4 border-l-2 ${run.current ? 'border-[#E8001D] bg-[#E8001D]/3' : 'border-[#F2F2F2]'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-body text-xs ${run.current ? 'text-[#0A0A0A] font-medium' : 'text-[#8A8A8A]'}`}>
                      {run.name}
                    </span>
                    <span className={`font-display text-2xl tracking-wider ${run.current ? 'text-[#E8001D]' : 'text-[#8A8A8A]'}`}>
                      {run.iou}%
                    </span>
                  </div>
                  <div className="h-1 bg-[#F2F2F2] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${run.iou}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: run.current ? '#E8001D' : '#D1D5DB' }}
                    />
                  </div>
                  <div className="font-mono text-[10px] text-[#8A8A8A] mt-1">{run.note}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Big metric */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-8 bg-[#0A0A0A] p-12 md:p-16 grid md:grid-cols-3 gap-10"
        >
          {[
            { val: '43.8%', label: 'Best Val IoU', sub: 'Epoch 25, Run 5' },
            { val: '0.274', label: 'Best Val Loss', sub: 'CrossEntropy + weights' },
            { val: '25', label: 'Training Epochs', sub: '~45 min on T4 GPU' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-t border-white/10 pt-6"
            >
              <div className="font-display text-6xl md:text-7xl text-white tracking-wider mb-2">{m.val}</div>
              <div className="font-body text-sm text-white/60 mb-1">{m.label}</div>
              <div className="font-mono text-xs text-white/25">{m.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
