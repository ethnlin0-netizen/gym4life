export interface Workout {
    _id: string
    name?: string
    status: 'active' | 'completed'
    date: string
    notes: string
    exercises: any[]
}