import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import AddToCartButton from '@/components/menu/add-to-cart-button'
import CartButton from '@/components/menu/cart-button'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export default async function StorePage({ params }: PageProps) {
  const { storeSlug } = await params
  const supabase = await createClient()

  // Fetch store by slug (public policy: is_active = TRUE)
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', storeSlug)
    .eq('is_active', true)
    .single()

  if (!store) {
    notFound()
  }

  // Delivery settings come from JSONB column
  const deliverySettings = store.delivery_settings ?? {}
  const deliveryFee: number = deliverySettings.fee ?? 0
  const minOrder: number = deliverySettings.min_order ?? 0
  const estimatedMinutes: number = deliverySettings.estimated_minutes ?? 0

  // Fetch active categories with their products
  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(*)')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('sort_order')

  const safeCategories = categories ?? []

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      {/* Store header */}
      <div className="bg-gradient-to-br from-blue-900/40 to-[#0A0F1E] border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-start gap-4 mb-4">
            {store.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.logo_url}
                alt={store.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-600/30 border border-blue-500/30 rounded-xl flex items-center justify-center text-2xl shrink-0">
                🍔
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{store.name}</h1>
              {store.description && (
                <p className="text-white/50 text-sm mt-1">{store.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3 text-sm flex-wrap">
                <span
                  className={`flex items-center gap-1.5 ${
                    store.is_open ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      store.is_open ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  {store.is_open ? 'Aberto' : 'Fechado'}
                </span>
                {estimatedMinutes > 0 && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50">~{estimatedMinutes} min</span>
                  </>
                )}
                {deliveryFee > 0 && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50">Entrega {formatCurrency(deliveryFee)}</span>
                  </>
                )}
                {minOrder > 0 && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50">Mín. {formatCurrency(minOrder)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category nav */}
      {safeCategories.length > 0 && (
        <div className="sticky top-0 z-10 bg-[#0A0F1E]/95 backdrop-blur border-b border-white/10">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {safeCategories.map((cat) => (
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
      )}

      {/* Menu */}
      <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-8">
        {safeCategories.length === 0 && (
          <p className="text-white/40 text-center py-16">
            Nenhum produto disponível no momento.
          </p>
        )}
        {safeCategories.map((category) => {
          const products = (category.products ?? []).filter(
            (p: { is_available: boolean }) => p.is_available
          )
          if (products.length === 0) return null
          return (
            <div key={category.id} id={`cat-${category.id}`}>
              <h2 className="text-lg font-bold mb-4">{category.name}</h2>
              <div className="space-y-3">
                {products.map(
                  (product: {
                    id: string
                    name: string
                    price: number
                    promotional_price: number | null
                    description: string | null
                    image_url: string | null
                    is_available: boolean
                  }) => (
                    <div
                      key={product.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-colors flex gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-semibold">{product.name}</span>
                          <div className="ml-4 shrink-0 text-right">
                            {product.promotional_price != null &&
                            product.promotional_price < product.price ? (
                              <>
                                <span className="text-white/40 text-xs line-through block">
                                  {formatCurrency(product.price)}
                                </span>
                                <span className="font-bold text-green-400">
                                  {formatCurrency(product.promotional_price)}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-blue-400">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                        {product.description && (
                          <p className="text-white/50 text-sm">{product.description}</p>
                        )}
                        <AddToCartButton
                          product_id={product.id}
                          name={product.name}
                          price={
                            product.promotional_price != null &&
                            product.promotional_price < product.price
                              ? product.promotional_price
                              : product.price
                          }
                          image_url={product.image_url}
                        />
                      </div>
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center text-3xl">
                            🍔
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating cart button (client component — reads from CartContext) */}
      <CartButton storeSlug={storeSlug} />
    </div>
  )
}
