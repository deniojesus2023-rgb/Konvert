'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string | null
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (product_id: string) => void
  updateQuantity: (product_id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'konvert_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage errors
    }
  }, [items])

  function addItem(newItem: Omit<CartItem, 'quantity'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === newItem.product_id)
      if (existing) {
        return prev.map((i) =>
          i.product_id === newItem.product_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  function removeItem(product_id: string) {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id))
  }

  function updateQuantity(product_id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(product_id)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product_id === product_id ? { ...i, quantity } : i
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return ctx
}
