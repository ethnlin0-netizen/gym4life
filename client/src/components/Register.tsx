import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('error')
    const navigate = useNavigate()
    const auth = useAuth()

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault() //stops page from refreshing on submit

        //frontend validation for password
        if(password.length < 8) {
            setMessage('Password must be at least 8 characters long')
            setMessageType('error')
            return
        }

        if(!/[A-Z]/.test(password)) {
            setMessage('Password must contain a capital letter')
            setMessageType('error')
            return
        }

        if(!/[0-9]/.test(password)) {
            setMessage('Password must contain a number')
            setMessageType('error')
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

        } catch(error: any) {
            setMessage(error.response?.data?.message || 'Server error, please try again')
            setMessageType('error')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Register