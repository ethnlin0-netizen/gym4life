import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { Workout } from "../types/Workout"
import EndWorkoutButton from '../components/EndWorkoutButton'

function WorkoutPage() {
    const { id } = useParams()
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] =useState(true)
    const navigate = useNavigate()

    async function goBack() {
        navigate('/dashboard')
    }
    useEffect(() => {

    })

    return (
        <div>
            <p>what the goofy</p>
            <button onClick={goBack}>Back</button>
            <EndWorkoutButton workoutId={id!} onEnded={goBack}/>
        </div>
    )
}

export default WorkoutPage