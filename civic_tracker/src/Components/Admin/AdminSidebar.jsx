
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  FaLandmark,
  FaChartPie,
  FaExclamationCircle,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa'
import { logoutUser } from '../../utils/auth'



function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [placeholderMenu, setPlaceholderMenu] = useState('')

  const menuItems = [
    { name: 'Dashboard', icon: FaChartPie, path: '/admin' },
    { name: 'Issues', icon: FaExclamationCircle, path: '/admin/issues' },
    { name: 'Users', icon: FaUsers, path: '/admin/users' },
    { name: 'Profile', icon: FaUserCircle, path: '/admin/profile' }
  ]

  const handleMenuClick = (item) => {
    if (item.path) {
      setPlaceholderMenu('')
      navigate(item.path)
    } else {
      setPlaceholderMenu(item.name)
      alert(`${item.name} page will be built next.`)
    }
  }

  const handleLogout = () => {
    alert("Do you want to logout?")
    logoutUser()
    toast.success("Admin Logout Successfully")
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon">
          <FaLandmark />
        </div>

        <div>
          <h2>CivicPulse</h2>
          <p>ADMIN CENTER</p>
        </div>
      </div>

      <div className="admin-menu-heading">WORKSPACE</div>

      <nav className="admin-nav">
        {menuItems.map((item) => {
          const Icon = item.icon

          const isActive = item.path
            ? location.pathname === item.path
            : placeholderMenu === item.name

          return (
            <button
              key={item.name}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
              type="button"
            >
              <Icon />
              <span>{item.name}</span>
            </button>
          )
        })}
      </nav>

      <div className="admin-sidebar-bottom">
        <button
          className="admin-logout"
          type="button"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
