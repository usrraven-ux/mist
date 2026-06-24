import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'

function MobileNav({ navItems }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-inset-bottom"
    >
      <div className="bg-luxury-deep/90 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <motion.button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`flex flex-col items-center gap-1 py-2 px-4 relative ${isActive ? 'text-luxury-gold' : 'text-gray-400'}`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-luxury-gold' : 'text-gray-400'}`} />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="absolute top-1 right-1 bg-luxury-gold text-luxury-deep text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    className="absolute -top-0.5 left-0 right-0 h-0.5 bg-luxury-gold"
                    layoutId="activeTab"
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}

export default MobileNav
