import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-luxury">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Logo Animation */}
        <motion.div
          className="relative w-20 h-20 mx-auto mb-6"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-3xl opacity-80" />
          <div className="absolute inset-2 bg-luxury-deep rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-luxury-gold">GR</span>
          </div>
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-luxury-gold rounded-full"
              style={{
                left: `${10 + i * 10}%`,
                top: `${10 + (i % 4) * 15}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          GovtRank Luxury
        </motion.h1>

        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Loading Premium Experience...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Spinner */}
        <motion.div
          className="mt-8 flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-luxury-gold" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
