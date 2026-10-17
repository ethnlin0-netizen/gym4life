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
        <div className="flex flex-col min-w-0 rounded-[16px] border border-[#41235C] bg-[#170D29] p-[20px] hover:border-[#75569A] transition-colors">
            <div className="flex items-center justify-between gap-[10px]">
                <span className="text-[11px] text-[#78D9A0] uppercase tracking-[1px]">Completed</span>
                <span className="text-[12px] text-[#B2A2CF]">{new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
            <h3 className="mt-[20px] text-[24px] text-white break-words">{workout.name || 'Untitled workout'}</h3>
            <p className="mt-[8px] mb-[25px] text-[15px] text-[#B2A2CF]">{workout.exercises.length} exercises · {workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)} sets</p>
            <Link to={`/workout/${workout._id}`} className="mt-auto rounded-[10px] border border-[#75569A] px-[12px] py-[8px] text-center text-[#D0B1FC] hover:bg-[#75569A]/15">View Session →</Link>
            <button
                type="button"
                onClick={deleteWorkout}
                disabled={isDeleting}
                className="mt-[12px] text-[13px] text-[#B2A2CF] hover:text-[#FF2D78] disabled:opacity-50"
            >
                {isDeleting ? 'Deleting...' : 'Delete Workout'}
            </button>
            {message && <p role="alert" className="mt-[10px] text-[14px] text-[#FF2D78]">{message}</p>}
        </div>
    )
}

export default CompletedWorkoutCard
