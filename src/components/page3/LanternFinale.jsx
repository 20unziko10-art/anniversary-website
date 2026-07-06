import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { motion, useInView } from 'framer-motion'
import { useInViewport } from '../../lib/useInViewport'
import { COUPLE } from '../../data/config'
import Lanterns from '../three/Lanterns'
import './LanternFinale.css'

/** Starry sky with a slow lantern release and the closing message. */
export default function LanternFinale() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const active = useInViewport(ref)

  return (
    <section className="lantern-sec" ref={ref}>
      <Canvas
        className="lantern-canvas"
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.6]}
        camera={{ position: [0, 1.5, 12], fov: 55 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#070611']} />
        <fog attach="fog" args={['#070611', 12, 34]} />
        <Suspense fallback={null}>
          <Lanterns count={30} />
          <EffectComposer disableNormalPass>
            <Bloom intensity={1.4} luminanceThreshold={0.08} luminanceSmoothing={0.9} mipmapBlur radius={0.8} />
          </EffectComposer>
          <AdaptiveDpr pixelated={false} />
        </Suspense>
      </Canvas>

      <Stars />

      <div className="lantern-ui">
        <motion.span
          className="lantern-heart"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          ❤
        </motion.span>
        <motion.h2
          className="lantern-title gold-text"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, delay: 0.3 }}
        >
          With All My Love,
          <br />
          {COUPLE.signature}
        </motion.h2>
        <motion.p
          className="lantern-sub"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.9 }}
        >
          Here’s to forever — and every beautiful day in between.
        </motion.p>
      </div>
    </section>
  )
}

/** Lightweight twinkling CSS starfield layered behind the lanterns. */
function Stars() {
  const stars = Array.from({ length: 70 })
  return (
    <div className="lantern-stars" aria-hidden>
      {stars.map((_, i) => (
        <span
          key={i}
          style={{
            top: `${(i * 53) % 100}%`,
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 10) * 0.4}s`,
            transform: `scale(${0.5 + ((i % 5) * 0.18)})`,
          }}
        />
      ))}
    </div>
  )
}
