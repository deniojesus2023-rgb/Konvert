'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Category, Product } from '@/lib/types'

type CategoryWithProducts = Category & { products: Product[] }

// ── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonCategory() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-pulse">
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <div className="h-4 bg-white/10 rounded w-32" />
        <div className="h-3 bg-white/10 rounded w-16" />
      </div>
    </div>
  )
}

// ── Modal Nova Categoria ─────────────────────────────────────────────────────
interface NewCategoryModalProps {
  storeId: string
  onClose: () => void
  onSaved: (category: CategoryWithProducts) => void
}

function NewCategoryModal({ storeId, onClose, onSaved }: NewCategoryModalProps) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('categories')
        .insert({ store_id: storeId, name: name.trim(), sort_order: 0 })
        .select()
        .single()
      if (err) throw err
      onSaved({ ...data, products: [] })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar categoria')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">Nova categoria</h2>

        <label className="block text-sm text-white/60 mb-1">Nome</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Ex: Hambúrgueres"
          className="w-full bg-white/5 border border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2 text-sm mb-4 transition-colors"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Modal Novo Produto ───────────────────────────────────────────────────────
interface NewProductModalProps {
  storeId: string
  categories: CategoryWithProducts[]
  defaultCategoryId?: string
  onClose: () => void
  onSaved: (categoryId: string, product: Product) => void
}

