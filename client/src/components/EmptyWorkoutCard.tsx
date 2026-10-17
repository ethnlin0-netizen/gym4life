import { useState } from 'react'
import { useAuth } from '../context/AuthContext.tsx'
import type { Workout } from '../types/Workout'
import { Plus } from 'lucide-react'
import axios from 'axios'

interface EmptyWorkoutCardProps {
    onWorkoutCreated: (workout: Workout) => void
}

function EmptyWorkoutCard({ onWorkoutCreated }: EmptyWorkoutCardProps) {
    const auth = useAuth()
    const [workoutName, setWorkoutName] = useState('')
    const [message, setMessage] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [expanded, setExpanded] = useState(false)
    
    // Show the name input inside the session panel.
    async function handleCardClick() {
        setMessage('')
        setExpanded(true)
    }

    async function handleCancel() {
        setMessage('')
        setWorkoutName('')
        setExpanded(false)
    }

    async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if(isCreating || !workoutName.trim()) return
        if(!auth?.token) {
            setMessage('Please sign in to create a workout.')
            return
        }
        setMessage('')
        setIsCreating(true)
        try{
            const res = await axios.post('http://localhost:5000/api/workouts',
                {name: workoutName.trim()},
                {headers: {Authorization: `Bearer ${auth?.token}` } }
            )
            onWorkoutCreated(res.data)
            setExpanded(false)
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Server error, please try again')
        } finally {
            setIsCreating(false)
        }
    }
    return (
        <div>
            {!expanded ? (
                <div>
                    <p className="text-[14px] text-[#E7AD4E] uppercase tracking-[2px]">Ready when you are</p>
                    <h3 className="text-[36px] text-white mt-[10px]">Make today a training day.</h3>
                    <p className="text-[#B2A2CF] mt-[8px] text-[18px]">Start a session, choose your exercises, and log each set.</p>
                    <button type="button" onClick={handleCardClick} className="flex items-center gap-[8px] mt-[25px] rounded-[12px] bg-[#FF2D78] px-[25px] py-[10px] text-white text-[20px] hover:bg-[#FF2D78]/80 transition-colors">
                        <Plus size={22} /> Start a Workout
                    </button>
                </div>
            ) : (
                <form onSubmit={handleCreate}>
                    <label htmlFor="workout-name" className="block text-[24px] text-white mb-[10px]">Name your session</label>
                    <input
                        id="workout-name"
                        required
                        disabled={isCreating}
                        className="w-full rounded-[12px] border border-[#41235C] bg-[#12061F] p-[12px] text-white focus:outline-none focus:border-[#FF2D78]"
                        type="text"
                        placeholder="e.g. Push Day"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                    />
                    <div className="flex items-center gap-[15px] mt-[20px]">
                        <button type="submit" disabled={isCreating || !workoutName.trim()} className="rounded-[12px] bg-[#FF2D78] px-[25px] py-[10px] text-white text-[20px] disabled:opacity-50">{isCreating ? 'Creating...' : 'Create Workout'}</button>
                        <button type="button" disabled={isCreating} onClick={handleCancel} className="text-[#D0B1FC] disabled:opacity-50">Cancel</button>
                    </div>

                </form>
            )}
            {message && <p role="alert" className="mt-[15px] text-[#FF2D78]">{message}</p>}
        </div>
    )
}

export default EmptyWorkoutCard
