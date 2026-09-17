import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import EmptyWorkoutCard from './EmptyWorkoutCard'
import ActiveWorkoutCard from './ActiveWorkoutCard'
import CompletedWorkoutCard from './CompletedWorkoutCard'
import type { Workout } from '../types/Workout'
import axios from 'axios'

function Home() {
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [recentCompleted, setRecentCompleted] = useState<Workout[] | null>([])

    //fetching the active workout is a network request that needs to run once when Home first appears, so useEffect is needed
    useEffect(() => {
        async function fetchActiveWorkout() {
            if (!auth?.token) {
                setIsLoading(false)
                return
            }
            try {
                const res = await axios.get('http://localhost:5000/api/workouts/active', {
                    headers: { Authorization: `Bearer ${auth?.token}` }
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

    useEffect(() => {
        //recent workout code here
        async function fetchCompletedWorkouts() {
            try {
                const res = await axios.get<Workout[]>('http://localhost:5000/api/workouts', {
                    headers: { Authorization: `Bearer: ${auth?.token}` }
                })
                //check if this right and if it needs the ?? null
                setRecentCompleted(res.data.filter(w => w.status === 'completed').slice(0, 5))
            } catch {
                setRecentCompleted(null)
            }
        }
        fetchCompletedWorkouts()
    }, [auth?.token])
    
    return(
        <div>
            <p className="text-[80px] text-left text-[#3A015C] mt-[40px] ml-[40px]" style={{ fontFamily: 'Oswald' }}>Welcome, {auth?.username}</p>
            {isLoading ? null : workout == null ? (
                <div className="ml-[80px] mt-[35px]">
                    <EmptyWorkoutCard onWorkoutCreated={setWorkout}/>
                </div>
            ) : (
                //active workout card
                <div className="ml-[80px] mt-[35px]">
                    <ActiveWorkoutCard workout={workout} onEnded={() => setWorkout(null)} />
                </div>
            )}
            <div className="w-[1080px] h-[1px] mx-auto mt-[35px] mr-[70px] bg-gradient-to-r from-[#FFFFFF] from-[50%] to-[#999999]" />
            <div className="ml-[60px]">
                <p className="text-[48px] text-left text-[#E7AD4E] mt-[10px]" style={{ fontFamily: 'Oswald' }}>Recent Workouts</p>
                {recentCompleted?.length === 0 ? <p>No workouts found.</p> : recentCompleted?.map((workout) => (
                    <CompletedWorkoutCard key={workout._id} workout={workout} />
                ))}
            </div>
        </div>
    )
}

export default Home