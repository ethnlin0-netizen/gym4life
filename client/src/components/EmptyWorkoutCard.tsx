import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'
import axios from 'axios'

function EmptyWorkoutCard() {
    const navigate = useNavigate()
    const auth = useAuth()
    const [workoutName, setWorkoutName] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [expanded, setExpanded] = useState(false)
    
    //handleCreate: when the empty card is clicked, make the card enlarge to the center of the screen, and dim everything else
    //prompt the user to enter name and notes, then when they enter execute the post. the workout card will then appear on
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

        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Server error, please try again')
            setMessageType('error')
        }
    }
    return (
        <div className="rounded-2xl w-[210px] h-[298px] bg-[#3B353A] opacity-80">
            <button>Create Workout</button>
        </div>
    )
}

export default EmptyWorkoutCard