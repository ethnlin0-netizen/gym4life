import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import { useAuth } from './context/AuthContext.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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