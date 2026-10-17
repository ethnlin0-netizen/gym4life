import type { Workout } from '../types/Workout'
import EndWorkoutButton from './EndWorkoutButton'
import { Link } from 'react-router-dom'

interface ActiveWorkoutCardProps {
    workout: Workout
    onEnded: () => void
}

//105 149

function ActiveWorkoutCard({ workout, onEnded }: ActiveWorkoutCardProps) {

    return (
        <div>
            <span className="inline-flex items-center gap-[8px] rounded-full bg-[#78D9A0]/10 px-[12px] py-[5px] text-[#78D9A0] text-[14px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#78D9A0]" /> Session in progress
            </span>
            <h3 className="text-[36px] text-white mt-[15px] break-words">{workout.name || 'Untitled workout'}</h3>
            <p className="mt-[5px] text-[#B2A2CF]">{workout.exercises.length} exercises added. Pick up where you left off.</p>
            <div className="flex flex-wrap items-center gap-[15px] mt-[25px]">
                <Link to={`/workout/${workout._id}`} className="rounded-[12px] bg-[#FF2D78] px-[25px] py-[10px] text-white text-[20px] hover:bg-[#FF2D78]/80 transition-colors">Continue Workout →</Link>
                <EndWorkoutButton workoutId={workout._id} onEnded={onEnded} />
            </div>
        </div>
    )
}

export default ActiveWorkoutCard
