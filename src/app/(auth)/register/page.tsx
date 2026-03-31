'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          organization_name: form.organizationName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const user = signUpData?.user
    if (!user) {
      setError('Não foi possível criar o usuário. Tente novamente.')
      setLoading(false)
      return
    }

    // Create organization
    const orgSlug = generateSlug(form.organizationName)
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: form.organizationName,
        slug: orgSlug || `org-${Math.random().toString(36).slice(2, 7)}`,
        owner_id: user.id,
        plan: 'starter',
      })
      .select()
      .single()

    if (orgError) {
      setError(`Conta criada, mas houve um erro ao configurar sua organização: ${orgError.message}`)
      setLoading(false)
      return
    }

    // Create store
    const storeSlug = generateSlug(form.organizationName)
    const { error: storeError } = await supabase
      .from('stores')
      .insert({
        organization_id: org.id,
        name: form.organizationName,
        slug: storeSlug || `store-${Math.random().toString(36).slice(2, 7)}`,
      })
      .select()
      .single()

    if (storeError) {
      setError(`Organização criada, mas houve um erro ao configurar sua loja: ${storeError.message}`)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold">K</div>
        <span className="font-bold text-2xl">Konvert</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Criar sua conta</h1>
          <p className="text-white/50 text-sm mb-8">14 dias grátis · Sem cartão de crédito</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Nome completo</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Seu nome"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Nome do restaurante / empresa</label>
              <input
                type="text"
                value={form.organizationName}
                onChange={(e) => update('organizationName', e.target.value)}
                placeholder="Ex: Hamburgueria do João"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Confirmar senha</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Repita a senha"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </button>
          </form>

          <p className="text-white/30 text-xs mt-4 text-center">
            Ao criar sua conta, você concorda com os Termos de Uso e Política de Privacidade.
          </p>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
