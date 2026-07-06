import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './Loader.css'

/** A brief, elegant intro veil that lifts to reveal the story. */
export default function Loader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Lift the veil as soon as the window is ready, with a short minimum so
    // the reveal still feels intentional (and a hard cap so we never hang).
    const MIN = 900
    const started = performance.now()
    let timer
    const finish = () => {
      const elapsed = performance.now() - started
      timer = setTimeout(() => setDone(true), Math.max(0, MIN - elapsed))
    }
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })
    const cap = setTimeout(() => setDone(true), 2600)
    return () => {
      clearTimeout(timer)
      clearTimeout(cap)
      window.removeEventListener('load', finish)
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
        >
          <motion.div
            className="loader-mark"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="loader-heart">❤</span>
            <p className="loader-text gold-text">A Love Story</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
