import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.tsx'

const inputStyle = 'min-w-0 w-full rounded-[9px] border border-transparent bg-[#37083E] px-[14px] py-[11px] text-[14px] text-white placeholder:text-[#EAD8F4] focus:border-[#00BFFF] focus:outline-1 focus:outline-[#00BFFF]'

function Login() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const auth = useAuth()

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                login,
                password
            })

            auth?.login(response.data.token, response.data.user.id, response.data.user.login)
            navigate('/dashboard')

        } catch(error) {
            setMessage(axios.isAxiosError(error) ? error.response?.data?.message || 'Server error, please try again' : 'Server error, please try again')
            setLogin('')
            setPassword('')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="grid gap-[10px]">
                <input
                    type="text"
                    aria-label="Login"
                    placeholder="Login"
                    autoComplete="username"
                    className={inputStyle}
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input
                    type="password"
                    aria-label="Password"
                    placeholder="Password"
                    autoComplete="current-password"
                    className={inputStyle}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="col-span-full mt-[2px] cursor-pointer rounded-full bg-[#4C0871] px-[16px] py-[8px] text-[22px] font-bold text-white transition-colors hover:bg-[#650F8D] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#00BFFF]">Login</button>
            </form>
            {message && <p role="alert" className="mt-[12px] text-[14px] text-[#FF9DC1]">{message}</p>}
        </div>
    )
}

export default Login
