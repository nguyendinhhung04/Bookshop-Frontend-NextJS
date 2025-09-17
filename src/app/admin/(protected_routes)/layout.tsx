'use client';

import {useAppSelector} from "@/lib/hooks";
import {redirect, RedirectType} from "next/navigation";

export default function ProtectedLayout(
    { children }: { children: React.ReactNode }
)
{
    const isAuthorized = useAppSelector((state) => state.userAuthorization.isAuthenticated);
    if(!isAuthorized)
    {
        redirect("/admin/login");
    }

    return(
        <>{children}</>
    );
}