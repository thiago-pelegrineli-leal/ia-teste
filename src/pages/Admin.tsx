import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  Bot as BotIcon,
  CreditCard,
  FileText,
  Pencil,
  Plus,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import { db } from '../lib/firebase'
import { defaultSettings } from '../lib/types'
import type { Bot, Plan, SiteSettings } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

type Tab = 'bots' | 'plans' | 'terms' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof BotIcon }[] = [
  { id: 'bots', label: 'Bots', icon: BotIcon },
  { id: 'plans', label: 'Planos', icon: CreditCard },
  { id: 'terms', label: 'Termos', icon: FileText },
  { id: 'settings', label: 'Configurações', icon: Settings },
]

const inputCls =
  'w-full rounded-xl border border-brand-500/20 bg-surface-800 px-4 py-2.5 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-brand-500/60'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400'
const btnPrimary =
  'rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60'
const btnGhost =
  'rounded-xl border border-brand-500/25 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-brand-500/10'

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-sm rounded-2xl p-7 text-center"
      >
        <p className="text-sm text-slate-200">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={onCancel} className={btnGhost}>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-500/90 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Excluir
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const emptyBot = {
  name: '',
  description: '',
  status: 'online' as Bot['status'],
  inviteUrl: '',
  imageUrl: '',
  tags: '',
}

