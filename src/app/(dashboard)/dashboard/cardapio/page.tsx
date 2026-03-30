'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'

const DEMO_CATEGORIES = [
  {
    id: '1',
    name: 'Hambúrgueres',
    is_active: true,
    products: [
      { id: 'p1', name: 'X-Bacon', price: 32.9, description: 'Hambúrguer 180g, bacon, queijo, alface, tomate', is_available: true, image_url: null },
      { id: 'p2', name: 'X-Salada', price: 28.9, description: 'Hambúrguer 180g, queijo, alface, tomate, maionese', is_available: true, image_url: null },
      { id: 'p3', name: 'X-Frango', price: 25.9, description: 'Frango grelhado, queijo, alface, tomate', is_available: false, image_url: null },
    ],
  },
  {
    id: '2',
    name: 'Bebidas',
    is_active: true,
    products: [
      { id: 'p4', name: 'Coca-Cola Lata', price: 6.9, description: '350ml gelada', is_available: true, image_url: null },
      { id: 'p5', name: 'Suco Natural', price: 12.9, description: 'Laranja, limão ou maracujá', is_available: true, image_url: null },
    ],
  },
  {
    id: '3',
    name: 'Combos',
    is_active: true,
    products: [
      { id: 'p6', name: 'Combo Família', price: 89.9, description: '4 hambúrgueres + 4 refrigerantes + 2 batatas fritas', is_available: true, image_url: null },
    ],
  },
]

export default function CardapioPage() {
  const [categories, setCategories] = useState(DEMO_CATEGORIES)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('1')

  function toggleProduct(categoryId: string, productId: string) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              products: cat.products.map((p) =>
                p.id === productId ? { ...p, is_available: !p.is_available } : p
              ),
            }
          : cat
      )
    )
  }

  const totalProducts = categories.reduce((acc, c) => acc + c.products.length, 0)
  const activeProducts = categories.reduce((acc, c) => acc + c.products.filter((p) => p.is_available).length, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Cardápio</h1>
          <p className="text-white/50 text-sm">{activeProducts} de {totalProducts} itens disponíveis</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
            + Nova categoria
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium">
            + Novo produto
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${category.is_active ? 'bg-green-400' : 'bg-gray-500'}`} />
                <span className="font-semibold">{category.name}</span>
                <span className="text-white/40 text-sm">{category.products.length} itens</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-white/40 hover:text-white/70 text-sm transition-colors" onClick={(e) => e.stopPropagation()}>
                  Editar
                </button>
                <span className="text-white/30">{expandedCategory === category.id ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Products */}
            {expandedCategory === category.id && (
              <div className="border-t border-white/10">
                {category.products.map((product, i) => (
                  <div key={product.id} className={`flex items-center gap-4 px-6 py-4 ${i < category.products.length - 1 ? 'border-b border-white/5' : ''}`}>
                    {/* Image placeholder */}
                    <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center text-2xl shrink-0">
                      🍔
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${!product.is_available ? 'text-white/40' : ''}`}>{product.name}</span>
                        {!product.is_available && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Indisponível</span>
                        )}
                      </div>
                      <p className="text-white/40 text-sm truncate">{product.description}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-semibold text-blue-400">{formatCurrency(product.price)}</span>

                      {/* Toggle */}
                      <button
                        onClick={() => toggleProduct(category.id, product.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${product.is_available ? 'bg-blue-600' : 'bg-white/20'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${product.is_available ? 'left-5' : 'left-0.5'}`} />
                      </button>

                      <button className="text-white/30 hover:text-white/60 transition-colors text-sm">✏️</button>
                      <button className="text-white/30 hover:text-red-400 transition-colors text-sm">🗑️</button>
                    </div>
                  </div>
                ))}

                <div className="px-6 py-3 border-t border-white/5">
                  <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    + Adicionar produto nesta categoria
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
