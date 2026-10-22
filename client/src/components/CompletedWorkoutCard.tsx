import type { Workout } from '../types/Workout'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

interface CompletedWorkoutCardProps{
    workout: Workout
    onDeleted: (workoutId: string) => void
    compact?: boolean
}

//105 149

function CompletedWorkoutCard({ workout, onDeleted, compact = false }: CompletedWorkoutCardProps) {
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
        <div
            className="relative flex min-w-0 flex-col border border-[#41235C] bg-linear-to-br from-[#170035] to-[#0A0019] p-[20px] shadow-[inset_0_0_24px_#120022] transition-[border-color,box-shadow] duration-200 hover:border-[#75569A] hover:shadow-[inset_0_0_24px_#170035,0_0_18px_#02ECF60D] before:pointer-events-none before:absolute before:-top-px before:-left-px before:h-[14px] before:w-[14px] before:border-t before:border-l before:border-[#02ECF6] before:content-[''] after:pointer-events-none after:absolute after:-right-px after:-bottom-px after:h-[14px] after:w-[14px] after:border-r after:border-b after:border-[#FF2D78] after:content-['']"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
            <div className="flex flex-wrap items-center justify-between gap-[10px] border-b border-[#41235C]/60 pb-[12px]">
                <span className="text-[10px] text-[#02ECF6] uppercase tracking-[2px]">Completed</span>
                <span className="text-[10px] text-[#B2A2CF] uppercase tracking-[1px]">{new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: compact ? 'numeric' : undefined })}</span>
            </div>
            <h3 className={`${compact ? 'mt-[12px] text-[16px]' : 'mt-[16px] text-[20px]'} leading-snug font-bold text-white uppercase tracking-[1px] wrap-anywhere text-shadow-[0_0_12px_#FF2D7833]`}>{workout.name || 'Untitled workout'}</h3>
            <p className={`${compact ? 'mt-[8px] mb-[15px]' : 'mt-[10px] mb-[22px]'} text-[11px] leading-relaxed text-[#B2A2CF]`}>{workout.exercises.length} exercises · {workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)} sets</p>
            <Link to={`/workout/${workout._id}`} className="mt-auto border border-[#02ECF6]/30 bg-[#02ECF6]/5 px-[10px] py-[10px] text-center text-[11px] font-bold text-[#02ECF6] uppercase tracking-[1px] shadow-[inset_0_0_12px_#02ECF608] transition-colors hover:border-[#02ECF6]/70 hover:bg-[#02ECF6]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#02ECF6]">View Session</Link>
            <button
                type="button"
                onClick={deleteWorkout}
                disabled={isDeleting}
                className="mt-[10px] cursor-pointer border border-dashed border-[#FF2D78]/35 px-[10px] py-[9px] text-[10px] text-[#FF2D78] uppercase tracking-[1px] transition-colors hover:border-[#FF2D78]/75 hover:bg-[#FF2D78]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF2D78] disabled:cursor-wait disabled:opacity-50"
            >
                {isDeleting ? 'Deleting...' : 'Delete Workout'}
            </button>
            {message && <p role="alert" className="mt-[10px] text-[12px] leading-relaxed text-[#FF2D78]">{message}</p>}
        </div>
    )
}

export default CompletedWorkoutCard
