import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './GoldButton.css'

/** Floating, glowing call-to-action used to move between chapters. */
export default function GoldButton({ to, children, onClick, float = true }) {
  const navigate = useNavigate()
  const handle = () => {
    if (onClick) onClick()
    if (to) navigate(to)
  }
  return (
    <motion.button
      className={`gold-button ${float ? 'is-float' : ''}`}
      onClick={handle}
      data-hover
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="gold-button-glow" />
      <span className="gold-button-label">{children}</span>
      <span className="gold-button-arrow">→</span>
    </motion.button>
  )
}
