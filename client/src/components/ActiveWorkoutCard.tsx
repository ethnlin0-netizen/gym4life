import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Workout } from '../types/Workout'
import axios from 'axios'
import EndWorkoutButton from './EndWorkoutButton'
import { Link } from 'react-router-dom'

interface ActiveWorkoutCardProps {
    workout: Workout
    onEnded: () => void
}

function ActiveWorkoutCard({ workout, onEnded }: ActiveWorkoutCardProps) {

    return (
        <div className="rounded-2xl w-[210px] h-[298px] bg-[#3B353A] opacity-80">
            <h1>{workout.name}</h1>
            <Link to={`/workout/${workout._id}`} className="">Enter</Link>
            <button>Edit</button>
            <EndWorkoutButton workoutId={workout._id} onEnded={onEnded} />
        </div>
    )
}

export default ActiveWorkoutCard