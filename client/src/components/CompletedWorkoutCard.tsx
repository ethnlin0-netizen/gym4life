import type { Workout } from '../types/Workout'

interface CompletedWorkoutCardProps{
    workout: Workout
}
function CompletedWorkoutCard({ workout }: CompletedWorkoutCardProps) {
    
    return (
        <div className="rounded-2xl w-[210px] h-[298px] bg-[#3B353A] opacity-80">
            <p>${workout.name}</p>
        </div>
    )
}

export default CompletedWorkoutCard