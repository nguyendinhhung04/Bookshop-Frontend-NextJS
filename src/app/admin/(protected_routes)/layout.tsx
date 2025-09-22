'use client';

import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {redirect, RedirectType} from "next/navigation";
import Link from "next/link";
import {logout} from "@/lib/features/userAuthorization/userAuthSlice";
import {FunctionList} from "@/lib/interface/FunctionList";

export default function ProtectedLayout(
    { children }: { children: React.ReactNode }
)
{

    const functionList : FunctionList[] = [
        {ID: 1, FunctionName: "Home", Title: "Home", href: "/admin"},
        {ID: 2, FunctionName: "Book", Title: "Book", href: "/admin/book"}
    ]
    const dispatch = useAppDispatch();
    const isAuthorized = useAppSelector((state) => state.userAuthorization.isAuthenticated);
    if(!isAuthorized)
    {
        if(!localStorage.getItem("token"))
        {
            redirect("/admin/login");
        }
    }

    return(
        <>
            <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container">
                    <div>
                        <ul className="navbar-nav ms-auto">

                            {functionList.map((func) => (
                                <li key={func.ID} className="nav-item">
                                    <Link href={func.href} className="nav-link text-white">
                                        {func.Title}
                                    </Link>
                                </li>
                            ))}

                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    dispatch(logout());
                                    redirect("/admin/login");
                                }}
                            >Logout</button>
                        </ul>
                    </div>
                </div>
            </nav>
            <>{children}</>
        </>

    );
}