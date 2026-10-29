import { useState } from 'react'
import Sidebar from './Sidebar.tsx'
import Home from './Home.tsx'
import Exercises from './Exercises.tsx'
import History from './History.tsx'
import Progress from './Progress.tsx'

//Dashboard just becomes a vessel to hold the other tabs
//flex flex-col stacks items vertically in sidebar
function Dashboard() {
    const [activeTab, setActiveTab] = useState<string>('home')

    return (
        <div className="flex h-screen bg-gradient-to-b from-[#11001C] from-[50%] to-[#1D104E]">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="w-4/5 min-w-0 overflow-y-auto">
                {activeTab === 'home' && <Home />}
                {activeTab === 'exercises' && <Exercises />}
                {activeTab === 'history' && <History />}
                {activeTab === 'progress' && <Progress />}
            </div>
        </div>
    )
}

export default Dashboard
