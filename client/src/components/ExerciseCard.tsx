import axios from 'axios'
import type { Exercise } from '../types/Exercise'
import type { Workout } from '../types/Workout'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface SetInput{
    weight: number
    reps: number
}

interface ExerciseCardProps{
    exercise: Exercise
    workoutId: string
    onExerciseAdded: (updatedWorkout: Workout) => void
    onBack: () => void
}

function ExerciseCard({ exercise, workoutId, onExerciseAdded, onBack }: ExerciseCardProps) {
    const [sets, setSets] = useState<SetInput[]>([{ weight: 0, reps: 0 }])
    const [message, setMessage] = useState('')
    const auth = useAuth()

    async function handleAdd() {
        try{
            const res = await axios.post(`http://localhost:5000/api/workouts/${workoutId}/exercises`,
                { exerciseId: exercise._id, sets: [] },
                { headers: { Authorization: `Bearer ${auth?.token}` }}
            )
            onExerciseAdded(res.data)
            onBack()
        } catch(error: any) {
            setMessage(error.response?.data?.message || 'Server error, please try again')
        }
    }

    return (
        <div>
            <h1>{exercise.name}</h1>
            <button onClick={onBack}>Cancel</button>
            <button onClick={handleAdd}>Add to workout</button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default ExerciseCard



