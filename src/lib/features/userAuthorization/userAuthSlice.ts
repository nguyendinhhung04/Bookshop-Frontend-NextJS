import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    token: null as string | null,
}

export const userAuthSlice = createSlice({
    name: 'userAuthorization',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.token = null
            state.isAuthenticated = false
        }
    }
})

export const { login, logout } = userAuthSlice.actions
export default userAuthSlice.reducer
