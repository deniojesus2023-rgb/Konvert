'use client'

import { useState } from 'react'

const DEMO_DRIVERS = [
  { id: '1', name: 'Marcos Vieira', phone: '(11) 97777-0001', vehicle: 'motorcycle', status: 'available', current_deliveries: 0, total_deliveries: 284 },
  { id: '2', name: 'Lucas Carvalho', phone: '(11) 97777-0002', vehicle: 'motorcycle', status: 'busy', current_deliveries: 2, total_deliveries: 519 },
  { id: '3', name: 'André Santos', phone: '(11) 97777-0003', vehicle: 'bicycle', status: 'available', current_deliveries: 0, total_deliveries: 87 },
  { id: '4', name: 'Felipe Rocha', phone: '(11) 97777-0004', vehicle: 'motorcycle', status: 'offline', current_deliveries: 0, total_deliveries: 142 },
  { id: '5', name: 'Gabriel Lima', phone: '(11) 97777-0005', vehicle: 'car', status: 'busy', current_deliveries: 1, total_deliveries: 63 },
]

const VEHICLE_ICONS: Record<string, string> = {
  motorcycle: '🏍️',
  bicycle: '🚲',
  car: '🚗',
  on_foot: '🚶',
}

const VEHICLE_LABELS: Record<string, string> = {
  motorcycle: 'Moto',
  bicycle: 'Bicicleta',
  car: 'Carro',
  on_foot: 'A pé',
}

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-500/20 text-green-400 border-green-500/30',
  busy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  offline: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Disponível',
  busy: 'Em entrega',
  offline: 'Offline',
}

export default function MotoboysPage() {
  const [drivers] = useState(DEMO_DRIVERS)

  const available = drivers.filter((d) => d.status === 'available').length
  const busy = drivers.filter((d) => d.status === 'busy').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Motoboys</h1>
          <p className="text-white/50 text-sm">{available} disponíveis · {busy} em entrega</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Cadastrar motoboy
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Disponíveis', value: available, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Em entrega', value: busy, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { label: 'Offline', value: drivers.filter((d) => d.status === 'offline').length, color: 'text-gray-400', bg: 'bg-white/5 border-white/10' },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-5 text-center ${s.bg}`}>
            <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-white/50 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Drivers grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-blue-500/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/30 rounded-full flex items-center justify-center text-lg font-semibold">
                  {driver.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{driver.name}</div>
                  <div className="text-white/50 text-sm">{driver.phone}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[driver.status]}`}>
                {STATUS_LABELS[driver.status]}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-2 text-white/60">
                <span>{VEHICLE_ICONS[driver.vehicle]}</span>
                <span>{VEHICLE_LABELS[driver.vehicle]}</span>
              </div>
              <div className="text-white/40">
                {driver.total_deliveries} entregas totais
              </div>
            </div>

            {driver.status === 'busy' && driver.current_deliveries > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 text-sm text-yellow-400 mb-4">
                {driver.current_deliveries} entrega{driver.current_deliveries > 1 ? 's' : ''} em andamento
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm py-2 rounded-lg transition-colors">
                Ver entregas
              </button>
              <button className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-sm py-2 rounded-lg transition-colors">
                ✏️
              </button>
            </div>
          </div>
        ))}

        {/* Add driver card */}
        <button className="border-2 border-dashed border-white/10 hover:border-blue-500/30 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-blue-400 transition-colors min-h-[180px]">
          <span className="text-3xl">+</span>
          <span className="text-sm">Cadastrar motoboy</span>
        </button>
      </div>
    </div>
  )
}
