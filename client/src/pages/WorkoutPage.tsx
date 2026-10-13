import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { Workout, WorkoutExercise } from "../types/Workout"
import EndWorkoutButton from '../components/EndWorkoutButton'
import ExerciseListDiv from '../components/ExerciseListDiv'
import SetUI from '../components/SetUI'
import { ArrowLeft, Plus, Clipboard } from 'lucide-react' 
import axios from 'axios'
import Sidebar from "../components/Sidebar"

function WorkoutPage() {
    const { id } = useParams()
    const auth = useAuth()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showExerciseList, setShowExerciseList] = useState(false)
    const [showSetUI, setShowSetUI] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null)
    // Completion is kept on this page for now, rather than saved to the database.
    const [completedExercises, setCompletedExercises] = useState<string[]>([])
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

    function toggleCompleted(exerciseId: string) {
        setCompletedExercises((current) => {
            if(current.includes(exerciseId)) {
                return current.filter((id) => id !== exerciseId)
            }
            return [...current, exerciseId]
        })
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
                                    {workout.exercises.map((item, index) => (
                                        <div className="mt-[15px] w-[650px] min-h-[100px] border border-[#41235C]
                                        ml-[60px] rounded-[12px] p-[15px] bg-[#D0B1FC]/5 flex items-start gap-x-[20px]" 
                                        key={item._id}>
                                            <div className="flex items-center justify-center w-[25px] h-[25px] shrink-0 rounded-full border border-[#E7AD4E] bg-[#E7AD4E]/10 text-[#E7AD4E] text-[16px]">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                            <p className="text-[#FFFFFF] text-[20px]">{item.exercise.name}</p>
                                            {item.sets.length > 0 && (
                                                <div className="mt-[10px] text-[#D0B1FC] text-[16px]">
                                                    {item.sets.map((set, index) => (
                                                        <p key={index} className="mt-[5px]">
                                                            Set {index + 1}: {set.reps ?? '—'} reps | Weight: {set.weight ?? '—'}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                            </div>
                                            <div className="flex flex-col items-start w-[120px] shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCompleted(item._id)}
                                                    disabled={workout.status !== 'active'}
                                                    aria-label={`${completedExercises.includes(item._id) ? 'Mark incomplete' : 'Mark completed'}: ${item.exercise.name}`}
                                                    aria-pressed={completedExercises.includes(item._id)}
                                                    className="flex items-center gap-x-[8px] min-h-[30px]"
                                                >
                                                    <span className={completedExercises.includes(item._id)
                                                        ? "flex items-center justify-center w-[20px] h-[20px] rounded-full border border-[#78D9A0] bg-[#78D9A0] text-[#12061F] text-[14px]"
                                                        : "w-[20px] h-[20px] rounded-full border border-[#D0B1FC]"}>
                                                        {completedExercises.includes(item._id) && '✓'}
                                                    </span>
                                                    {completedExercises.includes(item._id) && (
                                                        <span className="text-[#78D9A0] text-[14px]">Completed</span>
                                                    )}
                                                </button>
                                            {workout.status === 'active' && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedExercise(item)
                                                        setShowSetUI(true)
                                                    }}
                                                    className="mt-[10px] rounded-[12px] border border-[#41235C] px-[15px] py-[5px] text-[#D0B1FC] hover:bg-[#392572]/30 transition-colors"
                                                >
                                                    Edit Sets
                                                </button>
                                            )}
                                            </div>
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

                        <div
                            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
                                showSetUI ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            {showSetUI && selectedExercise && (
                                <SetUI
                                    key={selectedExercise._id}
                                    workoutId={workout._id}
                                    exerciseId={selectedExercise._id}
                                    exerciseName={selectedExercise.exercise.name}
                                    initialSets={selectedExercise.sets}
                                    onSaved={setWorkout}
                                    onClose={() => {
                                        setShowSetUI(false)
                                        setSelectedExercise(null)
                                    }}
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
