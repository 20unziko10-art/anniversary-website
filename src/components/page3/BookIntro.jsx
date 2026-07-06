import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { BOOK_PHOTOS } from '../../data/book'
import { img } from '../../lib/placeholder'
import Typewriter from '../common/Typewriter'
import './BookIntro.css'

export default function BookIntro() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: '+=2400',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
      tl.to('.curtain.left', { xPercent: -105, ease: 'power2.inOut' }, 0)
        .to('.curtain.right', { xPercent: 105, ease: 'power2.inOut' }, 0)
        .from('.book', { scale: 0.6, opacity: 0, y: 60, ease: 'power2.out' }, 0.1)
        .to('.book-cover', { rotateY: -158, ease: 'power2.inOut' }, 0.5)
        .from(
          '.book-photo',
          { opacity: 0, scale: 0.7, y: 24, stagger: 0.08, ease: 'power2.out' },
          0.75
        )
        .from('.book-caption', { opacity: 0, y: 20 }, 0.9)
        // Fade the scroll cue away as soon as the doors begin to open
        .to('.book-scrollcue', { opacity: 0, y: 20, duration: 0.12, ease: 'power1.out' }, 0.03)
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="book-sec" ref={ref}>
      <div className="book-stage">
        <div className="curtain left" />
        <div className="curtain right" />

        <div className="book">
          <div className="book-inside">
            <div className="book-photos">
              {BOOK_PHOTOS.map((b, i) => (
                <div
                  className="book-photo"
                  key={i}
                  style={{ backgroundImage: `url("${img(b.image, b.label, i, 500, 600)}")` }}
                />
              ))}
            </div>
            <p className="book-caption">
              <span className="gold-text">Our Love Story</span> — written together
            </p>
          </div>

          <div className="book-cover">
            <div className="book-cover-face">
              <span className="book-cover-orn">✦</span>
              <p className="eyebrow">The Final Chapter</p>
              <h2 className="book-cover-title gold-text">A Story Worth Keeping</h2>
              <span className="book-cover-orn">❦</span>
            </div>
            <div className="book-spine" />
          </div>
        </div>

        {/* Typewriter scroll cue — clearly visible over the closed doors */}
        <div className="book-scrollcue">
          <Typewriter text="Scroll Down" className="book-scrollcue-text" />
          <span className="book-scrollcue-arrow">↓</span>
        </div>
      </div>
    </section>
  )
}
