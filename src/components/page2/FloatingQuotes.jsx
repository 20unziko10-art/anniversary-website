import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QUOTES } from '../../data/quotes'

/** Love quotes drifting in and out of the galaxy at gentle intervals. */
const SPOTS = [
  { top: '24%', left: '12%' },
  { top: '64%', left: '70%' },
  { top: '38%', left: '74%' },
  { top: '72%', left: '16%' },
]

export default function FloatingQuotes() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % QUOTES.length), 5200)
    return () => clearInterval(id)
  }, [])

  const spot = SPOTS[i % SPOTS.length]

  return (
    <div className="galaxy-quotes" aria-hidden>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          className="galaxy-quote"
          style={spot}
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          “{QUOTES[i]}”
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
