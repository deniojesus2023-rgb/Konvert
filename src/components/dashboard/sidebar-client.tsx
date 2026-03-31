'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/pedidos', label: 'Pedidos', icon: '📋' },
  { href: '/dashboard/cardapio', label: 'Cardápio', icon: '🍕' },
  { href: '/dashboard/clientes', label: 'Clientes', icon: '👥' },
  { href: '/dashboard/recuperacao', label: 'Recuperação', icon: '🔄' },
  { href: '/dashboard/motoboys', label: 'Motoboys', icon: '🏍️' },
  { href: '/dashboard/cupons', label: 'Cupons', icon: '🎟️' },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: '⚙️' },
]

const planLabels: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

type Store = {
  id: string
  name: string
  slug: string
}

type SidebarClientProps = {
  userName: string
  planName: string
  stores: Store[]
  currentStoreId: string | null
}

export function SidebarClient({ userName, planName, stores, currentStoreId }: SidebarClientProps) {
  const pathname = usePathname()
  const [selectedStoreId, setSelectedStoreId] = useState(currentStoreId ?? stores[0]?.id ?? null)
  const [storePickerOpen, setStorePickerOpen] = useState(false)

  const selectedStore = stores.find((s) => s.id === selectedStoreId) ?? stores[0]
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U'

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 min-h-screen bg-[#080D1A] border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/25">K</div>
          <span className="font-bold text-lg">Konvert</span>
        </Link>
      </div>

      {/* Store selector */}
      <div className="px-4 py-3 border-b border-white/10 relative">
        <button
          className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm hover:border-white/20 transition-colors"
          onClick={() => setStorePickerOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={storePickerOpen}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600/30 rounded flex items-center justify-center text-xs">🏪</div>
            <span className="text-white/80 truncate">
              {selectedStore?.name ?? 'Sem loja'}
            </span>
          </div>
          {stores.length > 1 && (
            <span className="text-white/30 text-xs">{storePickerOpen ? '▲' : '▼'}</span>
          )}
        </button>

        {storePickerOpen && stores.length > 1 && (
          <ul
            role="listbox"
            className="absolute left-4 right-4 top-full mt-1 z-10 bg-[#0E1526] border border-white/10 rounded-lg shadow-xl overflow-hidden"
          >
            {stores.map((store) => (
              <li key={store.id}>
                <button
                  role="option"
                  aria-selected={store.id === selectedStoreId}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    store.id === selectedStoreId
                      ? 'bg-blue-600/20 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => {
                    setSelectedStoreId(store.id)
                    setStorePickerOpen(false)
                  }}
                >
                  {store.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive(item.href)
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center text-sm font-semibold">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{userName || 'Usuário'}</div>
            <div className="text-xs text-white/40 truncate">
              Plano {planLabels[planName] ?? planName ?? 'Starter'}
            </div>
          </div>
          <Link
            href="/dashboard/configuracoes"
            className="text-white/30 hover:text-white/60 transition-colors text-sm"
            title="Configurações"
          >
            ↗
          </Link>
        </div>
      </div>
    </aside>
  )
}
