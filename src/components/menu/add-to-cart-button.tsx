'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface AddToCartButtonProps {
  product_id: string
  name: string
  price: number
  image_url?: string | null
}

export default function AddToCartButton({
  product_id,
  name,
  price,
  image_url,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem({ product_id, name, price, image_url })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <button
      onClick={handleClick}
      className={`mt-3 text-white text-sm px-4 py-1.5 rounded-lg transition-all font-medium ${
        added
          ? 'bg-green-600 hover:bg-green-500 scale-95'
          : 'bg-blue-600 hover:bg-blue-500'
      }`}
    >
      {added ? '✓ Adicionado' : 'Adicionar'}
    </button>
  )
}
