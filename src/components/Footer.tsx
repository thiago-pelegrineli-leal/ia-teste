import { Link } from 'react-router-dom'
import { Mail, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Logo } from './Logo'

export function Footer() {
  const { settings } = useAuth()
  return (
    <footer className="border-t border-brand-500/10 bg-surface-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <span className="font-display font-bold">!P | PRODUCTIONS</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Desenvolvimento profissional de bots para Discord. Qualidade, suporte e inovação para a
            sua comunidade.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
            Navegação
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>
              <Link to="/" className="transition hover:text-brand-300">
                Início
              </Link>
            </li>
            <li>
              <Link to="/termos" className="transition hover:text-brand-300">
                Termos de Serviço
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition hover:text-brand-300">
                Entrar
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300">
            Contato
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            {settings.discordInviteUrl && (
              <li>
                <a
                  href={settings.discordInviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition hover:text-brand-300"
                >
                  <MessageCircle size={15} /> Servidor no Discord
                </a>
              </li>
            )}
            {settings.contactEmail && (
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-2 transition hover:text-brand-300"
                >
                  <Mail size={15} /> {settings.contactEmail}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-500/10 py-5 text-center text-xs text-slate-500">
        {new Date().getFullYear()} !P | PRODUCTIONS. Todos os direitos reservados.
      </div>
    </footer>
  )
}
