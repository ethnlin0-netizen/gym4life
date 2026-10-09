import axios from 'axios'
import type { Exercise } from '../types/Exercise'
import type { Workout } from '../types/Workout'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { X, ChevronRight } from 'lucide-react'

interface SetInput{
    weight: number
    reps: number
}

interface ExerciseCardProps{
    exercise: Exercise
    workoutId: string
    onExerciseAdded: (updatedWorkout: Workout) => void
    exerciseType: string
    onBack: () => void
}

function ExerciseCard({ exercise, workoutId, onExerciseAdded, exerciseType, onBack }: ExerciseCardProps) {
    const [sets, setSets] = useState<SetInput[]>([{ weight: 0, reps: 0 }])
    const [message, setMessage] = useState('')
    const auth = useAuth()

    async function handleAdd() {
        try{
            const res = await axios.post(`http://localhost:5000/api/workouts/${workoutId}/exercises`,
                { exerciseId: exercise._id, sets: [] },
                { headers: { Authorization: `Bearer ${auth?.token}` }}
            )
            onExerciseAdded(res.data)
            onBack()
        } catch(error: any) {
            setMessage(error.response?.data?.message || 'Server error, please try again')
        }
    }

    return (
        <div className="w-[400px] h-[550px] border border-[#801454] bg-[#170035]" style={{ fontFamily: 'Orbitron' }}>
            <div className="flex justify-between">
                <h1 className="text-[16px] text-[#75569A] mt-[20px] ml-[20px]">{exerciseType.toUpperCase()}</h1>
                <button onClick={onBack} aria-label="Back">
                    <X size={30} className="text-[#D0B1FC] mt-[20px] ml-[275px]" />
                </button>
            </div>
            <p className="text-[30px] text-[#FFFFFF] ml-[20px] font-bold text-shadow-lg text-shadow-[#5D0E49]">{exercise.name.toUpperCase()}</p>
            <div className="mt-[10px] bg-[#801454]/30 w-[400px] h-[1px] mx-auto" />
            <div className="mt-[15px] border border-[#073D53] ml-[20px] w-[360px] h-[200px]">
                <p className="text-[#02ECF6] text-[12px] mt-[165px] ml-[15px]">FORM PREVIEW</p>
            </div>
            <div className="mt-[15px] ml-[20px] border border-[#3D0A2F] bg-[#0A0019] w-[360px] h-[160px]">
                <p className="text-[#B2A2CF] text-[11px] mt-[15px] ml-[15px] mr-[15px]">{exercise.description}</p>
            </div>
            <div className="mt-[10px] ml-[20px] flex" onClick={handleAdd}>
                <p className="text-[#FF2D78] text-[12px]">ADD TO WORKOUT</p>
                <ChevronRight size={15} className="text-[#FF2D78] ml-[10px]" />
            </div>
            {message && <p>{message}</p>}
        </div>
    )
}

export default ExerciseCard



