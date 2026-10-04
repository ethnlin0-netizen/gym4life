//this will be the interface that pops up on the screen when the user clicks add exercise
//it should have a search and scroll bar that they can use to find exercises
//right now, my idea is to have text only information while scrolling
//but when they click it'll expand into the full exercise card
//subsequently, exercise card will need to be its own component
//for the body highlighter, i want one diagram on the workout page that lights up as the user adds exercises
//this may potentially require the addition of a musclestargeted field in the workout model
import { useEffect, useState } from 'react'
import type { Workout } from '../types/Workout'
import type { Exercise } from '../types/Exercise'
import ExerciseCard from './ExerciseCard'
import axios from 'axios'
import { X, Search, ChevronRight } from 'lucide-react'

interface ExerciseListDivProps{
    workoutId: string
    onExerciseAdded: (updatedWorkout: Workout) => void
    onClose: () => void
}

function ExerciseListDiv({ workoutId, onExerciseAdded, onClose }: ExerciseListDivProps) {
    const [allExercises, setAllExercises] = useState<Exercise[]>([])
    const [searchText, setSearchText] = useState('')
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
    const [activeTab, setActiveTab] = useState<string>('All')
    const [showExerciseCard, setShowExerciseCard] = useState(false)
    const [message, setMessage] = useState('')
    const categoryMap: Record<string, string[]> = {
        Chest: ['chest'],
        Back: ['trapezius', 'upper-back', 'lower-back'],
        Legs: ['quadriceps', 'hamstring', 'calves', 'gluteal', 'adductors', 'abductors'],
        Shoulders: ['deltoids'],
        Arms: ['biceps', 'triceps', 'forearm'],
        Core: ['abs', 'obliques'],
    }

    function getCategoryForExercise(exericse: Exercise): string {
        const entry = Object.entries(categoryMap).find(([_, muscles]) =>
            muscles.some(m => exericse.musclesWorked.includes(m))
        )
        return entry ? entry[0] : 'Other'
    }

    useEffect(() => {
        async function fetchExercises() {
            try {
                const res = await axios.get<Exercise[]>('http://localhost:5000/api/exercises')
                setAllExercises(res.data)
            } catch {
                setMessage('Could not load exercises')
            }
        }
        fetchExercises()
    }, [])

    const filteredExercises = allExercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchText.toLowerCase())
        const matchesCategory = activeTab == 'All' || categoryMap[activeTab]?.some(m => exercise.musclesWorked.includes(m))
        return matchesSearch && matchesCategory
    })

    return (
        <div className="w-[750px] h-[700px] bg-[#12061F] border border-[#41235C] rounded-[12px]" style={{ fontFamily: 'Oswald' }}>
            <div className="flex">
                <h1 className="text-[40px] text-[#F3C47E] ml-[30px] mt-[15px]">Add Exercise</h1>
                <button onClick={onClose} aria-label="Exit">
                    <X size={40} className="text-[#D0B1FC] mt-[20px] ml-[475px]" />
                </button>
            </div>
            <p className="text-[20px] text-[#D0B1FC] ml-[30px]">Search for an exercise or browse by category.</p>
            <div className="flex w-[690px] h-[50px] border border-[#41235C] rounded-[16px] ml-[30px] mt-[15px] text-[16px] text-[#D0B1FC]">
                <Search size={20} className="text-[#D0B1FC] mt-[15px] ml-[15px]"/>
                <input
                    className="ml-[5px] w-[630px] focus:outline-none"
                    type="text"
                    placeholder="Search exercises..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div className="flex gap-x-[10px] text-[16px] mt-[15px] ml-[30px]">
                <button className={activeTab === 'All' ? "border rounded-[20px] w-[90px] h-[40px] border-[#E7AD4E] bg-[#E7AD4E]/10 hover:bg-[#E7AD4E]/15 transition-colors text-[#E7AD4E]" : "border rounded-[20px] w-[90px] h-[40px] border-[#41235C] text-[#D0B1FC] border-[#41235C] hover:bg-[#41235C]/70 transition-colors"} onClick={() => setActiveTab('All')}>All</button>
                <button className={activeTab === 'Chest' ? "border rounded-[20px] w-[90px] h-[40px] border-[#E7AD4E] bg-[#E7AD4E]/10 hover:bg-[#E7AD4E]/15 transition-colors text-[#E7AD4E]" : "border rounded-[20px] w-[90px] h-[40px] border-[#41235C] text-[#D0B1FC] border-[#41235C] hover:bg-[#41235C]/70 transition-colors"} onClick={() => setActiveTab('Chest')}>Chest</button>
                <button className={activeTab === 'Back' ? "border rounded-[20px] w-[90px] h-[40px] border-[#E7AD4E] bg-[#E7AD4E]/10 hover:bg-[#E7AD4E]/15 transition-colors text-[#E7AD4E]" : "border rounded-[20px] w-[90px] h-[40px] border-[#41235C] text-[#D0B1FC] border-[#41235C] hover:bg-[#41235C]/70 transition-colors"} onClick={() => setActiveTab('Back')}>Back</button>
                <button className={activeTab === 'Legs' ? "border rounded-[20px] w-[90px] h-[40px] border-[#E7AD4E] bg-[#E7AD4E]/10 hover:bg-[#E7AD4E]/15 transition-colors text-[#E7AD4E]" : "border rounded-[20px] w-[90px] h-[40px] border-[#41235C] text-[#D0B1FC] border-[#41235C] hover:bg-[#41235C]/70 transition-colors"} onClick={() => setActiveTab('Legs')}>Legs</button>
                <button className={activeTab === 'Shoulders' ? "border rounded-[20px] w-[90px] h-[40px] border-[#E7AD4E] bg-[#E7AD4E]/10 hover:bg-[#E7AD4E]/15 transition-colors text-[#E7AD4E]" : "border rounded-[20px] w-[90px] h-[40px] border-[#41235C] text-[#D0B1FC] border-[#41235C] hover:bg-[#41235C]/70 transition-colors"} onClick={() => setActiveTab('Shoulders')}>Shoulders</button>
                <button className={activeTab === 'Arms' ? "border rounded-[20px] w-[90px] h-[40px] border-[#E7AD4E] bg-[#E7AD4E]/10 hover:bg-[#E7AD4E]/15 transition-colors text-[#E7AD4E]" : "border rounded-[20px] w-[90px] h-[40px] border-[#41235C] text-[#D0B1FC] border-[#41235C] hover:bg-[#41235C]/70 transition-colors"} onClick={() => setActiveTab('Arms')}>Arms</button>
                <button className={activeTab === 'Core' ? "border rounded-[20px] w-[90px] h-[40px] border-[#E7AD4E] bg-[#E7AD4E]/10 hover:bg-[#E7AD4E]/15 transition-colors text-[#E7AD4E]" : "border rounded-[20px] w-[90px] h-[40px] border-[#41235C] text-[#D0B1FC] border-[#41235C] hover:bg-[#41235C]/70 transition-colors"} onClick={() => setActiveTab('Core')}>Core</button>
                {/*<button onClick={() => setActiveTab('Cardio')}>Cardio</button>*/}
            </div>
            <div className="grid mt-[15px] gap-y-[10px]">
                {filteredExercises.map((exercise) => (
                    <div className="
                        bg-[#D0B1FC]/5 ml-[30px] border border-[#41235C] 
                        rounded-[12px] w-[660px] h-[60px] hover:bg-[#41235C]/10 transition-colors" 
                        key={exercise._id} 
                        onClick={() => {
                            setSelectedExercise(exercise)
                            setShowExerciseCard(true)
                        }}>
                        <div className="flex justify-between">
                            <div className="grid">
                                <p className="ml-[15px] mt-[7px] text-[#FFFFFF] text-[14px]">{exercise.name}</p>
                                <p className="ml-[15px] text-[#D0B1FC] text-[12px]">{getCategoryForExercise(exercise)}</p>
                            </div>
                            <ChevronRight size={25} className="text-[#D0B1FC] ml-[450px] mt-[18px]" />
                        </div>
                    </div>
                ))}
            </div>  

            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300 ${
                    showExerciseCard ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                {showExerciseCard && (
                    <ExerciseCard
                        exercise={selectedExercise!}
                        workoutId={workoutId}
                        onExerciseAdded={onExerciseAdded}
                        exerciseType={getCategoryForExercise(selectedExercise!)}
                        onBack={() => setShowExerciseCard(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default ExerciseListDiv