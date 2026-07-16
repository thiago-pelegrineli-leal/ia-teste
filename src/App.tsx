import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AdminRoute } from './components/Protected'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Terms } from './pages/Terms'
import { Admin } from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/termos" element={<Terms />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
