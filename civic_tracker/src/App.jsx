import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Header from './Components/Header'
import Footer from './Components/Footer'


import Landing from './Pages/Landing'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import AdminDashboard from './Pages/AdminDashboard'
import ReportIssue from './Pages/ReportIssue'
import UserReports from './Pages/UserReports'
import Profile from './Pages/Profile'

import AdminIssues from './Pages/AdminIssues'
import AdminUsers from './Pages/AdminUsers'
import AdminProfile from './Pages/AdminProfile'

import { getLoggedUser } from './utils/auth'
import LandingPage from './Pages/LandingPage'


function ProtectedRoute({ children }) {
  return getLoggedUser() ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const user = getLoggedUser()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}


function App() {

  const location = useLocation()

  // Hide the normal website Header and Footer on Admin pages
  const isAdminPage = location.pathname.startsWith('/admin')
  const isLandingPage = location.pathname === '/'


  return (
    <>
      {!isAdminPage && !isLandingPage && <Header />}

      <main className={isAdminPage ? '' : 'site-main'}>
        <Routes>

          {/* Public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User pages */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/report-issue" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
          {/* My Reports page */}
          <Route  path="/my-reports"  element={ <ProtectedRoute> <UserReports /> </ProtectedRoute> } />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin pages */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/issues" element={<AdminRoute><AdminIssues /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>}/>
          <Route path="/admin/profile" element={ <AdminRoute><AdminProfile /></AdminRoute>}/>

          {/* Unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPage && !isLandingPage && <Footer />}
      <ToastContainer position="bottom-right" autoClose={2000} theme="light" />
    </>
  )
}

export default App













