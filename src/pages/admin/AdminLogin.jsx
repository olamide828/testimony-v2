import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export default function AdminLogin() {
  const { admin, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  if (admin) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-2">NTA Worldwide</p>
          <h1 className="font-serif text-3xl text-gray-900">Testimony Parish</h1>
          <p className="font-sans text-sm text-gray-400 mt-2">Admin Portal</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input" placeholder="admin@testimonyparish.org" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pr-11" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
