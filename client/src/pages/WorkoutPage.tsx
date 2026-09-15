import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { Workout } from "../types/Workout"
import EndWorkoutButton from '../components/EndWorkoutButton'

function WorkoutPage() {
    const { id } = useParams()
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] =useState(true)

    useEffect(() => {

    })

    return (
        <p>what the goofy</p>
    )
}

export default WorkoutPage