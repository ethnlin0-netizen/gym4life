import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import EmptyWorkoutCard from './EmptyWorkoutCard'
import type { Workout } from '../types/Workout.ts'
import axios from 'axios'

function Home() {
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchActiveWorkout() {
            if (!auth?.token) {
                setIsLoading(false)
                return
            }
            try {
                const res = await axios.get('http://localhost:5000/api/workouts/active', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                setWorkout(res.data ?? null)
            } catch {
                setWorkout(null)
            } finally {
                setIsLoading(false)
            }
        }
        fetchActiveWorkout()
    }, [auth?.token])
    
    return(
        <div>
            <p className="text-[80px] text-left text-[#3A015C] mt-[40px] ml-[40px]" style={{ fontFamily: 'Oswald' }}>Welcome, {auth?.username}</p>
            {isLoading ? null : workout == null ? (
                <div className="ml-[80px] mt-[35px]">
                    <EmptyWorkoutCard onWorkoutCreated={setWorkout}/>
                    <div className="w-[1080px] h-[1px] mx-auto mt-[35px] mr-[70px] bg-gradient-to-r from-[#FFFFFF] from-[50%] to-[#999999]" />
                    <p className="text-[48px] text-left text-[#E7AD4E] mt-[10px]" style={{ fontFamily: 'Oswald' }}>Recent Workouts</p>
                </div>
            ) : (
                //active workout card
                <div className="rounded-2xl w-[252px] h-[356px] bg-[#3B353A] opacity-80 mt-[40px] ml-[60px]" />
            )}
        </div>
    )
}

export default Home