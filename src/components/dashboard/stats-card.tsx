interface StatsCardProps {
  label: string
  value: string
  change?: string
  changePositive?: boolean
  icon: string
}

export function StatsCard({ label, value, change, changePositive, icon }: StatsCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${changePositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {changePositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  )
}
