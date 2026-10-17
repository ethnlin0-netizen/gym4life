import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import EmptyWorkoutCard from './EmptyWorkoutCard'
import ActiveWorkoutCard from './ActiveWorkoutCard'
import CompletedWorkoutCard from './CompletedWorkoutCard'
import type { Workout } from '../types/Workout'
import axios from 'axios'
import { Dumbbell, Layers, CalendarDays } from 'lucide-react'

function Home() {
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [recentCompleted, setRecentCompleted] = useState<Workout[] | null>([])
    const [recentWorkoutsRefresh, setRecentWorkoutsRefresh] = useState(0)
    const [isLoadingRecent, setIsLoadingRecent] = useState(true)

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
            if(!auth?.token) {
                setIsLoadingRecent(false)
                return
            }
            setIsLoadingRecent(true)
            try {
                const res = await axios.get<Workout[]>('http://localhost:5000/api/workouts', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                if(!cancelled) {
                    setRecentCompleted(res.data.filter(w => w.status === 'completed'))
                }
            } catch {
                if(!cancelled) setRecentCompleted(null)
            } finally {
                if(!cancelled) setIsLoadingRecent(false)
            }
        }
        fetchCompletedWorkouts()
        return () => { cancelled = true }
    }, [auth?.token, recentWorkoutsRefresh])
    
    const completedSets = recentCompleted?.reduce((total, workout) =>
        total + workout.exercises.reduce((sets, exercise) => sets + exercise.sets.length, 0), 0)
    const lastSession = recentCompleted?.[0]

    return(
        <div className="mx-auto max-w-[1250px] px-[25px] py-[35px] lg:px-[45px] text-[#D0B1FC]" style={{ fontFamily: 'Oswald' }}>
            <header className="flex flex-wrap items-end justify-between gap-[20px] mb-[30px]">
                <div>
                    <p className="text-[12px] tracking-[3px] uppercase text-[#02ECF6]" style={{ fontFamily: 'Orbitron' }}>Your training space</p>
                    <h1 className="mt-[10px] text-[38px] lg:text-[48px] leading-tight text-white">Welcome back, {auth?.username}.</h1>
                    <p className="mt-[10px] text-[18px] text-[#B2A2CF]">Build your session. Log your sets. Keep moving forward.</p>
                </div>
                <span className="rounded-full border border-[#41235C] bg-[#D0B1FC]/5 px-[15px] py-[8px] text-[14px]">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
            </header>

            <div className="grid gap-[25px] xl:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]">
                <section className="min-w-0 rounded-[20px] border border-[#801454]/60 bg-gradient-to-br from-[#280D3F] to-[#12061F] p-[25px]">
                    <div className="flex items-center gap-[10px] mb-[20px]">
                        <Dumbbell size={22} className="text-[#FF2D78]" />
                        <h2 className="text-[24px] text-white">Your next move</h2>
                    </div>
                    {isLoading ? <p role="status">Loading your session...</p> : workout == null ? (
                        <EmptyWorkoutCard onWorkoutCreated={setWorkout}/>
                    ) : (
                        <ActiveWorkoutCard
                            workout={workout}
                            onEnded={() => {
                                setWorkout(null)
                                setRecentWorkoutsRefresh(current => current + 1)
                            }}
                        />
                    )}
                </section>

                <section className="rounded-[20px] border border-[#41235C] bg-[#12061F]/80 p-[25px]">
                    <p className="text-[12px] tracking-[2px] uppercase text-[#75569A]" style={{ fontFamily: 'Orbitron' }}>Training overview</p>
                    <h2 className="text-[24px] text-white mt-[8px] mb-[20px]">One session at a time.</h2>
                    <div className="flex items-center justify-between border-b border-[#41235C] pb-[12px]">
                        <span className="flex items-center gap-[10px]"><Dumbbell size={18} /> Completed workouts</span>
                        <span className="text-[28px] text-[#E7AD4E]">{isLoadingRecent ? '—' : recentCompleted?.length ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#41235C] py-[12px]">
                        <span className="flex items-center gap-[10px]"><Layers size={18} /> Sets logged</span>
                        <span className="text-[28px] text-[#02ECF6]">{isLoadingRecent ? '—' : completedSets ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-[10px] pt-[15px]">
                        <span className="flex items-center gap-[10px]"><CalendarDays size={18} /> Latest session</span>
                        <span className="text-white">{lastSession ? new Date(lastSession.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span>
                    </div>
                    <p className="mt-[20px] text-[13px] text-[#75569A]">Based on your saved completed workouts.</p>
                </section>
            </div>

            <section className="mt-[35px]">
                <div className="flex flex-wrap items-end justify-between gap-[10px] mb-[20px]">
                    <div>
                        <h2 className="text-[30px] text-white">Recent workouts</h2>
                        <p className="mt-[5px] text-[#B2A2CF]">Your last six sessions, ready to revisit.</p>
                    </div>
                    <span className="text-[12px] uppercase tracking-[2px] text-[#E7AD4E]" style={{ fontFamily: 'Orbitron' }}>Session log</span>
                </div>
                {isLoadingRecent && <p role="status" className="mb-[15px]">Loading recent workouts...</p>}
                {!isLoadingRecent && recentCompleted === null && <p role="alert" className="text-[#FF2D78]">Could not load recent workouts.</p>}
                {!isLoadingRecent && recentCompleted?.length === 0 && (
                    <div className="rounded-[16px] border border-dashed border-[#41235C] p-[30px] text-center bg-[#D0B1FC]/5">
                        <p className="text-[22px] text-white">Your first session starts here.</p>
                        <p className="mt-[8px] text-[#B2A2CF]">Finish a workout and it will appear in your session log.</p>
                    </div>
                )}
                <div className="grid gap-[15px] sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                    {recentCompleted?.slice(0, 6).map((workout) => (
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
            </section>
        </div>
    )
}

export default Home
