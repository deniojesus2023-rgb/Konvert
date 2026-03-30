import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    out_for_delivery: 'Em entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    confirmed: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    preparing: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    ready: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    out_for_delivery: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    delivered: 'bg-green-500/20 text-green-300 border border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border border-red-500/30',
  }
  return colors[status] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
}

export function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    own: 'Próprio',
    ifood: 'iFood',
    whatsapp: 'WhatsApp',
    phone: 'Telefone',
    other: 'Outro',
  }
  return labels[source] || source
}

export function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    own: 'bg-blue-500/20 text-blue-300',
    ifood: 'bg-red-500/20 text-red-300',
    whatsapp: 'bg-green-500/20 text-green-300',
    phone: 'bg-gray-500/20 text-gray-300',
  }
  return colors[source] || 'bg-gray-500/20 text-gray-300'
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  return phone
}
