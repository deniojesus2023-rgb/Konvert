'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'

interface CartButtonProps {
  storeSlug: string
}

export default function CartButton({ storeSlug }: CartButtonProps) {
  const { itemCount, total } = useCart()

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-20">
      <Link
        href={`/${storeSlug}/checkout`}
        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/40 flex items-center gap-3"
      >
        <span className="bg-white/20 text-white text-sm px-2 py-0.5 rounded-md">
          {itemCount}
        </span>
        Ver carrinho
        <span className="font-bold">{formatCurrency(total)}</span>
      </Link>
    </div>
  )
}
