import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { MEMORIES } from '../../data/memories'
import { img } from '../../lib/placeholder'

/** Distribute points on a sphere (Fibonacci) for an even, galactic spread. */
function fibSphere(n, radius) {
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push([
      Math.cos(theta) * r * radius,
      y * radius * 0.72,
      Math.sin(theta) * r * radius,
    ])
  }
  return pts
}

function PhotoStar({ memory, position, index, onSelect, registerNode }) {
  const groupRef = useRef()
  const matRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)
  const tex = useTexture(img(memory.image, memory.title, index, 500, 650))
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = groupRef.current
    if (!g) return
    g.position.x = position[0] + Math.sin(t * 0.3 + phase) * 0.12
    g.position.y = position[1] + Math.cos(t * 0.25 + phase) * 0.12
    g.position.z = position[2] + Math.sin(t * 0.2 + phase) * 0.12
    if (registerNode) registerNode(index, g.position)
    const target = hovered ? 1.34 : 1
    g.scale.x += (target - g.scale.x) * 0.12
    g.scale.y = g.scale.z = g.scale.x
    if (glowRef.current) {
      const go = hovered ? 0.85 : 0.28 + Math.sin(t * 1.5 + phase) * 0.08
      glowRef.current.material.opacity += (go - glowRef.current.material.opacity) * 0.1
    }
  })

  return (
    <Billboard ref={groupRef} position={position}>
      {/* soft golden glow halo */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[1.5, 1.85]} />
        <meshBasicMaterial
          color="#e7d2a8"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* photo */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(memory)
        }}
      >
        <planeGeometry args={[1.15, 1.45]} />
        <meshBasicMaterial ref={matRef} map={tex} toneMapped={false} transparent />
      </mesh>
      {/* thin frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.24, 1.54]} />
        <meshBasicMaterial color="#d9b870" transparent opacity={hovered ? 0.9 : 0.45} />
      </mesh>
    </Billboard>
  )
}

/** Glowing golden lines connecting nearby memories into a constellation. */
function Constellation({ positionsRef, pairs }) {
  const ref = useRef()
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pairs.length * 6), 3))
    return g
  }, [pairs])

  useFrame((state) => {
    const arr = geom.attributes.position.array
    const P = positionsRef.current
    let i = 0
    for (const [a, b] of pairs) {
      const pa = P[a]
      const pb = P[b]
      if (!pa || !pb) {
        i += 6
        continue
      }
      arr[i++] = pa.x; arr[i++] = pa.y; arr[i++] = pa.z
      arr[i++] = pb.x; arr[i++] = pb.y; arr[i++] = pb.z
    }
    geom.attributes.position.needsUpdate = true
    if (ref.current) ref.current.material.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 0.8) * 0.06
  })

  return (
    <lineSegments ref={ref} geometry={geom}>
      <lineBasicMaterial color="#d9b870" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  )
}

export default function GalaxyPhotos({ onSelect }) {
  const radius = 5
  const positions = useMemo(() => fibSphere(MEMORIES.length, radius), [])
  const positionsRef = useRef({})

  const registerNode = (i, vec) => {
    positionsRef.current[i] = vec
  }

  // Connect each node to its 2 nearest neighbors (computed once on base positions).
  const pairs = useMemo(() => {
    const result = new Set()
    positions.forEach((p, i) => {
      const dists = positions
        .map((q, j) => ({ j, d: (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
      dists.forEach((o) => result.add([Math.min(i, o.j), Math.max(i, o.j)].join('-')))
    })
    return [...result].map((s) => s.split('-').map(Number))
  }, [positions])

  return (
    <group>
      <Constellation positionsRef={positionsRef} pairs={pairs} />
      {MEMORIES.map((m, i) => (
        <PhotoStar
          key={m.key}
          memory={m}
          index={i}
          position={positions[i]}
          onSelect={onSelect}
          registerNode={registerNode}
        />
      ))}
    </group>
  )
}
