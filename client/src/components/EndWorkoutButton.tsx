import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

interface EndWorkoutButtonProps {
    workoutId: string
    onEnded: () => void
}

function EndWorkoutButton({ workoutId, onEnded }: EndWorkoutButtonProps) {
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const auth = useAuth()

    async function handleClick() {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/workouts/${workoutId}`,
                { status: 'completed' },
                { headers: { Authorization: `Bearer ${auth?.token}` }}
            )
            //onEnded handles the different actions on the two pages
            onEnded()
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Server error, please try again')
            setMessageType('error');
        }
    }
    return (
        <div>
            <button onClick={handleClick}>End Workout</button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default EndWorkoutButton