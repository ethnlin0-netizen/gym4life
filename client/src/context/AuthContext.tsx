import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

interface AuthContextType {
    token: string | null
    userId: string | null
    username: string | null
    login: (token: string, userId: string, username: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null) //<> for types

function getTokenExpiry(token: string): number | null {
    try {
        const payload = token.split('.')[1]
        if (!payload) return null
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
        const decoded = JSON.parse(atob(padded))
        return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null
    } catch {
        return null
    }
}

function isTokenValid(token: string | null): boolean {
    if (!token) return false
    const expiry = getTokenExpiry(token)
    if (expiry === null) return false
    return expiry > Date.now()
}

function clearStoredAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
}

function readStoredAuth() {
    const token = localStorage.getItem('token')
    if (!isTokenValid(token)) {
        clearStoredAuth()
        return { token: null, userId: null, username: null }
    }
    return {
        token,
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username')
    }
}

//AuthProvider is a wrapper that makes auth state available to every component in the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => { //in TypeScript, children prop needs a type
    const stored = readStoredAuth()
    const [token, setToken] = useState<string | null>(stored.token)
    const [userId, setUserId] = useState<string | null>(stored.userId)
    const [username, setUsername] = useState<string | null>(stored.username)

    function login(token: string, userId: string, username: string): void {
        setToken(token)
        setUserId(userId)
        setUsername(username)
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
        localStorage.setItem('username', username)
    }

    function logout(): void {
        setToken(null)
        setUserId(null)
        setUsername(null)
        clearStoredAuth()
    }

    useEffect(() => {
        if (!token) return
        const expiry = getTokenExpiry(token)
        if (expiry === null || expiry <= Date.now()) {
            logout()
            return
        }
        const timeoutId = setTimeout(logout, expiry - Date.now())
        return () => clearTimeout(timeoutId)
    }, [token])

    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout()
                }
                return Promise.reject(error)
            }
        )
        return () => axios.interceptors.response.eject(interceptorId)
    }, [])

    //return the context provider wrapping children
    return (
        <AuthContext.Provider value={{ token, userId, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
