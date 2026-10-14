import type { Workout } from '../types/Workout'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

interface CompletedWorkoutCardProps{
    workout: Workout
    onDeleted: (workoutId: string) => void
}

//105 149

function CompletedWorkoutCard({ workout, onDeleted }: CompletedWorkoutCardProps) {
    const auth = useAuth()
    const [isDeleting, setIsDeleting] = useState(false)
    const [message, setMessage] = useState('')

    async function deleteWorkout() {
        if(isDeleting) return
        setMessage('')

        if(!auth?.token) {
            setMessage('Please sign in to delete this workout.')
            return
        }

        if(!window.confirm('Delete this workout and all its sets and notes? This cannot be undone.')) return

        setIsDeleting(true)
        try {
            await axios.delete(`http://localhost:5000/api/workouts/${workout._id}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            })
            onDeleted(workout._id)
        } catch {
            setMessage('Could not delete this workout. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }
    return (
        <div className="rounded-2xl w-[178.5px] h-[253.3px] bg-[#3B353A] opacity-80">
            <h1>{workout.name}</h1>
            <p>{workout.date}</p>
            <Link to={`/workout/${workout._id}`} className="">View</Link>
            <button
                type="button"
                onClick={deleteWorkout}
                disabled={isDeleting}
                className="block mt-[10px] border border-[#FF2D78] rounded-[12px] px-[15px] py-[5px] text-[#FF2D78] hover:bg-[#FF2D78]/10 disabled:opacity-50"
            >
                {isDeleting ? 'Deleting...' : 'Delete Workout'}
            </button>
            {message && <p role="alert" className="mt-[10px] text-[14px] text-[#FF2D78]">{message}</p>}
        </div>
    )
}

export default CompletedWorkoutCard
