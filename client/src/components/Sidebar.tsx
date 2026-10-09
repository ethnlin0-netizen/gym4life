import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface SidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const auth = useAuth()
    const navigate = useNavigate()
    // the same JSX as now, with setActiveTab(...) replaced by onTabChange(...)
    return (
            <div className="w-1/5 bg-gradient-to-b from-[#32003C]/40 from-[50%] to-[#8700A2]/40 pt-10">
                <h1 className="text-[40px] text-white text-center" style={{ fontFamily: 'Oswald' }}>GYM4LIFE</h1>
            <div className="w-[230px] h-[2px] mx-auto bg-gradient-to-r from-[#FFFFFF] from-[50%] to-[#999999]" />
            <nav className="flex flex-col gap-y-4" > 
                <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => onTabChange('home')}>Home</button>
                <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => onTabChange('exercises')}>Exercises</button>
                <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => onTabChange('history')}>History</button>
                <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => onTabChange('progress')}>Progress</button>
                <p className="text-center text-[#7A7575] text-[28px]" style={{ fontFamily: 'Oswald' }}>Account</p>
                <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => onTabChange('settings')}>Settings</button>
                <button className="text-white text-[36px]" style={{ fontFamily: 'Oswald' }} onClick={() => {
                    auth?.logout()
                    navigate('/')
                }}>Log Out
                </button>
            </nav>
        </div>
    )
}

export default Sidebar