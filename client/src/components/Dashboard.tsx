import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Home from '../components/Home.tsx'

//flex flex-col stacks items vertically in sidebar
function Dashboard() {
    const auth = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<string>('home')

    return (
        <div className="flex h-screen bg-gradient-to-b from-[#11001C] from-[50%] to-[#4F0082]">
            <div className="w-1/5 bg-gradient-to-b from-[#32003C]/40 from-[50%] to-[#8700A2]/40 pt-10">
                <h1 className="text-[40px] text-white text-center" style={{ fontFamily: 'Oswald' }}>GYM4LIFE</h1>
                <div className="w-[230px] h-[2px] mx-auto bg-gradient-to-r from-[#FFFFFF] from-[50%] to-[#999999]" />
                <nav className="flex flex-col gap-y-4" > 
                    <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => setActiveTab('home')}>Home</button>
                    <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => setActiveTab('exercises')}>Exercises</button>
                    <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => setActiveTab('history')}>History</button>
                    <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => setActiveTab('progress')}>Progress</button>
                    <p className="text-center text-[#7A7575] text-[28px]" style={{ fontFamily: 'Oswald' }}>Account</p>
                    <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => setActiveTab('settings')}>Settings</button>
                    <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => {
                        auth?.logout()
                        navigate('/')
                    }}>Log Out
                    </button>
                </nav>
            </div>
            <div className="w-4/5">
                {activeTab === 'home' && <Home />}
            </div>
        </div>
    )
}

export default Dashboard