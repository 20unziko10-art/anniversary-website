import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { COUPLE } from '../../data/config'
import GoldButton from '../common/GoldButton'
import './Counter.css'

/** Calendar breakdown (years / months / days) between two dates. */
function diff(from, to) {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()
  if (days < 0) {
    months -= 1
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  const totalDays = Math.floor((to - from) / 86400000)
  return { years, months, days, totalDays }
}

function CountUp({ value, duration = 1.6, active }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration, active])
  return <>{n.toLocaleString()}</>
}

export default function Counter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const { year, month, day } = COUPLE.weddingDate
  const wedding = new Date(year, month - 1, day)
  const today = new Date()
  const d = diff(wedding, today)

  const stats = [
    { label: 'Years', value: d.years },
    { label: 'Months', value: d.months },
    { label: 'Days', value: d.days },
  ]

  return (
    <section className="counter" ref={ref}>
      <div className="container counter-inner">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          Together For
        </motion.p>
        <h2 className="counter-heading">
          A Lifetime <span className="gold-text">&amp; Counting</span>
        </h2>

        <div className="counter-grid">
          {stats.map((s, i) => (
            <motion.div
              className="counter-cell"
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="counter-num gold-text">
                <CountUp value={s.value} active={inView} />
              </span>
              <span className="counter-label">{s.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="counter-total"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.6 }}
        >
          That’s <strong><CountUp value={d.totalDays} active={inView} duration={2.2} /></strong> days of choosing each other.
        </motion.p>

        <div className="counter-cta">
          <GoldButton to="/celebration" float={false}>
            Enter the Celebration
          </GoldButton>
        </div>
      </div>
    </section>
  )
}
