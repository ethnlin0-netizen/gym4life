export interface Workout {
    _id: string
    name?: string
    status: 'active' | 'completed'
    date: string
    exercises: any[]
}