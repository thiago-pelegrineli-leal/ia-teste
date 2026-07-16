import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCRzlIDkKJhHYCE_Vm9FUqr2dl0qjf08uI',
  authDomain: 'smart-applications-6ced1.firebaseapp.com',
  databaseURL: 'https://smart-applications-6ced1-default-rtdb.firebaseio.com',
  projectId: 'smart-applications-6ced1',
  storageBucket: 'smart-applications-6ced1.firebasestorage.app',
  messagingSenderId: '506238337127',
  appId: '1:506238337127:web:8e5f0af86ad743ad2294c2',
  measurementId: 'G-KDMR6TZQD3',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

isSupported().then((ok) => {
  if (ok) getAnalytics(app)
})

export const OWNER_EMAIL = 'thiaguinhopelegrinelileal@gmail.com'
