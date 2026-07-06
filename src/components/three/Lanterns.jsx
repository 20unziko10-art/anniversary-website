import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Lantern({ data }) {
  const ref = useRef()
  const glowRef = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = ref.current
    if (!g) return
    const span = 26
    let y = ((data.y0 + t * data.speed) % span) - 6
    g.position.y = y
    g.position.x = data.x + Math.sin(t * 0.4 + data.phase) * 0.5
    g.position.z = data.z + Math.cos(t * 0.3 + data.phase) * 0.4
    g.rotation.y = Math.sin(t * 0.3 + data.phase) * 0.2
    const flicker = 0.8 + Math.sin(t * 6 + data.phase) * 0.12 + Math.sin(t * 11 + data.phase) * 0.06
    if (glowRef.current) glowRef.current.material.opacity = 0.7 * flicker
  })
  return (
    <group ref={ref} position={[data.x, data.y0, data.z]} scale={data.scale}>
      {/* warm glow */}
      <sprite ref={glowRef} scale={[1.7, 2, 1]}>
        <spriteMaterial
          map={data.glowTex}
          color="#ffb867"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      {/* lantern body */}
      <mesh>
        <cylinderGeometry args={[0.26, 0.32, 0.6, 12, 1, true]} />
        <meshBasicMaterial color="#ff9d4d" transparent opacity={0.85} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 0.12, 12]} />
        <meshBasicMaterial color="#d9b870" toneMapped={false} />
      </mesh>
    </group>
  )
}

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,220,160,1)')
  g.addColorStop(0.3, 'rgba(255,180,100,0.7)')
  g.addColorStop(1, 'rgba(255,150,80,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  return tex
}

export default function Lanterns({ count = 36 }) {
  const glowTex = useMemo(() => makeGlowTexture(), [])
  const lanterns = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 16,
      z: (Math.random() - 0.5) * 10 - 2,
      y0: Math.random() * 26 - 6,
      speed: 0.6 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      scale: 0.7 + Math.random() * 0.8,
      glowTex,
    }))
  }, [count, glowTex])

  // Camera drifts slowly upward, following the lanterns into the night.
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const cam = state.camera
    cam.position.y += (Math.sin(t * 0.1) * 1.5 + 1.5 - cam.position.y) * 0.01
    cam.position.x += (state.pointer.x * 1.2 - cam.position.x) * 0.02
    cam.lookAt(0, cam.position.y + 2, 0)
  })

  return (
    <group>
      {lanterns.map((d, i) => (
        <Lantern key={i} data={d} />
      ))}
    </group>
  )
}
