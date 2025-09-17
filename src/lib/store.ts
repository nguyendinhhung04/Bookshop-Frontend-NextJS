import { configureStore } from '@reduxjs/toolkit'
import {userAuthSlice} from "@/lib/features/userAuthorization/userAuthSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            userAuthorization: userAuthSlice.reducer,

        }
    })
}

// Lấy type của store được trả về từ function makeStore()
export type AppStore = ReturnType<typeof makeStore>
// Lấy type của state object khi gọi store.getState() thay vì phải định nghĩa thủ công
export type RootState = ReturnType<AppStore['getState']>
// Lấy type của hàm dispatch thay vì phải định nghĩa thủ công
export type AppDispatch = AppStore['dispatch']