function BotsTab() {
  const { toast } = useToast()
  const [bots, setBots] = useState<Bot[]>([])
  const [form, setForm] = useState(emptyBot)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    return onSnapshot(query(collection(db, 'bots'), orderBy('createdAt', 'desc')), (snap) =>
      setBots(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bot)),
    )
  }, [])

  const openNew = () => {
    setForm(emptyBot)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (bot: Bot) => {
    setForm({
      name: bot.name,
      description: bot.description,
      status: bot.status,
      inviteUrl: bot.inviteUrl,
      imageUrl: bot.imageUrl,
      tags: bot.tags?.join(', ') ?? '',
    })
    setEditingId(bot.id)
    setShowForm(true)
  }

  const save = async () => {
    if (!form.name.trim()) {
      toast('Informe o nome do bot.', 'error')
      return
    }
    setSaving(true)
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        inviteUrl: form.inviteUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }
      if (editingId) {
        await updateDoc(doc(db, 'bots', editingId), data)
        toast('Bot atualizado com sucesso.')
      } else {
        await addDoc(collection(db, 'bots'), { ...data, createdAt: Date.now() })
        toast('Bot adicionado com sucesso.')
      }
      setShowForm(false)
    } catch {
      toast('Erro ao salvar o bot.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    setDeleting(null)
    try {
      await deleteDoc(doc(db, 'bots', id))
      toast('Bot removido.')
    } catch {
      toast('Erro ao remover o bot.', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Bots cadastrados</h2>
        <button onClick={openNew} className={`${btnPrimary} flex items-center gap-2`}>
          <Plus size={16} /> Novo Bot
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {bots.length === 0 && (
          <p className="rounded-xl border border-dashed border-brand-500/20 p-8 text-center text-sm text-slate-500">
            Nenhum bot cadastrado ainda.
          </p>
        )}
        {bots.map((bot) => (
          <motion.div
            key={bot.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass flex items-center gap-4 rounded-xl p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
              <BotIcon size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{bot.name}</p>
              <p className="truncate text-xs text-slate-400">{bot.description}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                bot.status === 'online'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : bot.status === 'manutencao'
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'bg-red-500/15 text-red-300'
              }`}
            >
              {bot.status === 'online' ? 'Online' : bot.status === 'manutencao' ? 'Manutenção' : 'Offline'}
            </span>
            <button
              onClick={() => openEdit(bot)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-500/10 hover:text-brand-300"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setDeleting(bot.id)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl p-7"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  {editingId ? 'Editar Bot' : 'Novo Bot'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-500/10"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <label className={labelCls}>Nome</label>
                  <input
                    className={inputCls}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nome do bot"
                  />
                </div>
                <div>
                  <label className={labelCls}>Descrição</label>
                  <textarea
                    className={`${inputCls} min-h-24 resize-y`}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="O que este bot faz"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Status</label>
                    <select
                      className={inputCls}
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Bot['status'] })}
                    >
                      <option value="online">Online</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Tags (separadas por vírgula)</label>
                    <input
                      className={inputCls}
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="moderação, música"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Link de convite</label>
                  <input
                    className={inputCls}
                    value={form.inviteUrl}
                    onChange={(e) => setForm({ ...form, inviteUrl: e.target.value })}
                    placeholder="https://discord.com/oauth2/..."
                  />
                </div>
                <div>
                  <label className={labelCls}>URL da imagem (opcional)</label>
                  <input
                    className={inputCls}
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className={btnGhost}>
                  Cancelar
                </button>
                <button onClick={save} disabled={saving} className={btnPrimary}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {deleting && (
          <ConfirmDialog
            message="Tem certeza que deseja excluir este bot? Esta ação não pode ser desfeita."
            onConfirm={() => remove(deleting)}
            onCancel={() => setDeleting(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const emptyPlan = {
  name: '',
  price: '',
  period: 'mês',
  description: '',
  features: '',
  highlighted: false,
  order: 0,
}

function PlansTab() {
  const { toast } = useToast()
  const [plans, setPlans] = useState<Plan[]>([])
  const [form, setForm] = useState(emptyPlan)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    return onSnapshot(query(collection(db, 'plans'), orderBy('order', 'asc')), (snap) =>
      setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Plan)),
    )
  }, [])

  const openNew = () => {
    setForm({ ...emptyPlan, order: plans.length })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (plan: Plan) => {
    setForm({
      name: plan.name,
      price: plan.price,
      period: plan.period,
      description: plan.description,
      features: plan.features?.join('\n') ?? '',
      highlighted: plan.highlighted,
      order: plan.order,
    })
    setEditingId(plan.id)
    setShowForm(true)
  }

  const save = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      toast('Informe nome e preço do plano.', 'error')
      return
    }
    setSaving(true)
    try {
      const data = {
        name: form.name.trim(),
        price: form.price.trim(),
        period: form.period.trim(),
        description: form.description.trim(),
        features: form.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        highlighted: form.highlighted,
        order: Number(form.order) || 0,
      }
      if (editingId) {
        await updateDoc(doc(db, 'plans', editingId), data)
        toast('Plano atualizado com sucesso.')
      } else {
        await addDoc(collection(db, 'plans'), data)
        toast('Plano adicionado com sucesso.')
      }
      setShowForm(false)
    } catch {
      toast('Erro ao salvar o plano.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    setDeleting(null)
    try {
      await deleteDoc(doc(db, 'plans', id))
      toast('Plano removido.')
    } catch {
      toast('Erro ao remover o plano.', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Planos cadastrados</h2>
        <button onClick={openNew} className={`${btnPrimary} flex items-center gap-2`}>
          <Plus size={16} /> Novo Plano
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {plans.length === 0 && (
          <p className="rounded-xl border border-dashed border-brand-500/20 p-8 text-center text-sm text-slate-500">
            Nenhum plano cadastrado ainda.
          </p>
        )}
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass flex items-center gap-4 rounded-xl p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
              <CreditCard size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {plan.name}
                {plan.highlighted && (
                  <span className="ml-2 rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-300">
                    Destaque
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-slate-400">
                {plan.price}
                {plan.period ? `/${plan.period}` : ''}
              </p>
            </div>
            <button
              onClick={() => openEdit(plan)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-500/10 hover:text-brand-300"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setDeleting(plan.id)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl p-7"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  {editingId ? 'Editar Plano' : 'Novo Plano'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-500/10"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <label className={labelCls}>Nome</label>
                  <input
                    className={inputCls}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Plano Básico"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelCls}>Preço</label>
                    <input
                      className={inputCls}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="R$ 29,90"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Período</label>
                    <input
                      className={inputCls}
                      value={form.period}
                      onChange={(e) => setForm({ ...form, period: e.target.value })}
                      placeholder="mês"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Ordem</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Descrição curta</label>
                  <input
                    className={inputCls}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Ideal para servidores pequenos"
                  />
                </div>
                <div>
                  <label className={labelCls}>Recursos (um por linha)</label>
                  <textarea
                    className={`${inputCls} min-h-28 resize-y`}
                    value={form.features}
                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                    placeholder={'1 bot personalizado\nSuporte por 30 dias\nHospedagem inclusa'}
                  />
                </div>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.highlighted}
                    onChange={(e) => setForm({ ...form, highlighted: e.target.checked })}
                    className="h-4 w-4 accent-brand-500"
                  />
                  Destacar este plano como o mais popular
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className={btnGhost}>
                  Cancelar
                </button>
                <button onClick={save} disabled={saving} className={btnPrimary}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {deleting && (
          <ConfirmDialog
            message="Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita."
            onConfirm={() => remove(deleting)}
            onCancel={() => setDeleting(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function TermsTab() {
  const { settings } = useAuth()
  const { toast } = useToast()
  const [terms, setTerms] = useState(settings.termsOfService)
  const [privacy, setPrivacy] = useState(settings.privacyPolicy)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTerms(settings.termsOfService)
    setPrivacy(settings.privacyPolicy)
  }, [settings.termsOfService, settings.privacyPolicy])

  const save = async () => {
    setSaving(true)
    try {
      await setDoc(
        doc(db, 'settings', 'site'),
        { termsOfService: terms, privacyPolicy: privacy },
        { merge: true },
      )
      toast('Termos salvos com sucesso.')
    } catch {
      toast('Erro ao salvar os termos.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Termos e Políticas</h2>
      <div className="mt-6 space-y-6">
        <div>
          <label className={labelCls}>Termos de Serviço</label>
          <textarea
            className={`${inputCls} min-h-56 resize-y`}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Escreva aqui os termos de serviço..."
          />
        </div>
        <div>
          <label className={labelCls}>Política de Privacidade</label>
          <textarea
            className={`${inputCls} min-h-56 resize-y`}
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            placeholder="Escreva aqui a política de privacidade..."
          />
        </div>
        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className={btnPrimary}>
            {saving ? 'Salvando...' : 'Salvar Termos'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  const { settings } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState<SiteSettings>(defaultSettings)
  const [adminEmailsText, setAdminEmailsText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(settings)
    setAdminEmailsText(settings.adminEmails.join('\n'))
  }, [settings])

  const save = async () => {
    setSaving(true)
    try {
      await setDoc(
        doc(db, 'settings', 'site'),
        {
          discordInviteUrl: form.discordInviteUrl.trim(),
          contactEmail: form.contactEmail.trim(),
          heroSubtitle: form.heroSubtitle.trim(),
          adminEmails: adminEmailsText
            .split('\n')
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean),
        },
        { merge: true },
      )
      toast('Configurações salvas com sucesso.')
    } catch {
      toast('Erro ao salvar as configurações.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold">Configurações do Site</h2>
      <div className="mt-6 space-y-5">
        <div>
          <label className={labelCls}>Subtítulo da página inicial</label>
          <textarea
            className={`${inputCls} min-h-20 resize-y`}
            value={form.heroSubtitle}
            onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Convite do Discord</label>
            <input
              className={inputCls}
              value={form.discordInviteUrl}
              onChange={(e) => setForm({ ...form, discordInviteUrl: e.target.value })}
              placeholder="https://discord.gg/..."
            />
          </div>
          <div>
            <label className={labelCls}>E-mail de contato</label>
            <input
              className={inputCls}
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              placeholder="contato@exemplo.com"
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>E-mails de administradores (um por linha)</label>
          <textarea
            className={`${inputCls} min-h-28 resize-y`}
            value={adminEmailsText}
            onChange={(e) => setAdminEmailsText(e.target.value)}
            placeholder={'admin@exemplo.com'}
          />
          <p className="mt-2 text-xs text-slate-500">
            O e-mail do proprietário sempre tem acesso ao painel, independente desta lista.
          </p>
        </div>
        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className={btnPrimary}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('bots')

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold">
          Painel <span className="text-gradient">Administrativo</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Conectado como {user?.displayName ?? user?.email}
        </p>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? 'glow bg-gradient-to-r from-brand-500 to-brand-700 text-white'
                : 'glass text-slate-300 hover:text-white'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass mt-6 rounded-2xl p-6 sm:p-8"
      >
        {tab === 'bots' && <BotsTab />}
        {tab === 'plans' && <PlansTab />}
        {tab === 'terms' && <TermsTab />}
        {tab === 'settings' && <SettingsTab />}
      </motion.div>
    </div>
  )
}
