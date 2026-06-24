import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Settings, 
  LogOut,
  Edit2,
  Check,
  X,
  Shield,
  Heart,
  Briefcase
} from 'lucide-react'
import { userProfile } from '../utils/mockData'

function Profile() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...userProfile })

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      // Save changes
      console.log('Saving changes:', editData)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (type) => {
    setEditData(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [type]: !prev.notificationSettings[type]
      }
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-full opacity-80 blur-xl" />
          <div className="absolute inset-2 bg-luxury-deep rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-luxury-gold">{userProfile.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-1">{userProfile.name}</h1>
        <p className="text-gray-400 text-sm">{userProfile.email}</p>
        
        <button
          onClick={handleEditToggle}
          className="mt-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-colors"
        >
          <Edit2 className="w-5 h-5" />
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-luxury-gold text-luxury-deep'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'preferences'
              ? 'bg-luxury-gold text-luxury-deep'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          Preferences
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-luxury-gold text-luxury-deep'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          Settings
        </button>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div variants={itemVariants} className="luxury-card">
            <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <User className="w-5 h-5 text-luxury-gold" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-0.5">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  ) : (
                    <p className="font-medium text-white">{userProfile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <Mail className="w-5 h-5 text-luxury-gold" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-0.5">Email Address</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  ) : (
                    <p className="font-medium text-white">{userProfile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <Phone className="w-5 h-5 text-luxury-gold" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-0.5">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  ) : (
                    <p className="font-medium text-white">{userProfile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <MapPin className="w-5 h-5 text-luxury-gold" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-0.5">Preferred State</p>
                  {isEditing ? (
                    <select
                      name="state"
                      value={editData.state}
                      onChange={handleInputChange}
                      className="w-full bg-transparent text-white focus:outline-none"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  ) : (
                    <p className="font-medium text-white">{userProfile.state}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <Calendar className="w-5 h-5 text-luxury-gold" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-0.5">Member Since</p>
                  <p className="font-medium text-white">{userProfile.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <Clock className="w-5 h-5 text-luxury-gold" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-0.5">Last Login</p>
                  <p className="font-medium text-white">{userProfile.lastLogin}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div variants={itemVariants} className="luxury-card">
              <h3 className="text-lg font-semibold text-white mb-4">Job Preferences</h3>
              
              <div className="space-y-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Preferred Categories</p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.preferredCategories.map((category) => (
                    <span key={category} className="badge-luxury">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Preferred Qualifications</p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.preferredQualifications.map((qual) => (
                    <span key={qual} className="badge-luxury">
                      {qual}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="luxury-card">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              
              <div className="space-y-3">
                {Object.entries(userProfile.notificationSettings).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleNotificationToggle(key)}
                    className={`w-full flex items-center justify-between p-4 bg-white/5 rounded-xl transition-all ${
                      value ? 'border border-luxury-gold/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {key === 'email' && <Mail className="w-5 h-5 text-luxury-gold" />}
                      {key === 'push' && <Bell className="w-5 h-5 text-luxury-gold" />}
                      {key === 'sms' && <Phone className="w-5 h-5 text-luxury-gold" />}
                      <div>
                        <p className="font-medium text-white capitalize">{key}</p>
                        <p className="text-xs text-gray-400">Receive {key} notifications</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      value ? 'border-luxury-gold bg-luxury-gold' : 'border-gray-500 bg-transparent'
                    }`}>
                      {value && <Check className="w-4 h-4 text-luxury-deep" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div variants={itemVariants} className="luxury-card">
              <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="font-medium text-white">Privacy & Security</p>
                      <p className="text-xs text-gray-400">Manage your data and security settings</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="font-medium text-white">Notification Settings</p>
                      <p className="text-xs text-gray-400">Configure how you receive notifications</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="font-medium text-white">Appearance</p>
                      <p className="text-xs text-gray-400">Customize the look and feel</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="luxury-card">
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">❓</span>
                    <div>
                      <p className="font-medium text-white">Help Center</p>
                      <p className="text-xs text-gray-400">Find answers to common questions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="font-medium text-white">Contact Us</p>
                      <p className="text-xs text-gray-400">Get in touch with our support team</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="font-medium text-white">Rate the App</p>
                      <p className="text-xs text-gray-400">Help us improve your experience</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="luxury-card">
              <button className="w-full flex items-center justify-center gap-2 py-4 text-red-400 hover:text-red-300 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Profile
