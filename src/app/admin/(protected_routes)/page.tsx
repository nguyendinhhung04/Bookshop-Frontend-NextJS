'use client';

import {useAppSelector} from "@/lib/hooks";
import {redirect} from "next/navigation";
import Link from "next/link";

export default function AdminPage() {

    return (
        <>
            <div>
                <h1>Admin Page</h1>
                <p>Welcome to the admin page. Only authorized users can see this.</p>
            </div>
        </>
    );
}