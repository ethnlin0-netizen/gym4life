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
    const [expanded, setExpanded] = useState(false)
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

    //when the button is clicked, show the interface that contains all the exercises. model it after cronometer
    async function addClick() {
        setExpanded(true)
    }

    async function addCancel() {
        //the cancel button should be on the exercise list div. this might require some more prop shenanigans
        setExpanded(false)
    }

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
                    {expanded && <ExerciseListDiv />}
                    <h1>{workout.name}</h1>
                    <p>what the goofy</p>
                    <button onClick={addClick}>Add Exercise</button>
                    <button onClick={goBack}>Back</button>
                    <EndWorkoutButton workoutId={id!} onEnded={goBack}/>
                </div>
            )}
        </div>
    )
}

export default WorkoutPage