
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import './AdminLayout.css'

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminTopbar />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
