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
    const [recentWorkoutsRefresh, setRecentWorkoutsRefresh] = useState(0)

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
        // Reload after a workout is ended or deleted.
        let cancelled = false
        async function fetchCompletedWorkouts() {
            if(!auth?.token) return
            try {
                const res = await axios.get<Workout[]>('http://localhost:5000/api/workouts', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                if(!cancelled) {
                    setRecentCompleted(res.data.filter(w => w.status === 'completed').slice(0, 5))
                }
            } catch {
                if(!cancelled) setRecentCompleted(null)
            }
        }
        fetchCompletedWorkouts()
        return () => { cancelled = true }
    }, [auth?.token, recentWorkoutsRefresh])
    
    return(
        <div>
            <p className="text-[80px] text-left text-[#3A015C] mt-[40px] ml-[40px]" style={{ fontFamily: 'Oswald' }}>Welcome, {auth?.username}</p>
            {isLoading ? null : workout == null ? (
                <div className="ml-[60px] mt-[10px]">
                    <EmptyWorkoutCard onWorkoutCreated={setWorkout}/>
                </div>
            ) : (
                //active workout card
                <div className="ml-[60px] mt-[10px]">
                    <ActiveWorkoutCard
                        workout={workout}
                        onEnded={() => {
                            setWorkout(null)
                            setRecentWorkoutsRefresh(current => current + 1)
                        }}
                    />
                </div>
            )}
            <div className="w-[1080px] h-[1px] mx-auto mt-[35px] mr-[70px] bg-gradient-to-r from-[#FFFFFF] from-[50%] to-[#999999]" />
            <div className="ml-[60px]">
                <p className="text-[48px] text-left text-[#E7AD4E] mt-[10px]" style={{ fontFamily: 'Oswald' }}>Recent Workouts</p>
                {recentCompleted === null && <p>Could not load recent workouts.</p>}
                <div className="flex gap-x-[20px]">
                    {recentCompleted?.length === 0 ? <p>No workouts found.</p> : recentCompleted?.map((workout) => (
                        <CompletedWorkoutCard
                            key={workout._id}
                            workout={workout}
                            onDeleted={(workoutId) => {
                                setRecentCompleted(current => current?.filter(workout => workout._id !== workoutId) ?? [])
                                setRecentWorkoutsRefresh(current => current + 1)
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home
