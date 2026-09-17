import type { Workout } from '../types/Workout'
import { Link } from 'react-router-dom'

interface CompletedWorkoutCardProps{
    workout: Workout
}
function CompletedWorkoutCard({ workout }: CompletedWorkoutCardProps) {
    
    return (
        <div className="rounded-2xl w-[210px] h-[298px] bg-[#3B353A] opacity-80">
            <h1>{workout.name}</h1>
            <p>{workout.date}</p>
            <Link to={`/workout/${workout._id}`} className="">View</Link>
        </div>
    )
}

export default CompletedWorkoutCard