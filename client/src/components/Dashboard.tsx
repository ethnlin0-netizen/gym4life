import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
    const auth = useAuth()
    const navigate = useNavigate()

    return (
        <div>
            <h1>Welcome, {auth?.username}</h1>
            <button onClick={() => {
                auth?.logout()
                navigate('/')
            }}>Log Out
            </button>
        </div>
    )
}

export default Dashboard