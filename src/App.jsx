import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AIAnalytics from './pages/AIAnalytics'
import AirCredits from './pages/AirCredits'
import CompanyDashboard from './pages/CompanyDashboard'
import CreditsDashboard from './pages/CreditsDashboard'
import LandAllocation from './pages/LandAllocation'
import LoginPage from './pages/LoginPage'
import WaterCredits from './pages/WaterCredits'
import RegisterPage from './pages/RegisterPage'
import AdminRoutes from './admin/AdminRoutes'

function RootRedirect() {
  const { currentUser } = useAuth()

  return <Navigate to={currentUser ? '/dashboard' : '/login'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Portal — completely isolated */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/land" element={<LandAllocation />} />
        <Route path="/analytics" element={<AIAnalytics />} />
        <Route path="/credits" element={<CreditsDashboard />} />
        <Route path="/water" element={<WaterCredits />} />
        <Route path="/air" element={<AirCredits />} />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default App
