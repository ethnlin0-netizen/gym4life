import { useState } from 'react'
import Login from '../components/Login.tsx'
import Register from '../components/Register.tsx'

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<string>('register')

    return(
        <div className="flex h-screen">
            <div className="w-1/2">
                <h1>GYM4LIFE</h1>
                <p>Create and track workouts that count.</p>
            </div>
            <div className="w-1/2">
                <div>
                    <h1>Get Started</h1>
                    <button onClick={() => setActiveTab('register')}>Register</button>
                    <button onClick={() => setActiveTab('login')}>Login</button>
                    {activeTab === 'register' && <Register />}
                    {activeTab === 'login' && <Login />}
                </div>
            </div>
        </div>
    )
}

export default LandingPage