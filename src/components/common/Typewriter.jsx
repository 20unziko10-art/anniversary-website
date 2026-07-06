import { useEffect, useState } from 'react'

/** Types a string out, pauses, deletes, and loops — with a blinking caret. */
export default function Typewriter({ text = 'Scroll Down', speed = 120, pause = 1600, className = '' }) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    let i = 0
    let dir = 1
    let timer
    const tick = () => {
      setDisplay(text.slice(0, i))
      if (dir > 0) {
        i++
        if (i > text.length) {
          dir = -1
          timer = setTimeout(tick, pause)
          return
        }
      } else {
        i--
        if (i < 0) {
          i = 0
          dir = 1
          timer = setTimeout(tick, 600)
          return
        }
      }
      timer = setTimeout(tick, dir > 0 ? speed : speed * 0.5)
    }
    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [text, speed, pause])

  return (
    <span className={className}>
      {display}
      <span className="tw-caret">|</span>
    </span>
  )
}
