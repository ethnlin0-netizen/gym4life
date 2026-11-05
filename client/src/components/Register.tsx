import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

const inputStyle = 'min-w-0 w-full rounded-[9px] border border-transparent bg-[#37083E] px-[14px] py-[11px] text-[14px] text-white placeholder:text-[#EAD8F4] focus:border-[#00BFFF] focus:outline-1 focus:outline-[#00BFFF]'

function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const auth = useAuth()

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault() //stops page from refreshing on submit

        //frontend validation for password
        if(password.length < 8) {
            setMessage('Password must be at least 8 characters long')
            return
        }

        if(!/[A-Z]/.test(password)) {
            setMessage('Password must contain a capital letter')
            return
        }

        if(!/[0-9]/.test(password)) {
            setMessage('Password must contain a number')
            return
        }

        //send post request to backend with user fields
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                firstName,
                lastName,
                email,
                login,
                password
            })
            //TO DO: add email verification
            
            //after registering they should have access to auth
            auth?.login(response.data.token, response.data.user.id, response.data.user.login)
            navigate('/dashboard')

        } catch(error) {
            setMessage(axios.isAxiosError(error) ? error.response?.data?.message || 'Server error, please try again' : 'Server error, please try again')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                <input
                    type="text"
                    aria-label="First Name"
                    placeholder="First Name"
                    autoComplete="given-name"
                    className={inputStyle}
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    aria-label="Last Name"
                    placeholder="Last Name"
                    autoComplete="family-name"
                    className={inputStyle}
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    type="email"
                    aria-label="Email"
                    placeholder="Email"
                    autoComplete="email"
                    className={inputStyle}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
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
                    autoComplete="new-password"
                    className={`${inputStyle} col-span-full`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="col-span-full mt-[2px] cursor-pointer rounded-full bg-[#4C0871] px-[16px] py-[8px] text-[22px] font-bold text-white transition-colors hover:bg-[#650F8D] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#00BFFF]">Register</button>
            </form>
            {message && <p role="alert" className="mt-[12px] text-[14px] text-[#FF9DC1]">{message}</p>}
        </div>
    )
}

export default Register
