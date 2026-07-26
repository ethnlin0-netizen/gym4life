import { useState } from 'react'
import axios from 'axios'

function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('error')

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
            
            //store token in localStorage
            localStorage.setItem('token', response.data.token)

            //store user object in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user))

            setMessage('Registration successful! You may now use your credentials to log in.')
        } catch (error) {
            setMessage('Server error, please try again')
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
            {message && <p>Message</p>}
        </div>
    )
}

export default Register