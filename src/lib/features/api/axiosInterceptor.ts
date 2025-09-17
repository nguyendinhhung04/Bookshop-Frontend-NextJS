import axios from 'axios'
import {makeStore} from "@/lib/store";


const api = axios.create({
    baseURL: 'https://localhost:7024',
})

// Interceptor cho request
api.interceptors.request.use(
    (config) => {
        const token = makeStore().getState().userAuthorization.token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Interceptor cho response (ví dụ refresh token)
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         if (error.response?.status === 401) {
//             // ví dụ clear token khi unauthorized
//             // store.dispatch(clearToken())
//             console.warn("Unauthorized, redirect to login")
//         }
//         return Promise.reject(error)
//     }
// )

export default api