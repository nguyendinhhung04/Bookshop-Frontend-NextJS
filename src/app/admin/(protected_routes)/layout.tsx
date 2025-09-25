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
    Box
} from "@mui/material";

export default function ProtectedLayout(
    { children }: { children: React.ReactNode }
) {

    const functionList: FunctionList[] = [
        { ID: 1, FunctionName: "Home", Title: "Home", href: "/admin" },
        { ID: 2, FunctionName: "Book", Title: "Book", href: "/admin/book" }
    ];

    const dispatch = useAppDispatch();
    const isAuthorized = useAppSelector((state) => state.userAuthorization.isAuthenticated);

    if (!isAuthorized) {
        if (!localStorage.getItem("token")) {
            redirect("/admin/login");
        }
    }

    return (
        <>
            <AppBar position="static" color="primary">
                <Toolbar>
                    {/* Bên trái: Tiêu đề + menu */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h6">
                            Admin Panel
                        </Typography>

                        {functionList.map((func) => (
                            <Link key={func.ID} href={func.href} prefetch>
                                <Button
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    sx={{ textTransform: "none" }}
                                >
                                    {func.Title}
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    {/* Spacer đẩy Logout sang phải */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Bên phải: Logout */}
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => {
                            localStorage.removeItem("token");
                            dispatch(logout());
                            redirect("/admin/login");
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 2 }}>
                {children}
            </Box>
        </>
    );
}
