import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import WebScraper from './WebScraper'

function Admin() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/jobs" element={<AdminDashboard />} />
      <Route path="/scraper" element={<WebScraper />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default Admin
