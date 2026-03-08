'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = 'https://web-production-81c93.up.railway.app'

const CITIES = [
  { name: 'Aleppo',   lat: 36.2021, lon: 37.1343 },
  { name: 'Mosul',    lat: 36.3350, lon: 43.1189 },
  { name: 'Mariupol', lat: 47.0971, lon: 37.5494 },
  { name: 'Kahramanmaraş', lat: 37.5858, lon: 36.9371 },
  { name: 'Beirut',   lat: 33.8938, lon: 35.5018 },
  { name: 'Kyiv',     lat: 50.4501, lon: 30.5234 },
]

function LogLine({ text, type }) {
  const colors = { ok: 'text-green-300', err: 'text-red-400', info: 'text-blue-300', '': 'text-white/70' }
  return (
    <div className={`font-mono text-[10px] leading-5 ${colors[type] || 'text-white/50'}`}>
      {text}
    </div>
  )
}

function StatCard({ label, value, pct, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-black/8 p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
        <span className="font-mono text-[10px] tracking-widest text-black/40 uppercase">{label}</span>
      </div>
      <div className="font-display text-4xl tracking-wider text-black leading-none mb-2">{value}%</div>
      <div className="h-1 bg-black/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay + 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </motion.div>
  )
}

export default function ToolClient() {
  const mapRef      = useRef(null)
  const leafletRef  = useRef(null)
  const markerRef   = useRef(null)
  const overlayRef  = useRef(null)
  const nasaRef     = useRef(null)

  const [logs,        setLogs]        = useState([])
  const [status,      setStatus]      = useState('idle') // idle | fetching | analyzing | done | error
  const [selectedPos, setSelectedPos] = useState(null)
  const [preDate,     setPreDate]     = useState('2023-01-01')
  const [postDate,    setPostDate]    = useState('2023-06-01')
  const [stats,       setStats]       = useState(null)
  const [maskB64,     setMaskB64]     = useState(null)
  const [preThumb,    setPreThumb]    = useState(null)
  const [postThumb,   setPostThumb]   = useState(null)
  const [searchVal,   setSearchVal]   = useState('')
  const [apiOk,       setApiOk]       = useState(false)

  const log = useCallback((text, type = '') => {
    const time = new Date().toTimeString().slice(0, 8)
    setLogs(prev => [...prev.slice(-40), { text: `[${time}] ${text}`, type }])
  }, [])

  // ── Init map ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || leafletRef.current) return

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap()
    document.head.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
  }, [])

  function initMap() {
    if (!mapRef.current || leafletRef.current) return
    const L   = window.L
    const map = L.map(mapRef.current, { zoomControl: false }).setView([25, 30], 3)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB', subdomains: 'abcd', maxZoom: 18
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    map.on('click', e => {
      const { lat, lng } = e.latlng
      setSelectedPos({ lat, lon: lng })

      if (markerRef.current) map.removeLayer(markerRef.current)
      markerRef.current = L.circleMarker([lat, lng], {
        radius: 8, color: '#E8001D', weight: 2,
        fillColor: '#E8001D', fillOpacity: 0.3
      }).addTo(map)

      log(`Target: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'info')
    })

    leafletRef.current = map
    log('Map initialized', 'ok')

    // Test API
    fetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(d => {
        setApiOk(true)
        log(`API online [${d.device}] — model ${d.model}`, 'ok')
      })
      .catch(() => log('API unreachable', 'err'))
  }

  // ── Fly to city ───────────────────────────────────
  function flyTo(city) {
    if (!leafletRef.current) return
    leafletRef.current.flyTo([city.lat, city.lon], 13, { duration: 1.5 })
    setSelectedPos({ lat: city.lat, lon: city.lon })
    const L = window.L
    if (markerRef.current) leafletRef.current.removeLayer(markerRef.current)
    markerRef.current = L.circleMarker([city.lat, city.lon], {
      radius: 8, color: '#E8001D', weight: 2,
      fillColor: '#E8001D', fillOpacity: 0.3
    }).addTo(leafletRef.current)
    log(`Flew to ${city.name}`, 'info')
  }

  // ── Search ────────────────────────────────────────
  async function searchLocation() {
    if (!searchVal.trim()) return
    log(`Searching: ${searchVal}`)
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchVal)}&format=json&limit=1`)
      const d = await r.json()
      if (d.length > 0) {
        flyTo({ name: d[0].display_name.split(',')[0], lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon) })
      } else {
        log('Location not found', 'err')
      }
    } catch { log('Search failed', 'err') }
  }

  // ── Get NASA tile URL ─────────────────────────────
  function getNasaTileUrl(date) {
    return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`
  }

  function getTileImageUrl(lat, lon, date) {
    const zoom  = 13
    const xtile = Math.floor((lon + 180) / 360 * Math.pow(2, zoom))
    const ytile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
    return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/${zoom}/${ytile}/${xtile}.jpg`
  }

  // ── Draw overlay ──────────────────────────────────
  function drawOverlay(b64, lat, lon) {
    const L    = window.L
    const map  = leafletRef.current
    if (!map) return
    if (overlayRef.current) map.removeLayer(overlayRef.current)
    const size   = 0.05
    const bounds = [[lat - size, lon - size], [lat + size, lon + size]]
    overlayRef.current = L.imageOverlay(`data:image/png;base64,${b64}`, bounds, { opacity: 0.75 }).addTo(map)
  }

  // ── Main analysis ─────────────────────────────────
  async function runAnalysis() {
    if (!selectedPos) { log('Click the map to select a location first', 'err'); return }
    if (!apiOk)       { log('API not connected', 'err'); return }

    setStatus('fetching')
    setStats(null)
    setMaskB64(null)

    try {
      const { lat, lon } = selectedPos

      // Get tile URLs
      log('Fetching NASA satellite imagery...')
      const preUrl  = getTileImageUrl(lat, lon, preDate)
      const postUrl = getTileImageUrl(lat, lon, postDate)
      setPreThumb(preUrl)
      setPostThumb(postUrl)

      // Add NASA layer to map
      if (nasaRef.current) leafletRef.current.removeLayer(nasaRef.current)
      nasaRef.current = window.L.tileLayer(getNasaTileUrl(postDate), {
        opacity: 0.5, attribution: 'NASA GIBS'
      }).addTo(leafletRef.current)

      log('Imagery loaded', 'ok')
      setStatus('analyzing')
      log('Running AI inference...')

      const resp = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pre_url: preUrl, post_url: postUrl })
      })

      const result = await resp.json()
      if (result.error) throw new Error(result.error)

      setMaskB64(result.mask_base64)
      setStats(result.stats)
      drawOverlay(result.mask_base64, lat, lon)

      setStatus('done')
      log(`Analysis complete — ${result.stats.damage_pct}% damage detected`, 'ok')

    } catch (e) {
      setStatus('error')
      log(`Error: ${e.message}`, 'err')
    }
  }

  const isRunning = status === 'fetching' || status === 'analyzing'

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0A0A0A] overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-white/15 flex-shrink-0 bg-[#0A0A0A] z-50">
        <div className="flex items-center gap-6">
          <a href="/" className="font-display text-xl tracking-widest text-white">
            SENT<span className="text-[#E8001D]">INEL</span>
          </a>
          <div className="hidden md:flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${apiOk ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase">
              {apiOk ? 'API ONLINE' : 'API OFFLINE'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {selectedPos && (
            <span className="hidden md:block font-mono text-[10px] text-white/70 tracking-wider">
              {selectedPos.lat.toFixed(4)}, {selectedPos.lon.toFixed(4)}
            </span>
          )}
          <a href="/" className="font-mono text-[10px] tracking-widest text-white/70 hover:text-white transition-colors uppercase">
            ← Back
          </a>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-72 flex-shrink-0 bg-[#0A0A0A] border-r border-white/15 flex flex-col overflow-y-auto">

          {/* Search */}
          <div className="p-4 border-b border-white/15">
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase mb-3">Location</div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchLocation()}
                placeholder="Search city..."
                className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-mono px-3 py-2 outline-none focus:border-[#E8001D]/50 placeholder-white/40"
              />
              <button onClick={searchLocation}
                className="bg-white/5 border border-white/10 text-white/80 hover:text-white px-3 py-2 font-mono text-xs transition-colors">
                GO
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map(c => (
                <button key={c.name} onClick={() => flyTo(c)}
                  className="px-2 py-1 text-[9px] font-mono tracking-wider border border-white/10 text-white/70 hover:border-[#E8001D]/50 hover:text-white/70 transition-all uppercase">
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="p-4 border-b border-white/15">
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase mb-3">Dates</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-mono text-[9px] text-white/50 mb-1">PRE-EVENT</div>
                <input type="date" value={preDate} onChange={e => setPreDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-[10px] font-mono px-2 py-1.5 outline-none focus:border-[#E8001D]/50" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-white/50 mb-1">POST-EVENT</div>
                <input type="date" value={postDate} onChange={e => setPostDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-[10px] font-mono px-2 py-1.5 outline-none focus:border-[#E8001D]/50" />
              </div>
            </div>
          </div>

          {/* Analyze button */}
          <div className="p-4 border-b border-white/15">
            <motion.button
              onClick={runAnalysis}
              disabled={isRunning || !selectedPos}
              whileHover={!isRunning && selectedPos ? { scale: 1.02 } : {}}
              whileTap={!isRunning && selectedPos ? { scale: 0.98 } : {}}
              className={`w-full py-3.5 font-display text-lg tracking-widest transition-all ${
                isRunning
                  ? 'bg-white/5 text-white/50 cursor-not-allowed'
                  : !selectedPos
                  ? 'bg-white/5 text-white/50 cursor-not-allowed'
                  : 'bg-[#E8001D] text-white hover:bg-[#c0001a]'
              }`}
            >
              {isRunning ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                  {status === 'fetching' ? 'FETCHING...' : 'ANALYZING...'}
                </span>
              ) : 'RUN ANALYSIS'}
            </motion.button>
            {!selectedPos && (
              <p className="font-mono text-[9px] text-white/50 text-center mt-2">Click map to select location</p>
            )}
          </div>

          {/* Log */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase mb-3">System Log</div>
            <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
              {logs.map((l, i) => <LogLine key={i} text={l.text} type={l.type} />)}
            </div>
          </div>
        </div>

        {/* ── MAP ── */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />

          {/* Center hint */}
          {!selectedPos && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <div className="font-display text-4xl text-white/10 tracking-widest mb-2">CLICK TO SELECT</div>
                <div className="font-mono text-xs text-white/10 tracking-widest">ANY LOCATION ON EARTH</div>
              </motion.div>
            </div>
          )}

          {/* Analyzing overlay */}
          <AnimatePresence>
            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 z-20"
              >
                <div className="w-10 h-10 border-2 border-white/20 border-t-[#E8001D] rounded-full animate-spin" />
                <div className="font-display text-2xl tracking-widest text-white">
                  {status === 'fetching' ? 'FETCHING IMAGERY' : 'RUNNING AI MODEL'}
                </div>
                <div className="font-mono text-xs text-white/70 tracking-widest">
                  {status === 'fetching' ? 'Loading NASA satellite tiles...' : 'Siamese U-Net inference...'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status bar on map */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="bg-[#0A0A0A]/80 backdrop-blur px-4 py-2 border border-white/10">
              <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                {status === 'done' && stats
                  ? `ANALYSIS COMPLETE — ${stats.damage_pct}% DAMAGE`
                  : status === 'error'
                  ? 'ANALYSIS FAILED'
                  : selectedPos
                  ? `TARGET SET — ${selectedPos.lat.toFixed(3)}, ${selectedPos.lon.toFixed(3)}`
                  : 'SELECT TARGET LOCATION'}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="w-72 flex-shrink-0 bg-[#0A0A0A] border-l border-white/15 flex flex-col overflow-y-auto">

          {/* Image previews */}
          <div className="p-4 border-b border-white/15">
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase mb-3">Imagery</div>
            <div className="grid grid-cols-3 gap-2">
              {/* Pre */}
              <div className="aspect-square bg-white/5 border border-white/15 overflow-hidden relative">
                {preThumb
                  ? <img src={preThumb} className="w-full h-full object-cover" alt="pre" />
                  : <div className="w-full h-full flex items-center justify-center font-mono text-[8px] text-white/40">PRE</div>
                }
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center font-mono text-[7px] text-white/40 py-0.5">PRE</div>
              </div>
              {/* Post */}
              <div className="aspect-square bg-white/5 border border-white/15 overflow-hidden relative">
                {postThumb
                  ? <img src={postThumb} className="w-full h-full object-cover" alt="post" />
                  : <div className="w-full h-full flex items-center justify-center font-mono text-[8px] text-white/40">POST</div>
                }
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center font-mono text-[7px] text-white/40 py-0.5">POST</div>
              </div>
              {/* Mask */}
              <div className="aspect-square bg-white/5 border border-white/15 overflow-hidden relative">
                {maskB64
                  ? <img src={`data:image/png;base64,${maskB64}`} className="w-full h-full object-cover" alt="mask" />
                  : <div className="w-full h-full flex items-center justify-center font-mono text-[8px] text-white/40">MASK</div>
                }
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center font-mono text-[7px] text-white/40 py-0.5">MASK</div>
              </div>
            </div>
          </div>

          {/* Big damage % */}
          <div className="p-4 border-b border-white/15">
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase mb-2">Total Damage</div>
            <div className="font-display text-7xl tracking-wider leading-none text-[#E8001D]">
              {stats ? `${stats.damage_pct}%` : '—'}
            </div>
            {stats && (
              <div className="font-mono text-[9px] text-white/50 mt-1">
                {stats.damaged_pixel_count.toLocaleString()} damaged pixels
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="p-4 border-b border-white/15">
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase mb-3">Breakdown</div>
            {stats ? (
              <div className="space-y-3">
                {[
                  { label: 'No Damage',    key: 'no_damage',    color: '#22C55E' },
                  { label: 'Minor',        key: 'minor',        color: '#EAB308' },
                  { label: 'Major',        key: 'major',        color: '#F97316' },
                  { label: 'Destroyed',    key: 'destroyed',    color: '#E8001D' },
                ].map((item, i) => (
                  <motion.div key={item.key}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-sm" style={{ background: item.color }} />
                        <span className="font-mono text-[9px] text-white/70 uppercase tracking-wider">{item.label}</span>
                      </div>
                      <span className="font-mono text-[10px] text-white/60">
                        {stats[item.key]?.pct || 0}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats[item.key]?.pct || 0}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="font-mono text-[9px] text-white/40 leading-6">
                No analysis yet.<br />Select location<br />and run analysis.
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="p-4 border-b border-white/15">
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase mb-3">Legend</div>
            <div className="space-y-2">
              {[
                { color: '#22C55E', label: 'No Damage',   cls: '0' },
                { color: '#EAB308', label: 'Minor',       cls: '1' },
                { color: '#F97316', label: 'Major',       cls: '2' },
                { color: '#E8001D', label: 'Destroyed',   cls: '3' },
                { color: '#6B7280', label: 'Unclassified',cls: '4' },
              ].map(l => (
                <div key={l.cls} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: l.color }} />
                  <span className="font-mono text-[9px] text-white/70 flex-1">{l.label}</span>
                  <span className="font-mono text-[9px] text-white/40">class {l.cls}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model info */}
          <div className="p-4">
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase mb-3">Model</div>
            <div className="space-y-1.5">
              {[
                ['Architecture', 'Siamese U-Net'],
                ['Parameters',   '7.7M'],
                ['Val IoU',      '43.8%'],
                ['Dataset',      'xBD Challenge'],
                ['Framework',    'PyTorch'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="font-mono text-[9px] text-white/50">{k}</span>
                  <span className="font-mono text-[9px] text-white/50">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
