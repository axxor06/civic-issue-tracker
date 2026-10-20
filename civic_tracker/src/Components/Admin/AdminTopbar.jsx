
import { FaBell, FaUserCircle } from 'react-icons/fa'

function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-heading">
        <h2>Community Operations Center</h2>
        <p>Monitor reports. Prioritize action. Improve communities.</p>
      </div>

      <div className="admin-topbar-user">

        <div className="admin-avatar">
          <FaUserCircle />
        </div>

        <div className="admin-user-info">
          <h6>Administrator</h6>
          <span>System Admin</span>
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar
