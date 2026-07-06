import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { MESSAGES } from '../../data/messages'
import './MessageWall.css'

export default function MessageWall() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.msg-card', {
        opacity: 0,
        y: 60,
        scale: 0.9,
        filter: 'blur(8px)',
        duration: 1,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: { trigger: '.msg-grid', start: 'top 78%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="msg-sec" ref={ref}>
      <div className="container">
        <p className="eyebrow" style={{ textAlign: 'center' }}>From the Heart</p>
        <h2 className="msg-heading">A Few Words <span className="gold-text">For You</span></h2>
        <div className="msg-grid">
          {MESSAGES.map((m, i) => (
            <figure className="msg-card" key={i}>
              <span className="msg-quote">”</span>
              <blockquote className="msg-text">{m.text}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
