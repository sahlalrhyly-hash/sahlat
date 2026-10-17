import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import PropertyDetail from '@/pages/PropertyDetail'
import AddProperty from '@/pages/AddProperty'
import EditProperty from '@/pages/EditProperty'
import Favorites from '@/pages/Favorites'
import Messages from '@/pages/Messages'
import Chat from '@/pages/Chat'
import Notifications from '@/pages/Notifications'
import Profile from '@/pages/Profile'
import SearchPage from '@/pages/SearchPage'
import MapView from '@/pages/MapView'
import Settings from '@/pages/Settings'
import Admin from '@/pages/Admin'
import { useAuthStore } from '@/store/authStore'
import { usePropertyStore } from '@/store/propertyStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useAuthStore()
  if (!initialized) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useAuthStore()
  if (!initialized) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div></div>
  return isAuthenticated ? <Navigate to="/" /> : <>{children}</>
}

function App() {
  const { initAuth } = useAuthStore()
  const { subscribeProperties } = usePropertyStore()

  useEffect(() => {
    initAuth()
    const unsubscribe = subscribeProperties()
    return () => unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/add" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/chat/:userId/:propertyId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App