import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { Workout } from "../types/Workout"
import EndWorkoutButton from '../components/EndWorkoutButton'
import ExerciseListDiv from '../components/ExerciseListDiv'

import axios from 'axios'

function WorkoutPage() {
    const { id } = useParams()
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showExerciseList, setShowExerciseList] = useState(false)
    const navigate = useNavigate()

    
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

    async function addExercise() {

    } 

    async function goBack() {
        navigate('/dashboard')
    }

    return (
        <div>
            {isLoading ? null : workout == null ? (
                <div>
                    <p>This does not exist.</p> 
                    <button onClick={goBack}>Back</button>
                </div>
            ) : (
                <div>
                    <h1>{workout.name}</h1>
                    <p>what the goofy</p>
                    {workout.status === 'active' && <button onClick={() => setShowExerciseList(true)}>Add Exercise</button>}
                    {showExerciseList && (
                        <ExerciseListDiv
                            workoutId={id!}
                            onExerciseAdded={(updated) => setWorkout(updated)}
                            onClose={() => setShowExerciseList(false)}
                        />
                    )}
                    <button onClick={goBack}>Back</button>
                    {workout.status === 'active' && <EndWorkoutButton workoutId={id!} onEnded={goBack}/>}
                </div>
            )}
        </div>
    )
}

export default WorkoutPage