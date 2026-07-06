import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import SmoothScroll, { useSmoothScroll } from './lib/SmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import Cursor from './components/common/Cursor'
import Nav from './components/common/Nav'
import Loader from './components/common/Loader'
import AudioPlayer from './components/common/AudioPlayer'

const Beginning = lazy(() => import('./pages/Beginning'))
const MemoryUniverse = lazy(() => import('./pages/MemoryUniverse'))
const Celebration = lazy(() => import('./pages/Celebration'))

/** Resets scroll + refreshes ScrollTrigger whenever the route changes. */
function ScrollManager() {
  const { pathname } = useLocation()
  const lenis = useSmoothScroll()
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    // Let the new page mount, then recalc all triggers.
    const t = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(t)
  }, [pathname, lenis])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0705' }} />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Beginning />} />
          <Route path="/universe" element={<MemoryUniverse />} />
          <Route path="/celebration" element={<Celebration />} />
          <Route path="*" element={<Beginning />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <SmoothScroll>
      <div className="app-root">
        <Loader />
        <Cursor />
        <Nav />
        <ScrollManager />
        <AnimatedRoutes />
        <AudioPlayer />
      </div>
    </SmoothScroll>
  )
}
