//Display a library of the user's past workouts, including a search bar they can use to search for specific ones
//They should be able to search by name, dates, or notes
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import type { Workout } from '../types/Workout'
import axios from 'axios'
import CompletedWorkoutCard from './CompletedWorkoutCard'
import { Search } from 'lucide-react'

function History() {
    const auth = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [completedWorkouts, setCompletedWorkouts] = useState<Workout [] | null>([])
    const [completedWorkoutsRefresh, setCompletedWorkoutsRefresh] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        let cancelled = false
        async function fetchCompletedWorkouts() {
            if(!auth?.token) {
                setCompletedWorkouts([])
                setIsLoading(false)
                return
            }
            setIsLoading(true)
            try {
                const res = await axios.get<Workout[]>('http://localhost:5000/api/workouts', {
                    headers: { Authorization: `Bearer ${auth?.token}` } 
                })
                if(!cancelled) {
                    setCompletedWorkouts(res.data.filter(workout => workout.status === 'completed'))
                }
            } catch {
                if(!cancelled) setCompletedWorkouts(null)
            } finally {
                if(!cancelled) setIsLoading(false)
            }
        }
        fetchCompletedWorkouts()
        return () => { cancelled = true }
    }, [auth?.token, completedWorkoutsRefresh])

    // Match names, notes, and dates such as "Oct 21", "10/21/2026", or "2026-10-21".
    const query = search.toLowerCase().replace(/[,./-]+/g, ' ').replace(/\s+/g, ' ').trim()
    const filteredWorkouts = completedWorkouts?.filter(workout => {
        if(!query) return true
        const date = new Date(workout.date)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const searchableFields = [
            workout.name || 'Untitled workout',
            ...(workout.notes ?? []),
            date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            date.toLocaleDateString('en-US'),
            `${month}/${day}/${year}`,
            `${year}-${month}-${day}`,
        ]
        return searchableFields.some(field =>
            field.toLowerCase().replace(/[,./-]+/g, ' ').replace(/\s+/g, ' ').trim().includes(query)
        )
    }) ?? []
    
    return (
        <div className="mx-auto max-w-[1250px] px-[20px] py-[30px] text-[#D0B1FC] lg:px-[35px]" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <header className="mb-[25px]">
                <p className="text-[10px] uppercase tracking-[3px] text-[#02ECF6]" style={{ fontFamily: 'Orbitron, sans-serif' }}>{auth?.username ? `${auth.username}'s session log` : 'Your session log'}</p>
                <h1 className="mt-[10px] text-[28px] font-bold text-white uppercase tracking-[1px] sm:text-[34px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>Workout History</h1>
                <p className="mt-[10px] text-[18px] text-[#B2A2CF]">Your past sessions, all in one place.</p>
            </header>

            <label htmlFor="workout-search" className="sr-only">Search workouts by name, date, or notes</label>
            <div className="flex items-center gap-[12px] border border-[#41235C] bg-[#0A0019]/70 px-[15px] focus-within:border-[#02ECF6]/70">
                <Search size={18} aria-hidden="true" className="shrink-0 text-[#02ECF6]" />
                <input
                    id="workout-search"
                    type="search"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Search by name, date, or notes…"
                    className="min-w-0 flex-1 bg-transparent py-[14px] text-[17px] text-white outline-none placeholder:text-[#B2A2CF]"
                />
            </div>

            {isLoading && <p role="status" className="mt-[25px]">Loading your workouts...</p>}
            {!isLoading && completedWorkouts === null && (
                <div role="alert" className="mt-[25px] border border-[#FF2D78]/40 bg-[#FF2D78]/5 p-[20px]">
                    <p className="text-[#FF2D78]">Could not load your workout history.</p>
                    <button type="button" onClick={() => setCompletedWorkoutsRefresh(current => !current)} className="mt-[10px] cursor-pointer text-[#02ECF6] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#02ECF6]">Try again</button>
                </div>
            )}
            {!isLoading && completedWorkouts !== null && (
                <>
                    <div className="mt-[25px] mb-[15px] flex flex-wrap items-center justify-between gap-[10px] text-[12px] text-[#B2A2CF]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        <p role="status">{query ? `${filteredWorkouts.length} of ${completedWorkouts.length} workouts` : `${completedWorkouts.length} workout${completedWorkouts.length === 1 ? '' : 's'}`}</p>
                        <span className="text-[10px] uppercase tracking-[1px]">Newest first</span>
                    </div>
                    {completedWorkouts.length === 0 ? (
                        <div className="border border-dashed border-[#41235C] bg-[#170035]/40 p-[30px] text-center">
                            <p className="text-[22px] text-white">Your history starts here.</p>
                            <p className="mt-[8px] text-[#B2A2CF]">Finish a workout and it will appear in your library.</p>
                        </div>
                    ) : filteredWorkouts.length === 0 ? (
                        <div className="border border-dashed border-[#41235C] bg-[#170035]/40 p-[30px] text-center">
                            <p className="text-[22px] text-white">No workouts match your search.</p>
                            <button type="button" onClick={() => setSearch('')} className="mt-[10px] cursor-pointer text-[#02ECF6] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#02ECF6]">Clear search</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2 xl:grid-cols-3">
                            {filteredWorkouts.map((workout) => (
                                <CompletedWorkoutCard
                                    key={workout._id}
                                    workout={workout}
                                    compact
                                    onDeleted={(workoutId) => {
                                        setCompletedWorkouts(current => current?.filter(workout => workout._id !== workoutId) ?? [])
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default History
