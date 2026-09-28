import type { Exercise } from './Exercise'

export interface SetEntry {
    weight?: number
    reps?: number
}

export interface WorkoutExercise {
    _id: string
    exercise: Exercise
    sets: SetEntry[]
}

export interface Workout {
    _id: string
    name?: string
    status: 'active' | 'completed'
    date: string
    notes: string
    exercises: WorkoutExercise[]
}