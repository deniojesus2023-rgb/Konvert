import { formatCurrency, formatDateShort } from '@/lib/utils'

const DEMO_CUSTOMERS = [
  { id: '1', name: 'João Silva', phone: '(11) 99999-0001', email: 'joao@email.com', total_orders: 12, total_spent: 845.6, last_order_at: '2026-03-28T14:30:00Z', tags: ['vip'] },
  { id: '2', name: 'Maria Santos', phone: '(11) 99999-0002', email: null, total_orders: 5, total_spent: 312.5, last_order_at: '2026-03-25T18:00:00Z', tags: [] },
  { id: '3', name: 'Carlos Lima', phone: '(11) 99999-0003', email: 'carlos@email.com', total_orders: 1, total_spent: 67.0, last_order_at: '2026-03-30T12:00:00Z', tags: ['novo'] },
  { id: '4', name: 'Ana Oliveira', phone: '(11) 99999-0004', email: null, total_orders: 8, total_spent: 560.0, last_order_at: '2026-02-10T19:00:00Z', tags: ['inativo'] },
  { id: '5', name: 'Roberto Sousa', phone: '(11) 99999-0005', email: 'roberto@email.com', total_orders: 22, total_spent: 1840.0, last_order_at: '2026-03-29T20:00:00Z', tags: ['vip'] },
  { id: '6', name: 'Fernanda Castro', phone: '(11) 99999-0006', email: null, total_orders: 3, total_spent: 189.5, last_order_at: '2026-03-15T16:00:00Z', tags: [] },
  { id: '7', name: 'Paulo Mendes', phone: '(11) 99999-0007', email: 'paulo@email.com', total_orders: 15, total_spent: 1020.0, last_order_at: '2026-03-28T21:00:00Z', tags: ['vip'] },
  { id: '8', name: 'Lucia Ferreira', phone: '(11) 99999-0008', email: null, total_orders: 2, total_spent: 98.0, last_order_at: '2026-01-20T13:00:00Z', tags: ['inativo'] },
]

const TAG_COLORS: Record<string, string> = {
  vip: 'bg-yellow-500/20 text-yellow-400',
  novo: 'bg-blue-500/20 text-blue-400',
  inativo: 'bg-red-500/20 text-red-400',
}

export default function ClientesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Clientes</h1>
          <p className="text-white/50 text-sm">{DEMO_CUSTOMERS.length} clientes cadastrados</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['Todos', 'VIP', 'Novos', 'Inativos'].map((f) => (
          <button key={f} className={`px-4 py-2 rounded-lg text-sm transition-colors ${f === 'Todos' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Cliente</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Telefone</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Pedidos</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Total gasto</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Último pedido</th>
              <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Tags</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {DEMO_CUSTOMERS.map((customer, i) => (
              <tr key={customer.id} className={`hover:bg-white/5 transition-colors ${i < DEMO_CUSTOMERS.length - 1 ? 'border-b border-white/5' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center text-sm font-semibold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{customer.name}</div>
                      {customer.email && <div className="text-white/40 text-xs">{customer.email}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/70 text-sm">{customer.phone}</td>
                <td className="px-6 py-4 text-sm">{customer.total_orders}</td>
                <td className="px-6 py-4 text-blue-400 text-sm font-medium">{formatCurrency(customer.total_spent)}</td>
                <td className="px-6 py-4 text-white/50 text-sm">{formatDateShort(customer.last_order_at)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {customer.tags.map((tag) => (
                      <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[tag] || 'bg-gray-500/20 text-gray-400'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="text-white/30 hover:text-blue-400 text-sm transition-colors">Ver →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
