import { motion } from 'framer-motion'
import { FileText, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Terms() {
  const { settings } = useAuth()

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Termos e <span className="text-gradient">Políticas</span>
        </h1>
        <p className="mt-3 text-slate-400">
          Leia atentamente as condições de uso dos serviços !P | PRODUCTIONS.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="glass mt-10 rounded-2xl p-8"
      >
        <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold">
          <FileText size={20} className="text-brand-400" /> Termos de Serviço
        </h2>
        <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {settings.termsOfService ||
            'Os termos de serviço serão publicados em breve. Em caso de dúvidas, entre em contato com a equipe.'}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass mt-8 rounded-2xl p-8"
      >
        <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold">
          <Lock size={20} className="text-brand-400" /> Política de Privacidade
        </h2>
        <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {settings.privacyPolicy ||
            'A política de privacidade será publicada em breve. Em caso de dúvidas, entre em contato com a equipe.'}
        </div>
      </motion.section>
    </div>
  )
}
