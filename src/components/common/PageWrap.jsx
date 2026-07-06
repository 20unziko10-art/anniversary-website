import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 1, 1] } },
}

/** Cinematic fade between chapters. */
export default function PageWrap({ children, className = '' }) {
  return (
    <motion.main
      className={className}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.main>
  )
}
