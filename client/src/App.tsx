import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import { useAuth } from './context/AuthContext.tsx'

function App() {
  const auth = useAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {auth?.token ? <Navigate to='/dashboard' /> : <LandingPage />} />
        <Route path = "/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App