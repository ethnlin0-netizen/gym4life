import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

interface EndWorkoutButtonProps {
    workoutId: string
    onEnded: () => void
}

function EndWorkoutButton({ workoutId, onEnded }: EndWorkoutButtonProps) {
    const [message, setMessage] = useState('')
    const [isEnding, setIsEnding] = useState(false)
    const auth = useAuth()

    async function handleClick() {
        if(isEnding) return
        if(!auth?.token) {
            setMessage('Please sign in to end your workout.')
            return
        }
        setMessage('')
        setIsEnding(true)
        try {
            await axios.put(
                `http://localhost:5000/api/workouts/${workoutId}`,
                { status: 'completed' },
                { headers: { Authorization: `Bearer ${auth?.token}` }}
            )
            //onEnded handles the different actions on the two pages
            onEnded()
        } catch (error: unknown) {
            setMessage(axios.isAxiosError(error) ? error.response?.data?.message || 'Server error, please try again' : 'Could not end your workout. Please try again.')
        } finally {
            setIsEnding(false)
        }
    }
    return (
        <div>
            <button disabled={isEnding} className="border border-[#E7AD4E] text-[20px] text-[#E7AD4E] px-8 py-1 rounded-[12px] hover:bg-[#E7AD4E]/30 transition-colors disabled:opacity-50" style={{ fontFamily: 'Oswald' }} onClick={handleClick}>{isEnding ? 'Ending...' : 'End Workout'}</button>
            {message && <p role="alert">{message}</p>}
        </div>
    )
}

export default EndWorkoutButton
