import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { gsap } from '../../lib/gsap'
import { useInViewport } from '../../lib/useInViewport'
import ParticleMorphText from '../three/ParticleMorphText'
import Dust from '../three/Dust'
import './ParticleFinale.css'

const PHRASES = ['YOU\n&\nME']
// Captions shown beneath each stage (stage 0 = heart).
const CAPTIONS = [
  'From the moment we met…',
  'to you & me — always…',
]

export default function ParticleFinale() {
  const ref = useRef(null)
  const capRef = useRef(null)
  const anim = useRef({ progress: 0 }).current
  const active = useInViewport(ref)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(anim, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            // Swap the HTML caption to match the active stage.
            const idx = Math.min(Math.round(self.progress * (CAPTIONS.length - 1)), CAPTIONS.length - 1)
            if (capRef.current && capRef.current.dataset.idx !== String(idx)) {
              capRef.current.dataset.idx = String(idx)
              gsap.fromTo(
                capRef.current,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.6, overwrite: true }
              )
              capRef.current.textContent = CAPTIONS[idx]
            }
          },
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [anim])

  return (
    <section className="finale-sec" ref={ref}>
      <div className="finale-sticky">
        <Canvas
          className="finale-canvas"
          frameloop={active ? 'always' : 'never'}
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 9], fov: 50 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#05040a']} />
          <Suspense fallback={null}>
            <ParticleMorphText anim={anim} phrases={PHRASES} />
            <Dust count={400} radius={18} color="#cdd6ff" size={0.04} />
            <Dust count={200} radius={14} color="#d9b870" size={0.05} />
            <EffectComposer disableNormalPass>
              <Bloom intensity={1.3} luminanceThreshold={0.04} luminanceSmoothing={0.9} mipmapBlur radius={0.75} />
              <Vignette offset={0.2} darkness={0.92} />
            </EffectComposer>
            <AdaptiveDpr pixelated={false} />
          </Suspense>
        </Canvas>
        <p className="finale-caption" ref={capRef} data-idx="0">
          {CAPTIONS[0]}
        </p>
      </div>
    </section>
  )
}
