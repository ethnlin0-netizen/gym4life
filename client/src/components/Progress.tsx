import { useEffect, useState } from 'react'
import axios from 'axios'
import { Check, Flame } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { Workout } from '../types/Workout'
import { getWorkoutProgress } from '../utils/workoutProgress'

function formatMinutes(minutes: number) {
    return minutes > 0 && minutes < 1 ? '<1m' : `${Math.round(minutes)}m`
}

const panelStyle = "relative min-w-0 border border-[#41235C] bg-linear-to-br from-[#170035]/80 to-[#0A0019] p-[20px] before:pointer-events-none before:absolute before:-top-px before:-left-px before:h-[14px] before:w-[14px] before:border-t before:border-l before:border-[#02ECF6] before:content-[''] after:pointer-events-none after:absolute after:-right-px after:-bottom-px after:h-[14px] after:w-[14px] after:border-r after:border-b after:border-[#FF2D78] after:content-['']"

function Progress() {
    const auth = useAuth()
    const [completedWorkouts, setCompletedWorkouts] = useState<Workout[] | null>([])
    const [isLoading, setIsLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [dayCount, setDayCount] = useState<7 | 30>(7)
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        let cancelled = false
        async function fetchCompletedWorkouts() {
            if(!auth?.token) {
                setCompletedWorkouts([])
                setIsLoading(false)
                return
            }
            setIsLoading(true)
            try {
                const res = await axios.get<Workout[]>('http://localhost:5000/api/workouts', {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
                if(!cancelled) setCompletedWorkouts(res.data.filter(workout => workout.status === 'completed'))
            } catch {
                if(!cancelled) setCompletedWorkouts(null)
            } finally {
                if(!cancelled) setIsLoading(false)
            }
        }
        fetchCompletedWorkouts()
        return () => { cancelled = true }
    }, [auth?.token, refresh])

    // Refresh the calendar if the tab stays open across midnight.
    useEffect(() => {
        const intervalId = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(intervalId)
    }, [])

    const { days, streak, missingDurations } = getWorkoutProgress(completedWorkouts ?? [], dayCount, now)
    const today = days[days.length - 1]
    const chartWidth = dayCount === 7 ? 640 : 1680
    const step = (chartWidth - 64) / days.length
    const tickStep = Math.max(15, Math.ceil(Math.max(...days.map(day => day.minutes)) / 4 / 15) * 15)
    const maxMinutes = tickStep * 4
    const dateRange = `${days[0].date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${today.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`

    return (
        <div className="mx-auto max-w-[1400px] px-[20px] py-[30px] text-[#D0B1FC] lg:px-[35px]" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <header className="mb-[30px]">
                <p className="text-[10px] uppercase tracking-[3px] text-[#02ECF6]" style={{ fontFamily: 'Orbitron, sans-serif' }}>Your training</p>
                <h1 className="mt-[10px] text-[32px] font-bold text-white uppercase tracking-[2px] sm:text-[42px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>Progress</h1>
                <p className="mt-[8px] text-[19px] text-[#B2A2CF]">See your effort add up.</p>
            </header>

            {isLoading && <p role="status">Loading your progress...</p>}
            {!isLoading && completedWorkouts === null && (
                <div role="alert" className="border border-[#FF2D78]/40 bg-[#FF2D78]/5 p-[20px]">
                    <p className="text-[#FF2D78]">Could not load your progress.</p>
                    <button type="button" onClick={() => setRefresh(current => !current)} className="mt-[10px] cursor-pointer text-[#02ECF6] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#02ECF6]">Try again</button>
                </div>
            )}

            {!isLoading && completedWorkouts !== null && (
                <>
                    <div className="grid items-stretch gap-[20px] xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
                        <section aria-labelledby="duration-heading" className={panelStyle}>
                            <div className="flex flex-wrap items-start justify-between gap-[20px]">
                                <div>
                                    <h2 id="duration-heading" className="text-[16px] font-bold text-white uppercase tracking-[1px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>Workout duration</h2>
                                    <p className="mt-[8px] text-[16px] text-[#B2A2CF]">Total time trained each day</p>
                                </div>
                                <div>
                                    <div role="group" aria-label="Chart date range" className="flex border border-[#41235C] text-[12px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                        {([7, 30] as const).map(range => (
                                            <button
                                                key={range}
                                                type="button"
                                                aria-pressed={dayCount === range}
                                                onClick={() => setDayCount(range)}
                                                className={`cursor-pointer px-[12px] py-[10px] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[#02ECF6] ${dayCount === range ? 'bg-[#02ECF6]/10 text-[#02ECF6] ring-1 ring-inset ring-[#02ECF6]' : 'text-[#B2A2CF] hover:bg-[#41235C]/30'}`}
                                            >Last {range} days</button>
                                        ))}
                                    </div>
                                    <p className="mt-[10px] text-[13px] text-[#B2A2CF]">{dateRange}</p>
                                </div>
                            </div>

                            <p className="mt-[30px] text-[10px] uppercase tracking-[2px] text-[#B2A2CF]" style={{ fontFamily: 'Orbitron, sans-serif' }}>Minutes</p>
                            <div className="mt-[8px] overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#41235C_transparent]">
                                <svg viewBox={`0 0 ${chartWidth} 320`} className="w-full" style={{ minWidth: dayCount === 7 ? 460 : 1300 }} role="img" aria-labelledby="duration-chart-title duration-chart-description">
                                    <title id="duration-chart-title">Daily workout duration, {dateRange}</title>
                                    <desc id="duration-chart-description">Total elapsed minutes for completed workouts on each local start date. Pink marks today. Rest means no completed workout; a dash means duration was not recorded. Exact totals follow in a table.</desc>
                                    <defs>
                                        <linearGradient id="progress-cyan" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#02ECF6" />
                                            <stop offset="100%" stopColor="#0756A6" />
                                        </linearGradient>
                                        <linearGradient id="progress-pink" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FF2D78" />
                                            <stop offset="100%" stopColor="#B9008C" />
                                        </linearGradient>
                                    </defs>
                                    {[0, 1, 2, 3, 4].map(index => {
                                        const y = 260 - index * 50
                                        return (
                                            <g key={index}>
                                                <line x1="48" x2={chartWidth - 16} y1={y} y2={y} stroke="#41235C" strokeDasharray={index === 0 ? undefined : '4 4'} />
                                                <text x="38" y={y + 4} textAnchor="end" fill="#B2A2CF" fontSize="12">{index * tickStep}</text>
                                            </g>
                                        )
                                    })}
                                    {days.map((day, index) => {
                                        const barWidth = step * 0.58
                                        const x = 48 + step * index + step / 2
                                        const height = day.minutes > 0 ? Math.max(3, day.minutes / maxMinutes * 200) : 0
                                        const label = day.workouts === 0 ? 'Rest' : day.missingDurations === day.workouts ? '—' : `${formatMinutes(day.minutes)}${day.missingDurations > 0 ? '+' : ''}`
                                        const dateLabel = day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                        return (
                                            <g key={day.key}>
                                                <title>{dateLabel}: {day.workouts} completed workout{day.workouts === 1 ? '' : 's'}, {formatMinutes(day.minutes)} recorded{day.missingDurations ? `, ${day.missingDurations} missing duration` : ''}</title>
                                                {height > 0 ? (
                                                    <rect x={x - barWidth / 2} y={260 - height} width={barWidth} height={height} fill={`url(#${index === days.length - 1 ? 'progress-pink' : 'progress-cyan'})`} className="transition-opacity hover:opacity-75" />
                                                ) : (
                                                    <line x1={x - barWidth / 2} x2={x + barWidth / 2} y1="258" y2="258" stroke={day.workouts ? '#B2A2CF' : '#41235C'} strokeWidth="3" strokeDasharray={day.missingDurations ? '3 3' : undefined} />
                                                )}
                                                <text x={x} y={248 - height} textAnchor="middle" fill={day.workouts ? '#FFFFFF' : '#B2A2CF'} fontSize="12">{label}</text>
                                                <text x={x} y="282" textAnchor="middle" fill="#B2A2CF" fontSize="12">{day.date.toLocaleDateString(undefined, { weekday: 'short' })}</text>
                                                <text x={x} y="302" textAnchor="middle" fill="#B2A2CF" fontSize="12">{day.date.getDate()}</text>
                                            </g>
                                        )
                                    })}
                                </svg>
                            </div>
                            <table className="sr-only">
                                <caption>Daily workout totals for {dateRange}</caption>
                                <thead><tr><th scope="col">Date</th><th scope="col">Completed workouts</th><th scope="col">Recorded minutes</th><th scope="col">Workouts without duration</th></tr></thead>
                                <tbody>{days.map(day => <tr key={day.key}><th scope="row">{day.date.toLocaleDateString()}</th><td>{day.workouts}</td><td>{day.minutes.toFixed(1)}</td><td>{day.missingDurations}</td></tr>)}</tbody>
                            </table>
                            {dayCount === 30 && <p className="mt-[8px] text-[13px] text-[#B2A2CF]">Scroll across the chart to see every day.</p>}
                            {completedWorkouts.length === 0 && <p className="mt-[12px] text-[#B2A2CF]">Finish your first workout to start tracking your progress.</p>}
                            {missingDurations > 0 && <p className="mt-[12px] text-[14px] text-[#B2A2CF]">{missingDurations} workout{missingDurations === 1 ? ' has' : 's have'} no recorded duration. These still count toward your streak. “—” means unavailable; “+” means a partial daily total.</p>}
                        </section>

                        <section aria-labelledby="streak-heading" className={`${panelStyle} flex flex-col`}>
                            <div className="flex items-center gap-[12px]">
                                <Flame size={34} aria-hidden="true" className="shrink-0 text-[#FF2D78] drop-shadow-[0_0_8px_#FF2D7840]" />
                                <h2 id="streak-heading" className="text-[15px] font-bold text-white uppercase tracking-[1px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>Current streak</h2>
                            </div>
                            <div className="py-[30px] text-center">
                                <p className="text-[90px] leading-none font-bold text-white text-shadow-[0_0_18px_#FF2D7870]" style={{ fontFamily: 'Orbitron, sans-serif' }}>{streak}</p>
                                <p className="mt-[15px] text-[13px] uppercase tracking-[2px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>{streak === 1 ? 'Day' : 'Days'} in a row</p>
                                <p className="mx-auto mt-[20px] max-w-[260px] text-[17px] text-[#B2A2CF]">{streak === 0 ? 'Finish a workout to start your streak.' : today.workouts ? `You’ve trained on ${streak} consecutive day${streak === 1 ? '' : 's'}.` : 'Log a workout today to keep your streak going.'}</p>
                            </div>
                            <div className="mt-auto grid grid-cols-7 gap-[6px]" aria-label="Workout days over the last seven days">
                                {days.slice(-7).map((day, index) => (
                                    <div key={day.key} className="min-w-0 text-center" title={`${day.date.toLocaleDateString()}: ${day.workouts ? 'Workout logged' : 'No completed workout'}`}>
                                        <p className="mb-[10px] text-[11px] text-[#B2A2CF]" aria-hidden="true">{day.date.toLocaleDateString(undefined, { weekday: 'narrow' })}</p>
                                        <span className={`mx-auto flex aspect-square max-w-[34px] items-center justify-center border ${day.workouts ? 'border-[#FF2D78] bg-[#FF2D78]/80 text-white shadow-[0_0_8px_#FF2D7820]' : 'border-[#75569A] bg-[#170035]'} ${index === 6 ? 'outline-1 outline-offset-3 outline-[#D0B1FC]' : ''}`}>
                                            {day.workouts > 0 && <Check size={18} aria-hidden="true" />}
                                            <span className="sr-only">{day.date.toLocaleDateString()}: {day.workouts ? 'Workout logged' : 'No completed workout'}{index === 6 ? ', today' : ''}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-[20px] flex items-center gap-[8px] text-[14px] text-[#B2A2CF]"><span className="h-[10px] w-[10px] bg-[#FF2D78]" aria-hidden="true" />Workout logged</p>
                        </section>
                    </div>
                    <p className="mt-[20px] text-[13px] leading-relaxed text-[#B2A2CF]">Based on completed workouts, grouped by their start date in your local timezone. Duration includes all time between starting and ending a session. Multiple workouts in one day count as one streak day.</p>
                </>
            )}
        </div>
    )
}

export default Progress
