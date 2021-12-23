import { createSlice } from '@reduxjs/toolkit'
import { api, User } from './auth'
import type { RootState } from '../../app/store'

type AuthState = {
    user: User | null
    token: string | null
    isAuthenticated: boolean
}

const initailState : AuthState = {
    user: null,
    token: null,
    isAuthenticated: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initailState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            api.endpoints.login.matchFulfilled,
            (state, { payload: { user, token } }) => {
                state.user = user
                state.token = token
                state.isAuthenticated = true
            },
        )
        // custom wanie
        builder.addMatcher(
            api.endpoints.logout.matchFulfilled,(state, ) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
            }
        )
    },
})

export const { logout } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
