import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

// Demo store data — in production this comes from Supabase
const STORE = {
  name: 'Hamburgueria do João',
  slug: 'hamburgueria-joao',
  description: 'Os melhores hambúrgueres artesanais de São Paulo',
  is_open: true,
  delivery_fee: 5.0,
  min_order_value: 25.0,
  estimated_delivery_minutes: 45,
}

const CATEGORIES = [
  {
    id: '1',
    name: 'Hambúrgueres',
    products: [
      { id: 'p1', name: 'X-Bacon', price: 32.9, description: 'Hambúrguer 180g, bacon crocante, queijo cheddar, alface, tomate e maionese da casa', is_available: true },
      { id: 'p2', name: 'X-Salada', price: 28.9, description: 'Hambúrguer 180g, queijo prato, alface, tomate, pepino e mostarda', is_available: true },
      { id: 'p3', name: 'X-Frango', price: 25.9, description: 'Peito de frango grelhado, queijo, alface, tomate e maionese', is_available: true },
      { id: 'p4', name: 'X-Tudo', price: 39.9, description: 'Hambúrguer duplo, bacon, queijo, ovo, alface, tomate e molho especial', is_available: true },
    ],
  },
  {
    id: '2',
    name: 'Acompanhamentos',
    products: [
      { id: 'p5', name: 'Batata Frita', price: 14.9, description: 'Porção de batatas fritas crocantes com tempero especial', is_available: true },
      { id: 'p6', name: 'Onion Rings', price: 16.9, description: 'Anéis de cebola empanados e fritos', is_available: true },
    ],
  },
  {
    id: '3',
    name: 'Bebidas',
    products: [
      { id: 'p7', name: 'Coca-Cola Lata', price: 6.9, description: '350ml', is_available: true },
      { id: 'p8', name: 'Suco Natural', price: 12.9, description: 'Laranja, limão ou maracujá — 400ml', is_available: true },
      { id: 'p9', name: 'Água Mineral', price: 4.0, description: '500ml com ou sem gás', is_available: true },
    ],
  },
  {
    id: '4',
    name: 'Combos',
    products: [
      { id: 'p10', name: 'Combo Duplo', price: 54.9, description: '2 X-Bacon + 2 Batatas Fritas + 2 Coca-Colas', is_available: true },
      { id: 'p11', name: 'Combo Família', price: 89.9, description: '4 X-Bacon + 4 Batatas Fritas + 4 Coca-Colas', is_available: true },
    ],
  },
]

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      {/* Store header */}
      <div className="bg-gradient-to-br from-blue-900/40 to-[#0A0F1E] border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-600/30 border border-blue-500/30 rounded-xl flex items-center justify-center text-2xl">
              🍔
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{STORE.name}</h1>
              <p className="text-white/50 text-sm mt-1">{STORE.description}</p>
              <div className="flex items-center gap-3 mt-3 text-sm">
                <span className={`flex items-center gap-1.5 ${STORE.is_open ? 'text-green-400' : 'text-red-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${STORE.is_open ? 'bg-green-400' : 'bg-red-400'}`} />
                  {STORE.is_open ? 'Aberto' : 'Fechado'}
                </span>
                <span className="text-white/30">·</span>
                <span className="text-white/50">~{STORE.estimated_delivery_minutes} min</span>
                <span className="text-white/30">·</span>
                <span className="text-white/50">Entrega {formatCurrency(STORE.delivery_fee)}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/50">Mín. {formatCurrency(STORE.min_order_value)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="sticky top-0 z-10 bg-[#0A0F1E]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="shrink-0 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {CATEGORIES.map((category) => (
          <div key={category.id} id={`cat-${category.id}`}>
            <h2 className="text-lg font-bold mb-4">{category.name}</h2>
            <div className="space-y-3">
              {category.products.map((product) => (
                <div key={product.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-colors flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-semibold">{product.name}</span>
                      <span className="font-bold text-blue-400 ml-4 shrink-0">{formatCurrency(product.price)}</span>
                    </div>
                    <p className="text-white/50 text-sm">{product.description}</p>
                    <button className="mt-3 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium">
                      Adicionar
                    </button>
                  </div>
                  <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center text-3xl shrink-0">
                    🍔
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart floating button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
        <Link
          href={`/${storeSlug}/checkout`}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/40 flex items-center gap-3"
        >
          <span className="bg-white/20 text-white text-sm px-2 py-0.5 rounded-md">3</span>
          Ver carrinho
          <span className="font-bold">R$98,70</span>
        </Link>
      </div>
    </div>
  )
}
