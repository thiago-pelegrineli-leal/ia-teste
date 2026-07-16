import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db, googleProvider, OWNER_EMAIL } from '../lib/firebase'
import { defaultSettings } from '../lib/types'
import type { SiteSettings } from '../lib/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  settings: SiteSettings
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) {
        setSettings({ ...defaultSettings, ...(snap.data() as Partial<SiteSettings>) })
      }
    })
    return unsub
  }, [])

  const email = user?.email?.toLowerCase() ?? ''
  const isAdmin =
    !!email &&
    (email === OWNER_EMAIL.toLowerCase() ||
      settings.adminEmails.map((e) => e.toLowerCase()).includes(email))

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, settings, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
