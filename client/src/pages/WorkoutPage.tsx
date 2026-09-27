import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { Workout } from "../types/Workout"
import EndWorkoutButton from '../components/EndWorkoutButton'
import ExerciseListDiv from '../components/ExerciseListDiv'
import { ArrowLeft } from 'lucide-react' 
import axios from 'axios'

function WorkoutPage() {
    const { id } = useParams()
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showExerciseList, setShowExerciseList] = useState(false)
    const navigate = useNavigate()
    const [elapsedMinutes, setElapsedMinutes] = useState(0)

    
    useEffect(() => {
        async function fetchWorkout() {
            if(!auth?.token) {
                setIsLoading(false)
                return
            }
            try {
                const res = await axios.get(`http://localhost:5000/api/workouts/${id}`, {
                    headers: { Authorization: `Bearer ${auth?.token}` }
                })
                setWorkout(res.data ?? null)
            } catch {
                setWorkout(null)
            } finally {
                setIsLoading(false)
            }
        }
        fetchWorkout()
    }, [auth?.token, id])

    useEffect(() => {
        function fetchTime() {
            if(!workout?.date) return
            const elapsed = (Date.now() - new Date(workout.date).getTime()) / 60000
            setElapsedMinutes(Math.floor(elapsed))
        }

        fetchTime()
        const intervalId = setInterval(fetchTime, 60000)
        return () => clearInterval(intervalId)
    }, [workout?.date])

    async function goBack() {
        navigate('/dashboard')
    }

    const totalSets = workout?.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    return (
        <div className="flex h-screen bg-gradient-to-b from-[#11001C] from-[50%] to-[#4F0082]">
            {isLoading ? null : workout == null ? (
                <div>
                    <p>This does not exist.</p> 
                    <button onClick={goBack}>Back</button>
                </div>
            ) : (
                <div className="ml-[100px] mt-[20px]">

                    <div className="flex items-start">

                        <button onClick={goBack} aria-label="Back">
                            <ArrowLeft size={40} className="mt-[20px] text-[#D0B1FC]" />
                        </button>
                        <h1 className="text-[40px] ml-[60px] text-left text-[#E7AD4E] mt-[10px]" style={{ fontFamily: 'Oswald' }}>Today's Session</h1>
                        <div className="ml-[450px] mt-[20px]">
                            {workout.status === 'active' && <EndWorkoutButton workoutId={id!} onEnded={goBack}/>}
                        </div>

                        <div className="flex flex-col gap-y-2">

                            <div className="border border-[#392572] px-32 py-30 ml-[30px] rounded-[12px] mt-[20px]">
                                <p className="text-[#D0B1FC] text-[20px]">Workout Overview</p>
                            </div>
                            
                        </div>

                    </div>

                    <h2>{workout.name}</h2>
                    <p>{workout.exercises.length} exercises {elapsedMinutes} min {totalSets} sets total</p>
                    {workout.status === 'active' && <button onClick={() => setShowExerciseList(true)}>Add Exercise</button>}
                    {showExerciseList && (
                        <ExerciseListDiv
                            workoutId={id!}
                            onExerciseAdded={(updated) => setWorkout(updated)}
                            onClose={() => setShowExerciseList(false)}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default WorkoutPage