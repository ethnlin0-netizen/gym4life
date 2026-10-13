import { useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { Workout, SetEntry } from '../types/Workout'

interface SetUIProps {
    workoutId: string
    // The workout exercise entry's _id (item._id), not item.exercise._id.
    exerciseId: string
    exerciseName: string
    initialSets: SetEntry[]
    onSaved: (updatedWorkout: Workout) => void
    onClose: () => void
}

interface DraftSet {
    id: string
    reps: string
    weight: string
}

function SetUI({ workoutId, exerciseId, exerciseName, initialSets, onSaved, onClose }: SetUIProps) {
    const auth = useAuth()
    // Strings let users clear an input while typing without turning it into zero.
    const [sets, setSets] = useState<DraftSet[]>(() => initialSets.map(set => ({
        id: crypto.randomUUID(),
        reps: set.reps?.toString() ?? '',
        weight: set.weight?.toString() ?? '',
    })))
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')

    function updateSet(id: string, field: 'reps' | 'weight', value: string) {
        setSets(current => current.map(set => set.id === id ? { ...set, [field]: value } : set))
    }

    async function saveSets(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (isSaving) return
        setMessage('')

        if (!auth?.token) {
            setMessage('Please sign in to save your sets.')
            return
        }

        const updatedSets: SetEntry[] = sets.map(set => ({
            reps: Number(set.reps),
            weight: Number(set.weight),
        }))
        const invalid = sets.some((set, index) => {
            const { reps, weight } = updatedSets[index]
            return set.reps.trim() === '' || set.weight.trim() === '' ||
                !Number.isSafeInteger(reps) || reps! < 1 ||
                !Number.isFinite(weight) || weight! < 0
        })
        if (invalid) {
            setMessage('Enter whole reps of at least 1 and a weight of 0 or more for every set.')
            return
        }

        setIsSaving(true)
        try {
            const res = await axios.put<Workout>(
                `http://localhost:5000/api/workouts/${workoutId}/exercises/${exerciseId}`,
                { sets: updatedSets },
                { headers: { Authorization: `Bearer ${auth.token}` } },
            )
            onSaved(res.data)
            onClose()
        } catch {
            setMessage('Could not save your sets. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={saveSets}
            className="w-[550px] max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-[12px] border border-[#41235C] bg-[#12061F] p-6 text-[#D0B1FC]"
            style={{ fontFamily: 'Oswald' }}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-[30px] text-[#F3C47E]">Edit Sets</h2>
                <button type="button" onClick={onClose} disabled={isSaving} aria-label="Close set editor">
                    <X size={28} />
                </button>
            </div>
            <p className="mb-5 text-[20px]">{exerciseName}</p>

            <fieldset disabled={isSaving} className="space-y-3 disabled:opacity-60">
                {sets.length === 0 && <p>No sets yet. Add your first set below.</p>}
                {sets.map((set, index) => (
                    <div key={set.id} className="flex items-end gap-3 rounded-lg border border-[#41235C] p-3">
                        <span className="pb-2">Set {index + 1}</span>
                        <label className="min-w-0 flex-1">
                            Reps
                            <input type="number" min="1" step="1" required value={set.reps}
                                onChange={event => updateSet(set.id, 'reps', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-[#41235C] bg-[#1D104E] p-2"
                            />
                        </label>
                        <label className="min-w-0 flex-1">
                            Weight
                            <input type="number" min="0" step="any" required value={set.weight}
                                onChange={event => updateSet(set.id, 'weight', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-[#41235C] bg-[#1D104E] p-2"
                            />
                        </label>
                        <button type="button" aria-label={`Delete set ${index + 1}`} className="p-2 text-red-300"
                            onClick={() => setSets(current => current.filter(row => row.id !== set.id))}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
                <button type="button" className="flex items-center gap-2 rounded-lg border border-dashed border-[#41235C] px-4 py-2"
                    onClick={() => setSets(current => [...current, { id: crypto.randomUUID(), reps: '', weight: '' }])}>
                    <Plus size={20} /> Add Set
                </button>
            </fieldset>

            {message && <p role="alert" className="mt-4 text-red-300">{message}</p>}
            <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-[#41235C] px-4 py-2">Cancel</button>
                <button type="submit" disabled={isSaving} className="rounded-lg bg-[#E7AD4E] px-4 py-2 text-[#12061F] disabled:opacity-60">
                    {isSaving ? 'Saving...' : 'Save Sets'}
                </button>
            </div>
        </form>
    )
}

export default SetUI
