import { useState } from 'react'
import { useAuth } from '../context/AuthContext.tsx'
import type { Workout } from '../types/Workout'
import axios from 'axios'

interface EmptyWorkoutCardProps {
    onWorkoutCreated: (workout: Workout) => void
}

function EmptyWorkoutCard({ onWorkoutCreated }: EmptyWorkoutCardProps) {
    const auth = useAuth()
    const [workoutName, setWorkoutName] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [expanded, setExpanded] = useState(false)
    
    //handleCreate: when the empty card is clicked, make the card enlarge to the center of the screen, and dim everything else
    //prompt the user to enter name, then when they enter execute the post. the workout card will then appear on
    //the homescreen. when they click it, it will redirect to a separate page for the workout
    async function handleCardClick() {
        setExpanded(true)
    }

    async function handleCancel() {
        setWorkoutName('')
        setExpanded(false)
    }

    async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        try{
            const res = await axios.post('http://localhost:5000/api/workouts',
                {name: workoutName},
                {headers: {Authorization: `Bearer ${auth?.token}` } }
            )
            onWorkoutCreated(res.data)
            setExpanded(false)
            //home won't automatically know a workout has been created and update to show the workout card
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Server error, please try again')
            setMessageType('error')
        }
    }
    return (
        <div className="rounded-2xl w-[210px] h-[298px] bg-[#3B353A] opacity-80">
            {!expanded ? (
                <button onClick={handleCardClick}>Create Workout</button>
            ) : (
                <form onSubmit={handleCreate}>
                    {/* input bound to workoutName, cancel button calling handleCancel, submit button, message display */}
                    <input
                        type="text"
                        placeholder="Workout Name"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                    />
                    <button type="button" onClick={handleCancel}>Cancel</button>
                    <button type="submit">Create</button>

                </form>
            )}
            {message && <p>{message}</p>}
        </div>
    )
}

export default EmptyWorkoutCard