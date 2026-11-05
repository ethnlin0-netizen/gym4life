import { useState } from 'react'
import Login from '../components/Login.tsx'
import Register from '../components/Register.tsx'
import deadliftPreview from '../assets/deadlift-preview.png'
import squatPreview from '../assets/squat-preview.png'

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<'register' | 'login'>('register')

    return(
        <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#100A23] text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex">
                <div className="w-full bg-linear-to-b from-[#0E0A25] from-[40%] to-[#351066] md:w-1/2" />
                <div className="hidden w-1/2 bg-linear-to-b from-[#1B0B29] from-[40%] to-[#590D61] md:block" />
                <div className="absolute inset-0 opacity-60" style={{
                    backgroundImage: 'radial-gradient(circle at 21px 32px, #FFC35440 1.5px, transparent 2.5px), radial-gradient(circle at 89px 79px, #F69B5340 1.5px, transparent 2.5px), radial-gradient(circle at 139px 41px, #FFC35430 1px, transparent 2.5px)',
                    backgroundSize: '171px 157px, 213px 129px, 239px 187px',
                }} />
            </div>

            <header className="mx-auto w-full max-w-[1440px] px-[24px] pt-[36px] sm:px-[6.25%] sm:pt-[48px]">
                <p className="text-[24px] font-bold tracking-tight">GYM4LIFE</p>
            </header>

            <main className="mx-auto grid w-full max-w-[1440px] flex-1 items-start gap-[32px] px-[24px] py-[36px] sm:px-[6.25%] md:grid-cols-2 md:gap-[9%] md:pt-[44px] md:pb-[20px]">
                <section aria-labelledby="landing-heading">
                    <h1 id="landing-heading" className="max-w-[500px] text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.28] font-bold text-[#D59BFF]">Create and track workouts that count.</h1>

                    <div aria-hidden="true" className="relative mt-[24px] hidden aspect-square w-full max-w-[370px] select-none md:block">
                        <img src={deadliftPreview} alt="" className="absolute top-0 right-0 aspect-[480/678] w-[62%] object-cover" />
                        <img src={squatPreview} alt="" className="absolute bottom-0 left-0 aspect-[480/678] w-[62%] object-cover" />
                    </div>
                </section>

                <section aria-labelledby="get-started-heading" className="mx-auto w-full max-w-[470px] rounded-[16px] bg-[#13051E]/90 px-[20px] pt-[22px] pb-[28px] shadow-[0_18px_48px_#10031F30] sm:px-[26px] md:min-h-[435px]">
                    <h2 id="get-started-heading" className="text-center text-[clamp(2.4rem,4.5vw,3.5rem)] leading-tight font-bold text-[#D59BFF] underline decoration-[#8741B2] decoration-2 underline-offset-[7px]">Get Started</h2>
                    <div role="group" aria-label="Account form" className="mx-auto mt-[24px] mb-[15px] grid max-w-[310px] grid-cols-2 rounded-[14px] bg-[#0D0618] text-[17px] font-semibold">
                        <button type="button" aria-pressed={activeTab === 'register'} className="cursor-pointer rounded-[14px] px-[10px] py-[7px] text-[#D6BBE9] transition-colors hover:bg-[#281335] focus-visible:outline-2 focus-visible:outline-[#00BFFF] aria-pressed:bg-[#DDC1F2] aria-pressed:text-[#240C35]" onClick={() => setActiveTab('register')}>Register</button>
                        <button type="button" aria-pressed={activeTab === 'login'} className="cursor-pointer rounded-[14px] px-[10px] py-[7px] text-[#D6BBE9] transition-colors hover:bg-[#281335] focus-visible:outline-2 focus-visible:outline-[#00BFFF] aria-pressed:bg-[#DDC1F2] aria-pressed:text-[#240C35]" onClick={() => setActiveTab('login')}>Login</button>
                    </div>
                    {activeTab === 'register' && <Register />}
                    {activeTab === 'login' && <Login />}
                </section>
            </main>

            <footer className="px-[24px] pb-[24px] text-center text-[15px] font-semibold text-white">Gym4Life © {new Date().getFullYear()} All Rights Reserved</footer>
        </div>
    )
}

export default LandingPage
