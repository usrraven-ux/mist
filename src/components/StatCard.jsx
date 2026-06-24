import React from 'react'
import { motion } from 'framer-motion'

function StatCard({ icon, value, label, color = 'gold', trend = null }) {
  const colorClasses = {
    gold: 'text-luxury-gold bg-luxury-gold/10',
    purple: 'text-luxury-purple bg-luxury-purple/10',
    silver: 'text-luxury-silver bg-luxury-silver/10',
    green: 'text-emerald-400 bg-emerald-500/10',
    red: 'text-red-400 bg-red-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
  }

  const selectedColor = colorClasses[color] || colorClasses.gold

  return (
    <motion.div
      className="stat-card group"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedColor} transition-all group-hover:scale-110`}>
          {React.cloneElement(icon, {
            className: 'w-6 h-6'
          })}
        </div>
        
        {/* Content */}
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400 mt-1">{label}</p>
        </div>
        
        {/* Trend */}
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ml-auto ${
            trend > 0 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : 'bg-red-500/10 text-red-400'
          }`}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard
