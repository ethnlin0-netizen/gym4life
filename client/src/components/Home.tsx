import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
function Home() {
    const auth = useAuth()
    const [workout, setWorkout] = useState(null)
    
    return(
        <div>
            <p className="text-[80px] text-left text-[#3A015C] mt-[40px] ml-[40px]" style={{ fontFamily: 'Oswald' }}>Welcome, {auth?.username}</p>
            {workout == null ? (
                <div className="rounded-2xl w-[252px] h-[356px] bg-[#3B353A] opacity-80 mt-[40px] ml-[60px]" />
            ) : (
                //workout card
                <div className="rounded-2xl w-[252px] h-[356px] bg-[#3B353A] opacity-80 mt-[40px] ml-[60px]" />
            )}
        </div>
    )
}

export default Home