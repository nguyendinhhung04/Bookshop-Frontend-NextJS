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
    Paper,
    CircularProgress,
    InputAdornment,
    IconButton,
    Card,
    Stack
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginForm() {
    const dispatch = useAppDispatch();
    const isAuthorized = useAppSelector((state) => state.userAuthorization.isAuthenticated);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (isAuthorized) {
        redirect("/admin");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError(null);

        axios.postForm("https://localhost:7024/admin/login", { username, password })
            .then((data) => {
                if (data.status === 200) {
                    dispatch(login(data.data.token));
                    localStorage.setItem("token", data.data.token);
                    redirect("/admin");
                } else {
                    setError('Login failed. Please try again.');
                }
            })
            .catch((err) => {
                console.error("Login error:", err);
                setError(err.response?.data?.message || "Invalid username or password");
            })
            .finally(() => setLoading(false));
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                py: 3
            }}
        >
            <Container maxWidth="xs">
                <Card
                    elevation={10}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                mb: 2,
                                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    color: "white",
                                    fontSize: "2.5rem"
                                }}
                            >
                                📚
                            </Typography>
                        </Box>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: "#212529",
                                mb: 1
                            }}
                        >
                            Admin Login
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#6c757d",
                                fontSize: "0.95rem"
                            }}
                        >
                            Book Management System
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 2.5,
                                borderRadius: 1.5,
                                "& .MuiAlert-icon": {
                                    mr: 1
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        {/* Username Field */}
                        <TextField
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (error) setError(null);
                            }}
                            fullWidth
                            disabled={loading}
                            placeholder="Enter your username"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon sx={{ color: "#667eea", mr: 0.5 }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.5,
                                    transition: "all 0.3s ease",
                                    "&:hover fieldset": {
                                        borderColor: "#667eea"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#667eea",
                                        borderWidth: 2
                                    }
                                }
                            }}
                        />

                        {/* Password Field */}
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(null);
                            }}
                            fullWidth
                            disabled={loading}
                            placeholder="Enter your password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: "#667eea", mr: 0.5 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePassword}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.5,
                                    transition: "all 0.3s ease",
                                    "&:hover fieldset": {
                                        borderColor: "#667eea"
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#667eea",
                                        borderWidth: 2
                                    }
                                }
                            }}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading || !username.trim() || !password.trim()}
                            sx={{
                                background: loading ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                py: 1.5,
                                fontWeight: 700,
                                fontSize: "1rem",
                                borderRadius: 1.5,
                                textTransform: "none",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                                "&:hover": {
                                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                                    transform: "translateY(-2px)"
                                },
                                "&:disabled": {
                                    color: "#999"
                                }
                            }}
                        >
                            {loading ? (
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                    <CircularProgress size={20} color="inherit" />
                                    <span>Logging in...</span>
                                </Stack>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </Box>

                    {/* Footer Info */}
                    <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #e9ecef" }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#6c757d",
                                textAlign: "center",
                                display: "block",
                                lineHeight: 1.6
                            }}
                        >
                            This is a secure admin panel. Please use your credentials to access the book management system.
                        </Typography>
                    </Box>
                </Card>

                {/* Decorative Elements */}
                <Box
                    sx={{
                        mt: 4,
                        textAlign: "center",
                        color: "rgba(255,255,255,0.7)"
                    }}
                >
                    <Typography variant="caption">
                        © 2024 Book Management System. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}