'use client';

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/lib/features/userAuthorization/userAuthSlice";
import { FunctionList } from "@/lib/interface/FunctionList";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export default function ProtectedLayout(
    { children }: { children: React.ReactNode }
) {

    const functionList: FunctionList[] = [
        { ID: 1, FunctionName: "Home", Title: "Home", href: "/admin" },
        { ID: 2, FunctionName: "Book", Title: "Book Management", href: "/admin/book" }
    ];

    const dispatch = useAppDispatch();
    const isAuthorized = useAppSelector((state) => state.userAuthorization.isAuthenticated);
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!isAuthorized) {
        if (!localStorage.getItem("token")) {
            redirect("/admin/login");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        redirect("/admin/login");
    };

    const navigationItems = [
        { icon: <HomeIcon />, label: "Home", href: "/admin", func: functionList[0] },
        { icon: <AutoStoriesIcon />, label: "Book Management", href: "/admin/book", func: functionList[1] }
    ];

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
            >
                <Toolbar>
                    {/* Logo & Title */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1.5,
                                background: "rgba(255,255,255,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                color: "white",
                                fontSize: "1.1rem"
                            }}
                        >
                            📚
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                    letterSpacing: 0.5
                                }}
                            >
                                Admin Panel
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    opacity: 0.8,
                                    display: "block",
                                    fontSize: "0.75rem"
                                }}
                            >
                                Book Management System
                            </Typography>
                        </Box>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1, mr: 2 }}>
                        {navigationItems.map((item) => (
                            <Link key={item.func.ID} href={item.href} style={{ textDecoration: "none" }}>
                                <Button
                                    startIcon={item.icon}
                                    sx={{
                                        textTransform: "none",
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: "0.95rem",
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        transition: "all 0.3s ease",
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                        "&:hover": {
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            transform: "translateY(-2px)"
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    {/* Logout Button */}
                    <Button
                        variant="outlined"
                        endIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            textTransform: "none",
                            color: "white",
                            borderColor: "rgba(255,255,255,0.5)",
                            fontWeight: 600,
                            display: { xs: "none", sm: "flex" },
                            "&:hover": {
                                borderColor: "white",
                                backgroundColor: "rgba(255,255,255,0.1)"
                            }
                        }}
                    >
                        Logout
                    </Button>

                    {/* Mobile Menu Button */}
                    <IconButton
                        color="inherit"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        sx={{ display: { xs: "flex", sm: "none" }, ml: 1 }}
                    >
                        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            >
                <Box sx={{ width: 280, p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Menu
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List sx={{ mb: 2 }}>
                        {navigationItems.map((item) => (
                            <Link key={item.func.ID} href={item.href} style={{ textDecoration: "none" }}>
                                <ListItemButton
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 0.5,
                                        color: "#212529",
                                        "&:hover": {
                                            backgroundColor: "#f0f2f5"
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "#667eea", minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </Link>
                        ))}
                    </List>

                    <Divider sx={{ my: 1 }} />

                    <ListItemButton
                        onClick={() => {
                            handleLogout();
                            setMobileOpen(false);
                        }}
                        sx={{
                            borderRadius: 1,
                            color: "#dc3545",
                            "&:hover": {
                                backgroundColor: "#ffe5e5"
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: "#dc3545", minWidth: 40 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    backgroundColor: "#f5f7fa",
                    py: 2
                }}
            >
                <Container maxWidth="lg">
                    {children}
                </Container>
            </Box>
        </>
    );
}