import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.tsx'

function Login() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
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

        } catch(error: any) {
            setMessage(error.response?.data?.message || 'Server error, please try again')
            setMessageType('error');
            setLogin('')
            setPassword('')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Login