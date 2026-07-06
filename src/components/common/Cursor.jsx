import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import './Cursor.css'

/**
 * Custom golden cursor: a soft glowing ring + a canvas particle trail that
 * spawns sparkles as the pointer moves. Auto-disables on touch devices.
 */
export default function Cursor() {
  const ringRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const ring = ringRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const mouse = { x: w / 2, y: h / 2 }
    const ringPos = { x: w / 2, y: h / 2 }
    let lastX = mouse.x
    let lastY = mouse.y
    const particles = []
    const GOLD = ['255,235,170', '217,184,112', '240,200,180', '231,210,168']

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      const dx = mouse.x - lastX
      const dy = mouse.y - lastY
      const speed = Math.min(Math.hypot(dx, dy), 40)
      const count = Math.round(speed / 6)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 6,
          y: mouse.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8 - dx * 0.04,
          vy: (Math.random() - 0.5) * 0.8 - dy * 0.04,
          life: 1,
          size: Math.random() * 2.4 + 0.8,
          color: GOLD[(Math.random() * GOLD.length) | 0],
        })
      }
      lastX = mouse.x
      lastY = mouse.y
    }
    window.addEventListener('pointermove', onMove)

    // Grow the ring over interactive elements
    const onOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) ring.classList.add('is-active')
      else ring.classList.remove('is-active')
    }
    window.addEventListener('pointerover', onOver)

    const render = () => {
      // Ease the ring toward the pointer
      ringPos.x += (mouse.x - ringPos.x) * 0.18
      ringPos.y += (mouse.y - ringPos.y) * 0.18
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.012
        p.life -= 0.022
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        const r = p.size * (0.6 + p.life)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3)
        g.addColorStop(0, `rgba(${p.color},${0.55 * p.life})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    gsap.ticker.add(render)
    return () => {
      gsap.ticker.remove(render)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="cursor-canvas" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  )
}
