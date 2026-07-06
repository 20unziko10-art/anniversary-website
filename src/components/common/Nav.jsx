import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COUPLE } from '../../data/config'
import './Nav.css'

const LINKS = [
  { to: '/', label: 'The Beginning', n: 'I' },
  { to: '/universe', label: 'Memory Universe', n: 'II' },
  { to: '/celebration', label: 'Celebration', n: 'III' },
]

export default function Nav() {
  const { pathname } = useLocation()
  return (
    <motion.nav
      className="nav"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 1 }}
    >
      <NavLink to="/" className="nav-brand" data-hover>
        <span className="nav-heart">❤</span>
        <span className="nav-names gold-text">{COUPLE.name}</span>
      </NavLink>
      <ul className="nav-links">
        {LINKS.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              data-hover
            >
              <span className="nav-num">{l.n}</span>
              <span className="nav-text">{l.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}
