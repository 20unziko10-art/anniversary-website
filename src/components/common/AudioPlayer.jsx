import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MEDIA } from '../../data/config'
import './AudioPlayer.css'

/**
 * Soft background piano with mute/unmute + volume.
 * Respects autoplay policies: starts on the first user interaction.
 */
export default function AudioPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.45)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!MEDIA.music) return
    const audio = audioRef.current
    audio.volume = volume

    const start = () => {
      if (audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => {})
      }
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
    window.addEventListener('pointerdown', start)
    window.addEventListener('keydown', start)
    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  if (!MEDIA.music) return null

  const toggle = () => {
    const audio = audioRef.current
    if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => {})
    else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <motion.div
      className="audio-player"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 1 }}
    >
      <audio
        ref={audioRef}
        src={MEDIA.music}
        loop
        preload="auto"
        onCanPlay={() => setReady(true)}
        onError={() => setReady(false)}
      />
      <button className="audio-btn" onClick={toggle} aria-label={playing ? 'Mute music' : 'Play music'} data-hover>
        <span className={`eq ${playing ? 'is-playing' : ''}`}>
          <i /><i /><i /><i />
        </span>
      </button>
      <div className="audio-slider">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          aria-label="Volume"
        />
      </div>
      <span className="audio-label">{playing ? 'Now Playing' : ready ? 'Play Music' : 'Add /audio/piano.mp3'}</span>
    </motion.div>
  )
}