function NewProductModal({ storeId, categories, defaultCategoryId, onClose, onSaved }: NewProductModalProps) {
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? (categories[0]?.id ?? ''))
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim() || !price) return
    const parsedPrice = parseFloat(price.replace(',', '.'))
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Preço inválido')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('products')
        .insert({
          store_id: storeId,
          category_id: categoryId || null,
          name: name.trim(),
          description: description.trim() || null,
          price: parsedPrice,
          sort_order: 0,
        })
        .select()
        .single()
      if (err) throw err
      onSaved(categoryId, data as Product)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar produto')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">Novo produto</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-white/60 mb-1">Categoria</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2 text-sm transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Nome</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: X-Bacon"
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Descrição <span className="text-white/30">(opcional)</span></label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Hambúrguer 180g, bacon, queijo…"
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Preço (R$)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 32,90"
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 outline-none rounded-lg px-4 py-2 text-sm transition-colors"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !price}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CardapioPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storeId, setStoreId] = useState<string | null>(null)

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [productModalCategoryId, setProductModalCategoryId] = useState<string | undefined>()

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()

        const { data: { user }, error: authErr } = await supabase.auth.getUser()
        if (authErr || !user) throw new Error('Usuário não autenticado')

        const { data: org, error: orgErr } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_id', user.id)
          .single()
        if (orgErr || !org) throw new Error('Organização não encontrada')

        const { data: store, error: storeErr } = await supabase
          .from('stores')
          .select('id')
          .eq('organization_id', org.id)
          .limit(1)
          .single()
        if (storeErr || !store) throw new Error('Loja não encontrada. Crie sua loja primeiro.')

        const { data: cats, error: catsErr } = await supabase
          .from('categories')
          .select('*, products(*)')
          .eq('store_id', store.id)
          .order('sort_order')
        if (catsErr) throw catsErr

        if (!cancelled) {
          setStoreId(store.id)
          setCategories((cats as CategoryWithProducts[]) ?? [])
          if (cats && cats.length > 0) setExpandedCategory(cats[0].id)
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erro ao carregar cardápio')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // ── Toggle product availability ────────────────────────────────────────────
  async function toggleProduct(categoryId: string, product: Product) {
    const newValue = !product.is_available

    // Optimistic update
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, products: cat.products.map((p) => p.id === product.id ? { ...p, is_available: newValue } : p) }
          : cat
      )
    )

    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('products')
        .update({ is_available: newValue })
        .eq('id', product.id)
      if (err) throw err
    } catch {
      // Revert on error
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, products: cat.products.map((p) => p.id === product.id ? { ...p, is_available: !newValue } : p) }
            : cat
        )
      )
    }
  }

  // ── Delete product ─────────────────────────────────────────────────────────
  async function deleteProduct(categoryId: string, product: Product) {
    if (!window.confirm(`Excluir "${product.name}"? Esta ação não pode ser desfeita.`)) return

    // Optimistic remove
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, products: cat.products.filter((p) => p.id !== product.id) }
          : cat
      )
    )

    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('products').delete().eq('id', product.id)
      if (err) throw err
    } catch {
      // Revert — reload to restore correct state
      window.location.reload()
    }
  }

  // ── Callbacks from modals ──────────────────────────────────────────────────
  function handleCategorySaved(category: CategoryWithProducts) {
    setCategories((prev) => [...prev, category])
    setExpandedCategory(category.id)
    setShowCategoryModal(false)
  }

  function handleProductSaved(categoryId: string, product: Product) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, products: [...cat.products, product] } : cat
      )
    )
    setShowProductModal(false)
  }

  function openNewProductModal(categoryId?: string) {
    setProductModalCategoryId(categoryId)
    setShowProductModal(true)
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalProducts = categories.reduce((acc, c) => acc + c.products.length, 0)
  const activeProducts = categories.reduce((acc, c) => acc + c.products.filter((p) => p.is_available).length, 0)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Modals */}
      {showCategoryModal && storeId && (
        <NewCategoryModal
          storeId={storeId}
          onClose={() => setShowCategoryModal(false)}
          onSaved={handleCategorySaved}
        />
      )}
      {showProductModal && storeId && (
        <NewProductModal
          storeId={storeId}
          categories={categories}
          defaultCategoryId={productModalCategoryId}
          onClose={() => setShowProductModal(false)}
          onSaved={handleProductSaved}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Cardápio</h1>
          {loading ? (
            <div className="h-4 bg-white/10 rounded w-40 animate-pulse" />
          ) : (
            <p className="text-white/50 text-sm">{activeProducts} de {totalProducts} itens disponíveis</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            disabled={loading || !!error}
            className="bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm transition-colors"
          >
            + Nova categoria
          </button>
          <button
            onClick={() => openNewProductModal()}
            disabled={loading || !!error || categories.length === 0}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
          >
            + Novo produto
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-6 py-4 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCategory key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && categories.length === 0 && (
        <div className="text-center py-20 text-white/40">
          <p className="text-4xl mb-4">🍽️</p>
          <p className="text-lg font-medium mb-1">Cardápio vazio</p>
          <p className="text-sm">Crie uma categoria e adicione seus primeiros produtos.</p>
        </div>
      )}

      {/* Category list */}
      {!loading && !error && categories.length > 0 && (
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
                  <button
                    className="text-white/40 hover:text-white/70 text-sm transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Editar
                  </button>
                  <span className="text-white/30">{expandedCategory === category.id ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Products */}
              {expandedCategory === category.id && (
                <div className="border-t border-white/10">
                  {category.products.length === 0 && (
                    <div className="px-6 py-6 text-white/30 text-sm text-center">
                      Nenhum produto nesta categoria ainda.
                    </div>
                  )}
                  {category.products.map((product, i) => (
                    <div
                      key={product.id}
                      className={`flex items-center gap-4 px-6 py-4 ${i < category.products.length - 1 ? 'border-b border-white/5' : ''}`}
                    >
                      {/* Image placeholder */}
                      <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center text-2xl shrink-0">
                        {product.image_url
                          ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                          : '🍔'
                        }
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

                        {/* Availability toggle */}
                        <button
                          onClick={() => toggleProduct(category.id, product)}
                          title={product.is_available ? 'Desativar produto' : 'Ativar produto'}
                          className={`relative w-10 h-5 rounded-full transition-colors ${product.is_available ? 'bg-blue-600' : 'bg-white/20'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${product.is_available ? 'left-5' : 'left-0.5'}`} />
                        </button>

                        <button className="text-white/30 hover:text-white/60 transition-colors text-sm">✏️</button>
                        <button
                          onClick={() => deleteProduct(category.id, product)}
                          className="text-white/30 hover:text-red-400 transition-colors text-sm"
                          title="Excluir produto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="px-6 py-3 border-t border-white/5">
                    <button
                      onClick={() => openNewProductModal(category.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      + Adicionar produto nesta categoria
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
