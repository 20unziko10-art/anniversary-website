import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A volumetric heart made of thousands of golden particles, built in a custom
 * shader. `anim` is a plain object (mutated by GSAP) with:
 *   form    0 → swirling cloud, 1 → heart formed
 *   explode 0 → heart,          1 → scattered across space
 */
export default function HeartPoints({ anim, count = 4500 }) {
  const matRef = useRef()
  const pointsRef = useRef()

  const { positions, heart, scatter, seeds } = useMemo(() => {
    const heart = new Float32Array(count * 3)
    const scatter = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // --- Heart target (filled volume) ---
      const t = Math.random() * Math.PI * 2
      let x = 16 * Math.pow(Math.sin(t), 3)
      let y =
        13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      // Fill the interior and give it depth
      const fill = Math.pow(Math.random(), 0.55)
      x *= fill
      y *= fill
      const s = 0.055 // smaller heart
      const thickness = (1 - fill) * 1.1 + 0.12
      const z = (Math.random() - 0.5) * thickness
      heart[i * 3] = x * s
      heart[i * 3 + 1] = y * s + 0.15
      heart[i * 3 + 2] = z

      // --- Scatter target (explosion into deep space) ---
      const r = 6 + Math.random() * 9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      scatter[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      scatter[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      scatter[i * 3 + 2] = r * Math.cos(phi) - 3

      seeds[i] = Math.random()
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
    }
    return { positions, heart, scatter, seeds }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uForm: { value: 0 },
      uExplode: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 15 },
      uColorA: { value: new THREE.Color('#f3e0b0') },
      uColorB: { value: new THREE.Color('#e3b7a0') },
    }),
    []
  )

  useFrame((state, delta) => {
    const u = matRef.current?.uniforms
    if (!u) return
    u.uTime.value += delta
    u.uForm.value = anim.form
    u.uExplode.value = anim.explode
    if (pointsRef.current) {
      // slow, dignified rotation while the heart is intact
      pointsRef.current.rotation.y += delta * 0.12 * (1 - anim.explode)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aHeart" array={heart} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aScatter" array={scatter} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" array={seeds} count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uForm;
          uniform float uExplode;
          uniform float uTime;
          uniform float uSize;
          attribute vec3 aHeart;
          attribute vec3 aScatter;
          attribute float aSeed;
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vSeed = aSeed;
            vec3 cloud = aScatter * 0.16;
            vec3 base = mix(cloud, aHeart, uForm);
            base.x += sin(uTime * 0.7 + aSeed * 6.2831) * 0.015;
            base.y += sin(uTime * 0.9 + aSeed * 6.2831) * 0.02;
            vec3 pos = mix(base, aScatter, uExplode);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            float twinkle = 0.82 + 0.18 * sin(uTime * 1.5 + aSeed * 18.0);
            gl_PointSize = uSize * twinkle * (1.0 / -mv.z) * 4.0;
            vAlpha = twinkle * (1.0 - uExplode * 0.55);
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
