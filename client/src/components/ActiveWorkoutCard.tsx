import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'
import type { Workout } from '../types/Workout'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface ActiveWorkoutCardProps {
    workout: Workout
}

function ActiveWorkoutCard({ workout }: ActiveWorkoutCardProps) {


    return (
        <div className="rounded-2xl w-[210px] h-[298px] bg-[#3B353A] opacity-80">
            <Link to={`/workout/${workout._id}`} className="">Enter</Link>
            <button>Edit</button>
            <button>End Workout</button>
        </div>
    )
}

export default ActiveWorkoutCard