import { useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, PlusCircle, Heart, User, MessageCircle, Bell, Plus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useMessageStore } from '@/store/messageStore'
import { useNotificationStore } from '@/store/notificationStore'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { conversations, subscribeConversations, getUnreadCount: getMsgUnread } = useMessageStore()
  const { notifications, subscribeNotifications, getUnreadCount: getNotifUnread } = useNotificationStore()

  useEffect(() => {
    if (!user) return
    const unsubConv = subscribeConversations(user.id)
    const unsubNotif = subscribeNotifications(user.id)
    return () => {
      unsubConv()
      unsubNotif()
    }
  }, [user?.id])

  const msgCount = user ? getMsgUnread(user.id) : 0
  const notifCount = user ? getNotifUnread(user.id) : 0

  const navItems = [
    { path: '/', icon: Home, label: 'الرئيسية' },
    { path: '/search', icon: Search, label: 'بحث' },
    { path: '/add', icon: PlusCircle, label: 'إضافة' },
    { path: '/favorites', icon: Heart, label: 'المفضلة' },
    { path: '/profile', icon: User, label: 'حسابي' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600 font-cairo">عقار</h1>
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <Link to="/messages" className="relative p-2">
                <MessageCircle size={22} className="text-slate-600" />
                {msgCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {msgCount}
                  </span>
                )}
              </Link>
              <Link to="/notifications" className="relative p-2">
                <Bell size={22} className="text-slate-600" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* Floating Add Button - يظهر دائماً في الصفحة الرئيسية بدون أي شرط */}
      {location.pathname === '/' && (
        <button
          onClick={() => {
            if (isAuthenticated) {
              navigate('/add')
            } else {
              navigate('/login?redirect=/add')
            }
          }}
          className="fixed bottom-24 left-5 z-[999] w-16 h-16 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-700 hover:scale-110 transition-all active:scale-95 border-4 border-white"
          aria-label="إضافة عقار جديد"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}