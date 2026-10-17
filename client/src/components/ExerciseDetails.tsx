import type { Exercise } from '../types/Exercise'

interface ExerciseDetailsProps {
    exercise: Exercise
    category: string
}

// Details panel for the Exercises tab, separate from the workout's ExerciseCard.
function ExerciseDetails({ exercise, category }: ExerciseDetailsProps) {
    return (
        <div>
            <p className="text-[11px] tracking-[2px] uppercase text-[#B2A2CF]">Exercise details</p>
            <h2 className="mt-[10px] text-[28px] font-semibold leading-tight text-white break-words">{exercise.name}</h2>
            <span className="inline-block mt-[12px] rounded-full border border-[#FF2D78]/50 bg-[#FF2D78]/10 px-[12px] py-[4px] text-[13px] text-[#FF79AE]">
                {category}
            </span>

            {/* Blank until preview images are added. */}
            <div role="img" aria-label="Exercise preview placeholder; image not available yet"
                className="mt-[20px] aspect-[2/1] xl:aspect-[16/9] rounded-[12px] border border-[#41235C]/70 bg-[#1B122B]" />

            <h3 className="mt-[22px] text-[14px] font-semibold text-white">About this exercise</h3>
            <p className="mt-[8px] text-[14px] leading-relaxed text-[#B2A2CF]">
                {exercise.description || 'No description available yet.'}
            </p>

            <div className="mt-[24px] border-t border-[#41235C]/70 pt-[20px]">
                <h3 className="text-[14px] font-semibold text-white">Target muscles</h3>
                <div className="grid grid-cols-2 gap-[15px] mt-[15px]">
                    <div>
                        <p className="text-[12px] text-[#B2A2CF] mb-[8px]">Primary</p>
                        <div className="flex flex-wrap gap-[6px]">
                            {exercise.primaryMuscles?.map(muscle => (
                                <span key={muscle} className="rounded-full border border-[#FF2D78]/60 px-[10px] py-[4px] text-[12px] capitalize text-[#FF79AE]">{muscle.replaceAll('-', ' ')}</span>
                            ))}
                            {!exercise.primaryMuscles?.length && <p className="text-[12px] text-[#B2A2CF]">Not specified yet</p>}
                        </div>
                    </div>
                    <div className="border-l border-[#41235C]/70 pl-[15px]">
                        <p className="text-[12px] text-[#B2A2CF] mb-[8px]">Secondary</p>
                        <div className="flex flex-wrap gap-[6px]">
                            {exercise.secondaryMuscles?.map(muscle => (
                                <span key={muscle} className="rounded-full border border-[#75569A] bg-[#75569A]/10 px-[10px] py-[4px] text-[12px] capitalize text-[#D0B1FC]">{muscle.replaceAll('-', ' ')}</span>
                            ))}
                            {!exercise.secondaryMuscles?.length && <p className="text-[12px] text-[#B2A2CF]">Not specified yet</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExerciseDetails
