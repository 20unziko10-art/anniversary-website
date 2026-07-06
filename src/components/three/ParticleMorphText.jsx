import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sampleText, sampleHeart } from '../../lib/textPoints'

const COUNT = 4500

/**
 * A field of golden particles that morphs through a sequence of shapes/phrases.
 * `anim.progress` (0→1) scrubs through the stages; particles ease toward the
 * blended target each frame for an organic, liquid-gold morph.
 */
export default function ParticleMorphText({ anim, phrases }) {
  const pointsRef = useRef()
  const matRef = useRef()
  const [targets, setTargets] = useState(null)

  // Persistent working buffers
  const current = useMemo(() => new Float32Array(COUNT * 3), [])
  const seeds = useMemo(() => {
    const s = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) s[i] = Math.random()
    return s
  }, [])

  useEffect(() => {
    let alive = true
    const build = () => {
      if (!alive) return
      const t = [sampleHeart(COUNT, { worldWidth: 5.2 })]
      phrases.forEach((p) =>
        t.push(sampleText(p, COUNT, { worldWidth: p.includes('\n') ? 4.4 : 7.6, fontSize: 150 }))
      )
      // start collapsed at heart
      current.set(t[0])
      setTargets(t)
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build)
    else build()
    return () => {
      alive = false
    }
  }, [phrases, current])

  useFrame((state, delta) => {
    if (!targets || !pointsRef.current) return
    const S = targets.length
    const scaled = THREE.MathUtils.clamp(anim.progress, 0, 1) * (S - 1)
    const cur = Math.min(Math.floor(scaled), S - 2 >= 0 ? S - 1 : 0)
    const next = Math.min(cur + 1, S - 1)
    let blend = scaled - cur
    blend = blend * blend * (3 - 2 * blend) // smoothstep

    const a = targets[cur]
    const b = targets[next]
    const pos = pointsRef.current.geometry.attributes.position.array
    const ease = 1 - Math.pow(0.0001, delta) // frame-rate independent easing
    const t = state.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const dx = a[ix] + (b[ix] - a[ix]) * blend
      const dy = a[ix + 1] + (b[ix + 1] - a[ix + 1]) * blend
      const dz = a[ix + 2] + (b[ix + 2] - a[ix + 2]) * blend
      // subtle shimmer
      const sh = Math.sin(t * 1.5 + seeds[i] * 12.0) * 0.012
      current[ix] += (dx - current[ix]) * ease
      current[ix + 1] += (dy + sh - current[ix + 1]) * ease
      current[ix + 2] += (dz - current[ix + 2]) * ease
      pos[ix] = current[ix]
      pos[ix + 1] = current[ix + 1]
      pos[ix + 2] = current[ix + 2]
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    if (matRef.current) matRef.current.uniforms.uTime.value = t
  })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#f3e0b0') },
      uColorB: { value: new THREE.Color('#e3b7a0') },
    }),
    []
  )

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={current} count={COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" array={seeds} count={COUNT} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          attribute float aSeed;
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vSeed = aSeed;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            float tw = 0.6 + 0.4 * sin(uTime * 2.0 + aSeed * 20.0);
            gl_PointSize = tw * (1.0 / -mv.z) * 26.0;
            vAlpha = tw;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          varying float vSeed;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float glow = smoothstep(0.5, 0.0, d);
            vec3 col = mix(uColorA, uColorB, vSeed);
            gl_FragColor = vec4(col, glow * vAlpha);
          }
        `}
      />
    </points>
  )
}
