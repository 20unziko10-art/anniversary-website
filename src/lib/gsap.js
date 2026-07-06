import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Slightly snappier defaults that match the cinematic feel.
gsap.defaults({ ease: 'power3.out', duration: 1.1 })

export { gsap, ScrollTrigger }
