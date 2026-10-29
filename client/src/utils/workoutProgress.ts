import type { Workout } from '../types/Workout'

export interface ProgressDay {
    date: Date
    key: string
    minutes: number
    workouts: number
    missingDurations: number
}

// Use local calendar dates rather than UTC dates or fixed 24-hour steps (DST).
function dateKey(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function getWorkoutProgress(workouts: Workout[], dayCount: 7 | 30, now = new Date()) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const days: ProgressDay[] = Array.from({ length: dayCount }, (_, index) => {
        const date = new Date(today)
        date.setDate(date.getDate() - (dayCount - 1 - index))
        return { date, key: dateKey(date), minutes: 0, workouts: 0, missingDurations: 0 }
    })
    const daysByKey = new Map(days.map(day => [day.key, day]))
    const workoutDates = new Set<string>()

    for(const workout of workouts) {
        if(workout.status !== 'completed') continue
        const start = new Date(workout.date)
        if(!Number.isFinite(start.getTime()) || start.getTime() > now.getTime()) continue

        const key = dateKey(start)
        workoutDates.add(key)
        const day = daysByKey.get(key)
        if(!day) continue
        day.workouts += 1

        const end = workout.completedAt ? new Date(workout.completedAt).getTime() : NaN
        if(Number.isFinite(end) && end >= start.getTime() && end <= now.getTime()) {
            day.minutes += (end - start.getTime()) / 60000
        } else {
            day.missingDurations += 1
        }
    }

    // Yesterday's streak stays current until the user has a chance to train today.
    const cursor = new Date(today)
    if(!workoutDates.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
    let streak = 0
    while(workoutDates.has(dateKey(cursor))) {
        streak += 1
        cursor.setDate(cursor.getDate() - 1)
    }

    return {
        days,
        streak,
        missingDurations: days.reduce((total, day) => total + day.missingDurations, 0),
    }
}
