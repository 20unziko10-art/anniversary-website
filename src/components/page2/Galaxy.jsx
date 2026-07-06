import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { AnimatePresence, motion } from 'framer-motion'
import * as THREE from 'three'
import { gsap } from '../../lib/gsap'
import GalaxyPhotos from '../three/GalaxyPhotos'
import Dust from '../three/Dust'
import { useSmoothScroll } from '../../lib/SmoothScroll'
import { useInViewport } from '../../lib/useInViewport'
import { img } from '../../lib/placeholder'
import FloatingQuotes from './FloatingQuotes'
import './Galaxy.css'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/** Exposes smooth zoom in/out to the HTML buttons via a shared api ref. */
function ZoomRig({ api, controlsRef }) {
  const { camera } = useThree()
  useEffect(() => {
    const step = (factor) => {
      const c = controlsRef.current
      if (!c) return
      const dir = new THREE.Vector3().subVectors(camera.position, c.target).normalize()
      const dist = THREE.MathUtils.clamp(camera.position.distanceTo(c.target) * factor, c.minDistance, c.maxDistance)
      const target = new THREE.Vector3().copy(c.target).addScaledVector(dir, dist)
      gsap.to(camera.position, {
        x: target.x, y: target.y, z: target.z,
        duration: 0.7, ease: 'power2.out', overwrite: true,
        onUpdate: () => c.update(),
      })
    }
    api.current.in = () => step(0.78)
    api.current.out = () => step(1.28)
  }, [camera, controlsRef, api])
  return null
}

export default function Galaxy() {
  const [selected, setSelected] = useState(null)
  const lenis = useSmoothScroll()
  const wrapRef = useRef(null)
  const controlsRef = useRef(null)
  const zoomApi = useRef({ in: () => {}, out: () => {} })
  const active = useInViewport(wrapRef)

  // Lock scroll only while a memory card is open (never traps the page).
  useEffect(() => {
    if (!lenis) return
    if (selected) lenis.stop()
    else lenis.start()
  }, [selected, lenis])

  // Programmatic scroll to the counter — works even where a one-finger swipe
  // is captured by the 3D controls (touch devices).
  const goToCounter = () => {
    const el = document.querySelector('.counter')
    if (lenis && el) lenis.scrollTo(el, { duration: 1.4 })
    else if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section className="galaxy" ref={wrapRef}>
      <Canvas
        className="galaxy-canvas"
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 12], fov: 55 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#0a0705']} />
        <fog attach="fog" args={['#0a0705', 10, 26]} />
        <Suspense fallback={null}>
          <GalaxyPhotos onSelect={setSelected} />
          <Dust count={300} radius={16} size={0.045} />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            enableZoom={isTouch} /* wheel-zoom off on desktop so the page scrolls; pinch stays on touch */
            enableRotate
            autoRotate
            autoRotateSpeed={0.45}
            enableDamping
            dampingFactor={0.06}
            minDistance={6}
            maxDistance={18}
          />
          <ZoomRig api={zoomApi} controlsRef={controlsRef} />
          <EffectComposer disableNormalPass>
            <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur radius={0.6} />
            <Vignette offset={0.3} darkness={0.8} />
          </EffectComposer>
          <AdaptiveDpr pixelated={false} />
        </Suspense>
      </Canvas>

      {/* Overlay UI */}
      <div className="galaxy-ui">
        <motion.div
          className="galaxy-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Chapter Two</p>
          <h2 className="galaxy-title">
            A <span className="gold-text">Universe</span> of Memories
          </h2>
        </motion.div>

        {/* Zoom controls */}
        <div className="galaxy-zoom">
          <button aria-label="Zoom in" onClick={() => zoomApi.current.in()} data-hover>+</button>
          <button aria-label="Zoom out" onClick={() => zoomApi.current.out()} data-hover>−</button>
        </div>

        {/* Tap to continue down to the counter */}
        <button className="galaxy-continue" onClick={goToCounter} data-hover>
          <span>Tap to Continue</span>
          <span className="galaxy-continue-arrow">↓</span>
        </button>
      </div>

      <FloatingQuotes />

      {/* Cinematic memory card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="memory-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="memory-card"
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="memory-card-img"
                style={{ backgroundImage: `url("${img(selected.image, selected.title, 0, 900, 700)}")` }}
              >
                <span className="memory-card-heart">❤</span>
              </div>
              <div className="memory-card-body">
                <h3 className="memory-card-title">{selected.title}</h3>
                <p className="memory-card-story">{selected.story}</p>
                <button className="memory-card-close" onClick={() => setSelected(null)} data-hover>
                  Close Memory
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
