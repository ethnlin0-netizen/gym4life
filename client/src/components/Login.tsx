import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                login,
                password
            })

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            navigate('/dashboard')
            
        } catch (error) {
            setMessage('Server error, please try again')
            setMessageType('error');
        }
    }

    return (
        <div>

        </div>
    )
}

export default Login