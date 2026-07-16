import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/Logo'

export function Login() {
  const { user, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleLogin = async () => {
    setError('')
    setBusy(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch {
      setError('Não foi possível concluir o login. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  if (user) {
    navigate('/')
    return null
  }

  return (
    <div className="bg-grid relative flex min-h-screen items-center justify-center px-6 pt-16">
      <div className="animate-pulse-glow absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/20 blur-[110px]" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass relative w-full max-w-md rounded-3xl p-10 text-center"
      >
        <div className="mx-auto w-fit">
          <Logo size={64} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Bem-vindo de volta</h1>
        <p className="mt-2 text-sm text-slate-400">
          Entre com sua conta Google para acessar a plataforma !P | PRODUCTIONS.
        </p>
        <button
          onClick={handleLogin}
          disabled={busy}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-brand-500/25 bg-white px-6 py-3.5 font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.6-.4-3.9z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 5.1 29.3 3 24 3 15.9 3 8.9 7.6 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C8.8 40.3 15.9 45 24 45z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 45 30.2 45 24c0-1.3-.1-2.6-.4-3.9z"
            />
          </svg>
          {busy ? 'Entrando...' : 'Continuar com o Google'}
        </button>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <p className="mt-8 text-xs leading-relaxed text-slate-500">
          Ao entrar, você concorda com os nossos Termos de Serviço e Política de Privacidade.
        </p>
      </motion.div>
    </div>
  )
}
