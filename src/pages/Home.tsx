import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import {
  ArrowRight,
  Bot as BotIcon,
  Check,
  Cpu,
  Headphones,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { db } from '../lib/firebase'
import type { Bot, Plan } from '../lib/types'
import { useAuth } from '../context/AuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
  }),
}

const statusStyles: Record<Bot['status'], { label: string; cls: string }> = {
  online: { label: 'Online', cls: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30' },
  manutencao: { label: 'Manutenção', cls: 'bg-amber-500/15 text-amber-300 ring-amber-400/30' },
  offline: { label: 'Offline', cls: 'bg-red-500/15 text-red-300 ring-red-400/30' },
}

const features = [
  {
    icon: Zap,
    title: 'Alta Performance',
    desc: 'Bots otimizados com resposta instantânea e uptime constante para não deixar sua comunidade na mão.',
  },
  {
    icon: ShieldCheck,
    title: 'Segurança',
    desc: 'Moderação automática, proteção anti-raid e sistemas de verificação para manter seu servidor seguro.',
  },
  {
    icon: Cpu,
    title: 'Sob Medida',
    desc: 'Cada bot é desenvolvido de acordo com as necessidades do seu servidor, do zero ao deploy.',
  },
  {
    icon: Headphones,
    title: 'Suporte Dedicado',
    desc: 'Atendimento direto com a equipe de desenvolvimento para ajustes, dúvidas e novas funcionalidades.',
  },
]

export function Home() {
  const { settings } = useAuth()
  const [bots, setBots] = useState<Bot[]>([])
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    const unsubBots = onSnapshot(
      query(collection(db, 'bots'), orderBy('createdAt', 'desc')),
      (snap) => setBots(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bot)),
    )
    const unsubPlans = onSnapshot(
      query(collection(db, 'plans'), orderBy('order', 'asc')),
      (snap) => setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Plan)),
    )
    return () => {
      unsubBots()
      unsubPlans()
    }
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="bg-grid relative flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="animate-pulse-glow absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="animate-float mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-4xl font-extrabold text-white glow"
          >
            !P
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display text-4xl font-extrabold leading-tight sm:text-6xl"
          >
            <span className="text-gradient">!P | PRODUCTIONS</span>
            <br />
            Bots de Discord de outro nível
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            {settings.heroSubtitle}
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#planos"
              className="glow group flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-7 py-3.5 font-semibold text-white transition hover:brightness-110"
            >
              Ver Planos
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a
              href="#bots"
              className="rounded-xl border border-brand-500/30 bg-brand-500/5 px-7 py-3.5 font-semibold text-brand-200 transition hover:bg-brand-500/15"
            >
              Nossos Bots
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <Sparkles size={13} /> Por que a !P
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
              Tecnologia que <span className="text-gradient">impulsiona</span> comunidades
            </h2>
          </motion.div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                custom={i}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 transition"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <f.icon size={22} />
                </div>
                <h3 className="mt-4 font-display font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bots */}
      <section id="bots" className="relative px-6 py-24">
        <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-brand-600/10 blur-[100px]" />
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <BotIcon size={13} /> Bots Ativos
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
              Conheça nossos <span className="text-gradient">bots</span>
            </h2>
          </motion.div>

          {bots.length === 0 ? (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-14 text-center text-slate-500"
            >
              Novos bots serão anunciados em breve. Fique de olho.
            </motion.p>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bots.map((bot, i) => (
                <motion.div
                  key={bot.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  custom={i}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="glass flex flex-col rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {bot.imageUrl ? (
                        <img
                          src={bot.imageUrl}
                          alt={bot.name}
                          className="h-12 w-12 rounded-xl object-cover ring-2 ring-brand-500/30"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                          <BotIcon size={22} />
                        </div>
                      )}
                      <h3 className="font-display font-semibold">{bot.name}</h3>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusStyles[bot.status].cls}`}
                    >
                      {statusStyles[bot.status].label}
                    </span>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-400">
                    {bot.description}
                  </p>
                  {bot.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {bot.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-surface-700 px-2 py-0.5 text-[11px] text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {bot.inviteUrl && (
                    <a
                      href={bot.inviteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-500/15 py-2.5 text-sm font-semibold text-brand-300 transition hover:bg-brand-500/25"
                    >
                      Adicionar ao servidor <ArrowRight size={15} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="relative px-6 py-24">
        <div className="absolute left-0 top-1/3 h-72 w-72 rounded-full bg-brand-600/10 blur-[100px]" />
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <Rocket size={13} /> Planos
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
              Escolha o plano <span className="text-gradient">ideal</span>
            </h2>
          </motion.div>

          {plans.length === 0 ? (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-14 text-center text-slate-500"
            >
              Nossos planos serão divulgados em breve.
            </motion.p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  custom={i}
                  whileHover={{ y: -8 }}
                  className={`relative flex flex-col rounded-2xl p-7 ${
                    plan.highlighted
                      ? 'glow border border-brand-500/50 bg-gradient-to-b from-brand-500/15 to-surface-800'
                      : 'glass'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      Mais Popular
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="font-display text-4xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    {plan.period && <span className="pb-1 text-sm text-slate-400">/{plan.period}</span>}
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check size={16} className="mt-0.5 shrink-0 text-brand-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={settings.discordInviteUrl || '#'}
                    target={settings.discordInviteUrl ? '_blank' : undefined}
                    rel="noreferrer"
                    className={`mt-7 rounded-xl py-3 text-center text-sm font-semibold transition ${
                      plan.highlighted
                        ? 'glow bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:brightness-110'
                        : 'bg-brand-500/15 text-brand-300 hover:bg-brand-500/25'
                    }`}
                  >
                    Contratar
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="glass relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-10 text-center sm:p-14"
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-600/25 blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-600/25 blur-[80px]" />
          <h2 className="relative font-display text-2xl font-bold sm:text-3xl">
            Pronto para levar seu servidor ao <span className="text-gradient">próximo nível</span>?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Entre com sua conta Google e fale com a nossa equipe para começar o seu projeto hoje
            mesmo.
          </p>
          <Link
            to="/login"
            className="glow relative mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-3.5 font-semibold text-white transition hover:brightness-110"
          >
            Começar Agora <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
