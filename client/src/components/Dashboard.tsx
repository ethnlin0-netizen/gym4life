import { useState } from 'react'
import Sidebar from './Sidebar.tsx'
import { useLocation } from 'react-router-dom'
import Home from './Home.tsx'

//Dashboard just becomes a vessel to hold the other tabs
//flex flex-col stacks items vertically in sidebar
function Dashboard() {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState<string>('home')

    return (
        <div className="flex h-screen bg-gradient-to-b from-[#11001C] from-[50%] to-[#1D104E]">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="w-4/5">
                {activeTab === 'home' && <Home />}
            </div>
        </div>
    )
}

export default Dashboard