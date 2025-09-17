'use client';
import api from "@/lib/features/api/axiosInterceptor";
import {useEffect, useState} from "react";

interface Book{
    id: number;
    title: string;
    numberOfPages: number;
    onSale: number;
}

export default function TabbleManager()
{
    const [TableList, setTableList] = useState<Book[]>([]);

    useEffect(() => {
        api.get("/getbooks")
            .then(response => {
                console.log(response);
                //setTableList(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return(
        <div>This is Table Manager Page</div>


    );
}