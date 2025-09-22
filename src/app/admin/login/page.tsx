'use client';

import { useState } from 'react';
import axios from 'axios';
import {useAppDispatch, useAppSelector} from '@/lib/hooks';
import {login} from "@/lib/features/userAuthorization/userAuthSlice";
import {redirect, RedirectType} from "next/navigation";



export default function LoginForm() {

    const dispatch = useAppDispatch();
    const isAuthorized = useAppSelector((state) => state.userAuthorization.isAuthenticated);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    if(isAuthorized)
    {
        redirect("/admin");
    }

    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.postForm("https://localhost:7024/admin/login", {username, password}).then((data) => {
            if(data.status === 200)
            {
                dispatch(login(data.data.token));
                localStorage.setItem("token", data.data.token);
                redirect("/admin");
            }
            else {
                setError('Login false');
            }
        });

    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
            </div>
            {error && (
                <div style={{ color: 'red', marginTop: '8px' }}>
                    {error}
                </div>
            )}
            <button type="submit">Login</button>
        </form>
    );
}