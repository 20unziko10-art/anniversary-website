import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { gsap } from '../../lib/gsap'
import { useInViewport } from '../../lib/useInViewport'
import HeartPoints from '../three/HeartPoints'
import Dust from '../three/Dust'
import GoldButton from '../common/GoldButton'
import { COUPLE } from '../../data/config'
import './Hero.css'

/** Gentle pointer parallax on the camera (no dolly — the hero is static). */
function Rig() {
  useFrame((state) => {
    const cam = state.camera
    cam.position.x += (state.pointer.x * 0.6 - cam.position.x) * 0.04
    cam.position.y += (state.pointer.y * 0.4 - cam.position.y) * 0.04
    cam.lookAt(0, 0.15, 0)
  })
  return null
}

export default function Hero() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const active = useInViewport(heroRef)

  // The heart never explodes here — it simply forms and rotates forever.
  const anim = useRef({ form: 0, explode: 0, camZ: 5.4 }).current

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ delay: 1.7 })
      intro
        .to(anim, { form: 1, duration: 3.2, ease: 'power2.inOut' }, 0)
        .fromTo(
          '.hero-eyebrow',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.2 },
          1.0
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 26, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6 },
          1.3
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 1.3 },
          2.4
        )
    }, heroRef)
    return () => ctx.revert()
  }, [anim])

  return (
    <section className="hero" ref={heroRef}>
      <Canvas
        className="hero-canvas"
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 5.4], fov: 55 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#0a0705']} />
        <fog attach="fog" args={['#0a0705', 6, 16]} />
        <Suspense fallback={null}>
          <HeartPoints anim={anim} />
          <Dust count={220} radius={11} />
          <Rig />
          <EffectComposer disableNormalPass>
            <Bloom intensity={1.15} luminanceThreshold={0.05} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
            <Vignette eskil={false} offset={0.25} darkness={0.9} />
          </EffectComposer>
          <AdaptiveDpr pixelated={false} />
        </Suspense>
      </Canvas>

      <div className="hero-overlay">
        <div className="hero-top">
          <p className="hero-eyebrow eyebrow">A Celebration of Forever</p>
          <h1 className="hero-title" ref={titleRef}>
            <span className="hero-title-line hero-title-happy">Happy Anniversary</span>
            <span className="hero-title-line">
              <span className="gold-text">{COUPLE.heroName}</span>
            </span>
          </h1>
        </div>

        <div className="hero-cta">
          <GoldButton to="/universe" float={false}>
            Continue Our Story
          </GoldButton>
        </div>
      </div>
    </section>
  )
}
