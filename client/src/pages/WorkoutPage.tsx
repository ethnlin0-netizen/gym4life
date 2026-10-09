import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { Workout } from "../types/Workout"
import EndWorkoutButton from '../components/EndWorkoutButton'
import ExerciseListDiv from '../components/ExerciseListDiv'
import { ArrowLeft, Plus, Clipboard } from 'lucide-react' 
import axios from 'axios'
import Sidebar from "../components/Sidebar"

function WorkoutPage() {
    const { id } = useParams()
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showExerciseList, setShowExerciseList] = useState(false)
    const navigate = useNavigate()
    const [elapsedMinutes, setElapsedMinutes] = useState(0)
    const [isDark, setIsDark] = useState(false)

    
    useEffect(() => {
        async function fetchWorkout() {
            if(!auth?.token) {
                setIsLoading(false)
                return
            }
            try {
                const res = await axios.get(`http://localhost:5000/api/workouts/${id}`, {
                    headers: { Authorization: `Bearer ${auth?.token}` }
                })
                setWorkout(res.data ?? null)
            } catch {
                setWorkout(null)
            } finally {
                setIsLoading(false)
            }
        }
        fetchWorkout()
    }, [auth?.token, id])

    useEffect(() => {
        function fetchTime() {
            if(!workout?.date) return
            const elapsed = (Date.now() - new Date(workout.date).getTime()) / 60000
            setElapsedMinutes(Math.floor(elapsed))
        }

        fetchTime()
        const intervalId = setInterval(fetchTime, 60000)
        return () => clearInterval(intervalId)
    }, [workout?.date])

    async function goBack() {
        navigate('/dashboard')
    }

    const totalSets = workout?.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    const totalReps = workout?.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((setSum, set) => setSum + (set.reps ?? 0), 0),0)
    
    return (
        <div className="flex h-screen bg-gradient-to-b from-[#11001C] from-[50%] to-[#1D104E]">
            <Sidebar
                activeTab=""
                onTabChange={(tab) => navigate('/dashboard', { state: { tab } })} 
            />
            <div className="w-4/5 overflow-y-auto">
                {isLoading ? null : workout == null ? (
                    <div>
                        <p>This does not exist.</p> 
                        <button onClick={goBack}>Back</button>
                    </div>
                ) : (
                    <div className="ml-[10px] mt-[20px]" style={{ fontFamily: 'Oswald' }}>

                        <div className="flex items-start">
                            {/* Header Row */}
                            <div className="flex flex-col">

                                <div className="flex items-start">
                                    <button onClick={goBack} aria-label="Back">
                                        <ArrowLeft size={40} className="mt-[20px] text-[#D0B1FC]" />
                                    </button>
                                    <div className="flex flex-col ml-[20px]">
                                        <h1 className="text-[40px] text-left text-[#E7AD4E] mt-[10px]">Today's Session</h1>
                                        <p className="text-[30px] text-[#D0B1FC]">{workout.name}</p>
                                        {workout.status === 'active' && (
                                            <button
                                                onClick={() => setShowExerciseList(true)}
                                                className="flex items-center justify-center py-3 mt-[20px] rounded-[12px] border border-dashed border-[#41235C] text-[#D0B1FC] text-[20px] hover:bg-[#392572]/30 transition-colors"
                                            >
                                                <Plus size={24} />
                                                Add Exercise
                                            </button>
                                        )}
                                    </div>
                                    <div className="ml-[300px] mt-[20px]">
                                        {workout.status === 'active' && <EndWorkoutButton workoutId={id!} onEnded={goBack}/>}
                                    </div>
                                </div>

                                {/* List the exercises here*/}
                                <div className="w-[725px] max-h-[70vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#41235C_transparent]">
                                    {workout.exercises.map((item) => (
                                        <div className="mt-[15px] w-[650px] h-[100px] border border-[#41235C]
                                        ml-[60px] rounded-[12px]" 
                                        key={item._id}>
                                            <p className="text-[#FFFFFF] text-[20px]">{item.exercise.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Overview */}
                            <div className="flex flex-col gap-y-2">

                                <div className="border border-[#41235C] w-[400px] h-[220px] ml-[40px] rounded-[12px] mt-[20px]">
                                    <h1 className="text-[#D0B1FC] text-[20px] mt-[10px] ml-[30px]">Workout Overview</h1>
                                    <p className="text-[#D0B1FC] text-[20px] ml-[30px]">{workout.name}</p>
                                    <div className="w-[330px] mt-[10px] h-[1px] mx-auto bg-[#392572]" />
                                    <div className="flex justify-between w-[325px] text-[#D0B1FC] text-[16px] ml-[30px] mt-[10px]">
                                        <span>Estimated Time</span>
                                        <span>{elapsedMinutes} mins</span>
                                    </div>
                                    <div className="w-[330px] mt-[10px] h-[1px] mx-auto bg-[#392572]" />
                                    <div className="flex justify-between w-[325px] text-[#D0B1FC] text-[16px] ml-[30px] mt-[10px]">
                                        <span>Total Sets</span>
                                        <span>{totalSets}</span>
                                    </div>
                                    <div className="w-[330px] mt-[10px] h-[1px] mx-auto bg-[#392572]" />
                                    <div className="flex justify-between w-[325px] text-[#D0B1FC] text-[16px] ml-[30px] mt-[10px]">
                                        <span>Total Reps</span>
                                        <span>{totalReps}</span>
                                    </div>
                                </div>
                                
                                <div className="border border-[#41235C] w-[400px] h-[260px] ml-[40px] rounded-[12px] mt-[20px]">
                                    <h1 className="text-[#D0B1FC] text-[20px] mt-[10px] ml-[30px]">Muscles Worked</h1>
                                </div>
                                
                                <div className="border border-[#41235C] w-[400px] h-[220px] ml-[40px] rounded-[12px] mt-[20px]">
                                    <div className="flex mt-[10px] ml-[20px]">
                                        <Clipboard size={20} className="text-[#D0B1FC] mt-[5px]" />
                                        <h1 className="text-[#D0B1FC] text-[20px] ml-[5px]">Notes</h1>
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                        
                        <div
                            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
                                showExerciseList ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            {showExerciseList && (
                                <ExerciseListDiv
                                    workoutId={id!}
                                    onExerciseAdded={(updated) => setWorkout(updated)}
                                    onClose={() => setShowExerciseList(false)}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WorkoutPage