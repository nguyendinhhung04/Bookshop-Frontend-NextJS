'use client';

import {useAppSelector} from "@/lib/hooks";
import {redirect} from "next/navigation";

export default function AdminPage() {

    const isAuthorized = useAppSelector((state) => state.userAuthorization.isAuthenticated);

    if(!isAuthorized)
    {
        redirect("/admin/login");
    }


    return (
        <div>
            <h1>Admin Page</h1>
            <p>Welcome to the admin page. Only authorized users can see this.</p>
        </div>
    );
}