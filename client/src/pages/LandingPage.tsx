import { useState } from 'react'
import Login from '../components/Login.tsx'
import Register from '../components/Register.tsx'

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<string>('register')

    return(
        <div>
            <button onClick={() => setActiveTab('register')}>Register</button>
            <button onClick={() => setActiveTab('login')}>Login</button>
            
            {activeTab === 'register' && <Register />}
            {activeTab === 'login' && <Login />}
        </div>
    )
}

export default LandingPage