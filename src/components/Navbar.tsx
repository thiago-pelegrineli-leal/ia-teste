import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Menu, Shield, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Logo } from './Logo'

const links = [
  { to: '/', label: 'Início' },
  { to: '/#bots', label: 'Bots' },
  { to: '/#planos', label: 'Planos' },
  { to: '/termos', label: 'Termos' },
]

export function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const goTo = (to: string) => {
    setOpen(false)
    if (to.startsWith('/#')) {
      const id = to.slice(2)
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(to)
    }
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={38} />
          <span className="font-display text-lg font-bold tracking-wide">
            !P <span className="text-brand-400">|</span> PRODUCTIONS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => goTo(l.to)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-brand-500/10 hover:text-white"
            >
              {l.label}
            </button>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="ml-1 flex items-center gap-1.5 rounded-lg bg-brand-500/15 px-4 py-2 text-sm font-semibold text-brand-300 transition hover:bg-brand-500/25"
            >
              <Shield size={15} /> Painel
            </Link>
          )}
          {user ? (
            <div className="ml-3 flex items-center gap-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? 'Avatar'}
                  className="h-8 w-8 rounded-full ring-2 ring-brand-500/50"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                onClick={logout}
                title="Sair"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="glow ml-3 rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Entrar
            </Link>
          )}
        </nav>

        <button
          className="rounded-lg p-2 text-slate-300 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-500/10 md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <button
                  key={l.to}
                  onClick={() => goTo(l.to)}
                  className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-300 hover:bg-brand-500/10"
                >
                  {l.label}
                </button>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-300 hover:bg-brand-500/10"
                >
                  Painel Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
                >
                  Sair
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Entrar
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
