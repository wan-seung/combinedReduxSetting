import React from 'react'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import { useSelector } from 'react-redux'
import { useLoginMutation, useProtectedMutation } from '../features/auth/auth'

function Login() {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [login] = useLoginMutation()
    const [attemptAccess] = useProtectedMutation()

    const loginAsUser = async () => {
        try {
            await login({
                username: 'user',
                password: 'pass',
            })
        } catch (err) {
            console.log('err', err)
        }
    }

    const loginAsAdmin = async () => {
        try {
            await login({
                username: 'admin',
                password: 'pass',
            })
        } catch (err) {
            console.log('err', err)
        }
    }

    const makeAuthRequest = () => {
        attemptAccess()
            .unwrap()
            .then((e) => alert(e.message))
            .catch((e) => alert(e.data.message))
    }

    return (
        <div className="content">
            {isAuthenticated ? (
                <>
                    <p>You're logged-in.</p>
                </>
            ) : (
                <>
                    <p>You're in the Home page. Login to visit protected pages.</p>
                    <button className="button" onClick={loginAsUser}>
                        Login as User
                    </button>
                    <button className="button" onClick={loginAsAdmin}>
                        Login as Admin
                    </button>
                </>
            )}
            <button className="button" onClick={makeAuthRequest}>
                Authenticated request
            </button>
        </div>
    )
}

export default Login
