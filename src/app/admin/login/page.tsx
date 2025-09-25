'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { login } from "@/lib/features/userAuthorization/userAuthSlice";
import { redirect } from "next/navigation";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
    Paper
} from "@mui/material";

export default function LoginForm() {
    const dispatch = useAppDispatch();
    const isAuthorized = useAppSelector((state) => state.userAuthorization.isAuthenticated);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (isAuthorized) {
        redirect("/admin");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.postForm("https://localhost:7024/admin/login", { username, password })
            .then((data) => {
                if (data.status === 200) {
                    dispatch(login(data.data.token));
                    localStorage.setItem("token", data.data.token);
                    redirect("/admin");
                } else {
                    setError('Login failed');
                }
            })
            .catch(() => setError("Login failed"));
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Admin Login
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
