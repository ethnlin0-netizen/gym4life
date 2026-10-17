import { useEffect, useState } from 'react'
import axios from 'axios'
import { Search, ChevronRight, X } from 'lucide-react'
import type { Exercise } from '../types/Exercise'
import ExerciseDetails from './ExerciseDetails'

const categoryMap: Record<string, string[]> = {
    Chest: ['chest'],
    Back: ['trapezius', 'upper-back', 'lower-back'],
    Legs: ['quadriceps', 'hamstring', 'calves', 'gluteal', 'adductors', 'abductors'],
    Shoulders: ['deltoids'],
    Arms: ['biceps', 'triceps', 'forearm'],
    Core: ['abs', 'obliques'],
}

function getCategoryForExercise(exercise: Exercise) {
    const category = Object.keys(categoryMap).find(category =>
        categoryMap[category].some(muscle => exercise.musclesWorked.includes(muscle))
    )
    return category ?? 'Other'
}

function Exercises() {
    const [allExercises, setAllExercises] = useState<Exercise[]>([])
    const [searchText, setSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('All')
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [reload, setReload] = useState(0)

    useEffect(() => {
        let cancelled = false
        async function fetchExercises() {
            setIsLoading(true)
            setMessage('')
            try {
                const res = await axios.get<Exercise[]>('http://localhost:5000/api/exercises')
                if(!cancelled) setAllExercises(res.data)
            } catch {
                if(!cancelled) setMessage('Could not load exercises. Please try again.')
            } finally {
                if(!cancelled) setIsLoading(false)
            }
        }
        fetchExercises()
        return () => { cancelled = true }
    }, [reload])

    const filteredExercises = allExercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchText.trim().toLowerCase())
        const matchesCategory = activeTab === 'All' ||
            categoryMap[activeTab].some(muscle => exercise.musclesWorked.includes(muscle))
        return matchesSearch && matchesCategory
    })

    const selectedExercise = filteredExercises.find(exercise => exercise._id === selectedExerciseId)
        ?? filteredExercises[0]
    const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']

    return (
        <div className="mx-auto max-w-[1500px] px-[20px] py-[30px] lg:px-[35px] text-[#D0B1FC]" style={{ fontFamily: 'Arial, sans-serif' }}>
            <header className="flex items-center justify-between gap-[15px] mt-[10px]">
                <div>
                    <h1 className="text-[36px] lg:text-[44px] font-semibold tracking-tight text-white">Exercise Library</h1>
                    <p className="mt-[8px] text-[15px] text-[#B2A2CF]">Explore movements and find your form.</p>
                </div>
                {!isLoading && !message && (
                    <span className="shrink-0 rounded-[12px] border border-[#41235C]/50 bg-[#D0B1FC]/5 px-[14px] py-[10px] text-[12px]">
                        {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}
                    </span>
                )}
            </header>

            <div className="flex items-center gap-[12px] mt-[25px] rounded-[12px] border border-[#41235C] bg-[#D0B1FC]/5 px-[15px] focus-within:border-[#75569A]">
                <Search size={20} className="shrink-0 text-[#B2A2CF]" />
                <input
                    type="search"
                    aria-label="Search exercises"
                    placeholder="Search exercises..."
                    value={searchText}
                    onChange={e => {
                        setSearchText(e.target.value)
                        setSelectedExerciseId(selectedExercise?._id ?? null)
                    }}
                    className="w-full min-w-0 bg-transparent py-[15px] text-[14px] text-white placeholder:text-[#B2A2CF] focus:outline-none"
                />
                {searchText && (
                    <button type="button" onClick={() => setSearchText('')} aria-label="Clear search" className="p-[5px] rounded focus-visible:outline-2 focus-visible:outline-[#FF2D78]">
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-[8px] mt-[15px] mb-[20px]">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => {
                            setActiveTab(category)
                            setSelectedExerciseId(selectedExercise?._id ?? null)
                        }}
                        className={`rounded-[10px] border px-[20px] py-[11px] text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF2D78] ${
                            activeTab === category
                                ? 'border-[#FF2D78] bg-[#FF2D78] text-white'
                                : 'border-[#41235C]/60 bg-[#D0B1FC]/5 hover:bg-[#75569A]/20'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <p role="status" className="py-[40px] text-center">Loading exercises...</p>
            ) : message ? (
                <div role="alert" className="rounded-[14px] border border-[#41235C] p-[30px] text-center">
                    <p>{message}</p>
                    <button type="button" onClick={() => setReload(current => current + 1)} className="mt-[15px] rounded-[10px] bg-[#FF2D78] px-[20px] py-[10px] text-white">Try again</button>
                </div>
            ) : filteredExercises.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-[#41235C] p-[40px] text-center">
                    <h2 className="text-[20px] text-white">{allExercises.length === 0 ? 'Your exercise library is empty.' : 'No exercises found.'}</h2>
                    <p className="mt-[10px] text-[14px] text-[#B2A2CF]">{allExercises.length === 0 ? 'Exercises will appear here once they are added to the library.' : 'Try another search or category.'}</p>
                </div>
            ) : (
                <div className="grid items-start gap-[20px] xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                        {filteredExercises.map(exercise => (
                            <button
                                key={exercise._id}
                                type="button"
                                onClick={() => {
                                    setSelectedExerciseId(exercise._id)
                                    if(window.innerWidth < 1280) {
                                        document.getElementById('exercise-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                    }
                                }}
                                aria-pressed={selectedExercise?._id === exercise._id}
                                aria-controls="exercise-details"
                                className={`min-w-0 rounded-[14px] border p-[12px] text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF2D78] ${
                                    selectedExercise?._id === exercise._id
                                        ? 'border-[#FF2D78] bg-[#FF2D78]/5'
                                        : 'border-[#41235C]/70 bg-[#D0B1FC]/[0.03] hover:border-[#75569A]'
                                }`}
                            >
                                <div aria-hidden="true" className="aspect-[5/2] rounded-[10px] border border-[#41235C]/60 bg-[#1B122B]" />
                                <div className="flex items-center justify-between gap-[10px] px-[3px] pt-[15px] pb-[5px]">
                                    <div className="min-w-0">
                                        <h2 className="text-[16px] font-semibold text-white break-words">{exercise.name}</h2>
                                        <p className="mt-[6px] text-[12px] text-[#B2A2CF]">{getCategoryForExercise(exercise)}</p>
                                    </div>
                                    <ChevronRight size={18} className="shrink-0" />
                                </div>
                            </button>
                        ))}
                    </div>
                    {selectedExercise && (
                        <section id="exercise-details" aria-label="Selected exercise details" className="order-first xl:order-last min-w-0 scroll-mt-[20px] rounded-[14px] border border-[#41235C]/70 bg-[#D0B1FC]/[0.03] p-[22px] xl:sticky xl:top-[20px]">
                            <ExerciseDetails exercise={selectedExercise} category={getCategoryForExercise(selectedExercise)} />
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}

export default Exercises
