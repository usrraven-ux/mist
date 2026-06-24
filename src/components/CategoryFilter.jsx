import React from 'react'
import { motion } from 'framer-motion'

function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selected === category
        return (
          <motion.button
            key={category}
            onClick={() => onSelect(category)}
            whileTap={{ scale: 0.95 }}
            className={`filter-chip ${isSelected ? 'active' : ''}`}
            animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            {category}
          </motion.button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
