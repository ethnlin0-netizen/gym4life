import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import type { SubmitEvent } from "react"
import { useAuth } from "../context/AuthContext"
import type { Workout, WorkoutExercise } from "../types/Workout"
import EndWorkoutButton from '../components/EndWorkoutButton'
import ExerciseListDiv from '../components/ExerciseListDiv'
import SetUI from '../components/SetUI'
import { ArrowLeft, Plus, Clipboard, Circle, Trash2 } from 'lucide-react' 
import axios from 'axios'
import Sidebar from "../components/Sidebar"
import { exercises, getAssetUrl, normalizeSearchText } from '@bryllim/workout-guide'
import Body from "@mjcdev/react-body-highlighter"
import type { Slug } from "@mjcdev/react-body-highlighter"

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
    const categoryMap: Record<string, string[]> = {
        Chest: ['chest'],
        Back: ['trapezius', 'upper-back', 'lower-back'],
        Legs: ['quadriceps', 'hamstring', 'calves', 'gluteal', 'adductors', 'abductors'],
        Shoulders: ['deltoids'],
        Arms: ['biceps', 'triceps', 'forearm'],
        Core: ['abs', 'obliques'],
    }
    const nameExceptions: Record<string, string> = {
        'Back Squat': 'Squat',
    }
    const [gender, setGender] = useState<'male' | 'female'>('male')
    const [note, setNote] = useState<string>('')
    const [isSavingNote, setIsSavingNote] = useState(false)
    const [noteMessage, setNoteMessage] = useState('')
    const [deletingExerciseId, setDeletingExerciseId] = useState<string | null>(null)
    const [exerciseMessage, setExerciseMessage] = useState('')
    
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

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const newNote = note.trim()
        if(!newNote || !workout || isSavingNote) return

        setNoteMessage('')
        if(!auth?.token) {
            setNoteMessage('Please sign in to save a note.')
            return
        }

        setIsSavingNote(true)
        try {
            const res = await axios.put<Workout>(
                `http://localhost:5000/api/workouts/${workout._id}`,
                { notes: [...workout.notes, newNote] },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            )
            setWorkout(current => current ? { ...current, notes: res.data.notes } : null)
            setNote('')
        } catch {
            setNoteMessage('Could not save your note. Please try again.')
        } finally {
            setIsSavingNote(false)
        }
    }

    function getExerciseIcon(name: string) {
        const libraryName = nameExceptions[name] ?? name
        const match = exercises.find(exercise =>
            normalizeSearchText(exercise.name) ===
            normalizeSearchText(libraryName)
        )

        if(!match) return undefined

        return getAssetUrl(match.slug, 1) ?? undefined
    }

    function toggleCompleted(exerciseId: string) {
        setCompletedExercises((current) => {
            if(current.includes(exerciseId)) {
                return current.filter((id) => id !== exerciseId)
            }
            return [...current, exerciseId]
        })
    }

    async function deleteExercise(exerciseId: string) {
        if(!workout || deletingExerciseId || workout.status !== 'active') return
        setExerciseMessage('')
        if(!auth?.token) {
            setExerciseMessage('Please sign in to delete an exercise.')
            return
        }
        if(!window.confirm('Remove this exercise and its sets from the workout?')) return

        setDeletingExerciseId(exerciseId)
        try {
            await axios.delete(`http://localhost:5000/api/workouts/${workout._id}/exercises/${exerciseId}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            })
            // Keep the loaded exercise details and remove only the deleted entry.
            setWorkout(current => current ? {
                ...current,
                exercises: current.exercises.filter(item => item._id !== exerciseId)
            } : null)
            setCompletedExercises(current => current.filter(id => id !== exerciseId))
        } catch {
            setExerciseMessage('Could not delete the exercise. Please try again.')
        } finally {
            setDeletingExerciseId(null)
        }
    }

    function getExerciseColor(musclesWorked: string[]) {
    const category = Object.keys(categoryMap).find(category =>
        categoryMap[category].some(muscle => musclesWorked.includes(muscle))
    )

    if(category === 'Chest' || category === 'Shoulders') {
        return 'border-[#801454] bg-[#170035]'
    }
    if(category === 'Back' || category === 'Arms') {
        return 'border-yellow-400/50 bg-[#170035]'
    }
    if(category === 'Legs' || category === 'Core') {
        return 'border-blue-400/50 bg-[#170035]'
    }

    return 'border-[#41235C] bg-[#D0B1FC]/5'
}

    const totalSets = workout?.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    const totalReps = workout?.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((setSum, set) => setSum + (set.reps ?? 0), 0),0)
    
    const supportedMuscles: Slug[] = [
        'abs', 'adductors', 'ankles', 'biceps', 'calves', 'chest',
        'deltoids', 'feet', 'forearm', 'gluteal', 'hamstring', 'hands',
        'hair', 'head', 'knees', 'lower-back', 'neck', 'obliques',
        'quadriceps', 'tibialis', 'trapezius', 'triceps', 'upper-back',
    ]
    
    //const allMuscles: Slug[] = []
    const bodyData: { slug: Slug; intensity: number }[] = []

    for(const muscle of supportedMuscles) {
        let intensity = 0

        for(const item of workout?.exercises ?? []) {
            const exercise = item.exercise

            if(exercise.primaryMuscles?.includes(muscle)) {
                intensity = 2
            } else if(exercise.secondaryMuscles?.includes(muscle) && intensity < 1) {
                intensity = 1
            }
        }

        if(intensity > 0) {
            bodyData.push({
                slug: muscle,
                intensity: intensity,
            })
        }
    }
    
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
                                {exerciseMessage && <p role="alert" className="ml-[60px] mt-[15px] text-[#FF2D78]">{exerciseMessage}</p>}
                                <div className="w-[725px] max-h-[70vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#41235C_transparent]" style={{ fontFamily: "Orbitron" }}>
                                    {workout.exercises.map((item, index) => {
                                        const icon = getExerciseIcon(item.exercise.name)

                                        return (
                                        <div className={`mt-[15px] w-[650px] min-h-[100px] border
                                        ml-[60px] p-[15px] flex items-start gap-x-[20px] ${getExerciseColor(item.exercise.musclesWorked)}`}
                                        key={item._id}>
                                            <div className="flex items-center justify-center w-[25px] h-[25px] shrink-0 rounded-full border border-[#E7AD4E] bg-[#E7AD4E]/10 text-[#E7AD4E] text-[16px]">
                                                {index + 1}
                                            </div>
                                            {icon && (
                                                <img
                                                    src={icon}
                                                    alt=""
                                                    className="w-[80px] h-[80px] object-contain shrink-0 mt"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                            <p className="text-[#FFFFFF] text-[20px] font-bold text-shadow-lg text-shadow-[#5D0E49]" style={{ textTransform: "uppercase" }}>{item.exercise.name}</p>
                                            {item.sets.length > 0 && (
                                                <div className="mt-[10px] text-[#02ECF6] text-[16px]">
                                                    {item.sets.map((set, index) => (
                                                        <p key={index} className="mt-[5px]">
                                                            Set {index + 1}: {set.reps ?? '—'} reps | Weight (lbs): {set.weight ?? '—'}
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
                                            {workout.status === 'active' && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExercise(item._id)}
                                                    disabled={deletingExerciseId !== null}
                                                    className="mt-[10px] rounded-[12px] border border-[#FF2D78] px-[10px] py-[5px] text-[14px] text-[#FF2D78] hover:bg-[#FF2D78]/10 disabled:opacity-50"
                                                >
                                                    {deletingExerciseId === item._id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            )}
                                            </div>
                                        </div>
                                        )
                                    })}
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
                                    <div className="flex gap-x-[15px]">

                                        <div className="flex flex-col">
                                            <p className="text-[#D0B1FC] text-[20px] mt-[5px] ml-[5px]">Muscle Groups</p>
                                            <div className="flex mt-[40px] gap-x-[5px] ml-[10px]">
                                                <Circle size={22} className="fill-[#FF2D78] text-[#FF2D78]"/>
                                                <p className="text-[#D0B1FC] text-[14px]">Primary</p>
                                            </div>
                                            <div className="flex gap-x-[5px] ml-[10px] mt-[20px]">
                                                <Circle size={22} className="fill-[#75569A] text-[#75569A]"/>
                                                <p className="text-[#D0B1FC] text-[14px]">Secondary</p>
                                            </div>
                                            <div className="flex gap-x-[15px] mt-[25px] ml-[15px] text-[#D0B1FC] text-[16px]">
                                                <label className="flex items-center gap-x-[5px]">
                                                    <input
                                                        type="radio"
                                                        name="bodyGender"
                                                        checked={gender === 'male'}
                                                        onChange={() => setGender('male')}
                                                        className="accent-[#FF2D78]"
                                                    />
                                                    Male
                                                </label>

                                                <label className="flex items-center gap-x-[5px]">
                                                    <input
                                                        type="radio"
                                                        name="bodyGender"
                                                        checked={gender === 'female'}
                                                        onChange={() => setGender('female')}
                                                        className="accent-[#FF2D78]"
                                                    />
                                                    Female
                                                </label>
                                            </div>
                                        </div>

                                        <Body
                                            data={bodyData}
                                            colors={['#75569A', '#FF2D78']} 
                                            gender={gender}
                                            side="front"
                                            scale={0.64}
                                            border="#dfdfdf"
                                        />
                                        
                                        <Body
                                            data={bodyData}
                                            colors={['#75569A', '#FF2D78']}
                                            gender={gender}
                                            side="back"
                                            scale={0.64}
                                            border="#dfdfdf"
                                        />

                                    </div>
                                </div>
                                
                                <div className="flex flex-col border border-[#41235C] w-[400px] h-[220px] ml-[40px] rounded-[12px] mt-[20px]">
                                    <div className="flex shrink-0 mt-[10px] ml-[20px]">
                                        <Clipboard size={20} className="text-[#D0B1FC] mt-[5px]" />
                                        <h1 className="text-[#D0B1FC] text-[20px] ml-[5px]">Notes</h1>
                                    </div>
                                    <ul aria-live="polite" className="notes-scrollbar flex-1 min-h-0 overflow-y-auto list-disc list-inside mx-[20px] mt-[10px] text-[#D0B1FC] text-[16px]">
                                        {workout.notes.map((savedNote, index) => (
                                            <li key={index} className="mb-[5px] break-words whitespace-pre-wrap">{savedNote}</li>
                                        ))}
                                    </ul>
                                    {noteMessage && <p role="alert" className="shrink-0 mx-[20px] text-[14px] text-[#FF2D78]">{noteMessage}</p>}
                                        <form onSubmit={handleSubmit} className="shrink-0 mx-[20px] mt-[10px] mb-[15px]">
                                            <textarea
                                                aria-label="New workout note"
                                                rows={1}
                                                className="notes-scrollbar block w-full h-[40px] rounded-[12px] border border-[#41235C] bg-[#170035] px-[10px] py-[8px] text-left leading-normal text-[#D0B1FC] resize-none disabled:opacity-50"
                                                placeholder="Type a note and press Enter..."
                                                value={note}
                                                disabled={isSavingNote}
                                                onChange={(e) => setNote(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if(e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                                        e.preventDefault()
                                                        e.currentTarget.form?.requestSubmit()
                                                    }
                                                }}
                                            />
                                        
                                        </form>
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
