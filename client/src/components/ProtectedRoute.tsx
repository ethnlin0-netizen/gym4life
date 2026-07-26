import { useAuth } from '../context/AuthContext.tsx'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const auth = useAuth()
    if(auth?.token) {
        return children
    } else {
        return <Navigate to='/' /> //since it's a return statement, use Navigate instead of useNavigate
    }
}

export default ProtectedRoute