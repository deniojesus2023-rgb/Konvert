'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export function Sidebar() {
  const pathname = usePathname()

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
      <div className="px-4 py-3 border-b border-white/10">
        <button className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm hover:border-white/20 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600/30 rounded flex items-center justify-center text-xs">🏪</div>
            <span className="text-white/80">Loja Principal</span>
          </div>
          <span className="text-white/30 text-xs">▼</span>
        </button>
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
          <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center text-sm font-semibold">U</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Usuário</div>
            <div className="text-xs text-white/40 truncate">Plano Pro</div>
          </div>
          <button className="text-white/30 hover:text-white/60 transition-colors text-sm">↗</button>
        </div>
      </div>
    </aside>
  )
}
