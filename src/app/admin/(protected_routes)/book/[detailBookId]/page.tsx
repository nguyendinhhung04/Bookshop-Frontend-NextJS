'use client';

import api from "@/lib/features/api/axiosInterceptor";
import {Book} from "@/lib/interface/book";
import React, {useEffect, useState} from "react";
import {redirect, RedirectType} from "next/navigation";

export default function BookDetail(
    {
        params,
    }: {
        params: { detailBookId: string }
    }

)
{

    const [book,setBook] = useState<Book>(  {ID:0, NAME:"", NUMBER_OF_PAGE:0, ON_SALE:0});

    useEffect(() => {
        fetchBook( Number(params.detailBookId) );
    }, []);

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        api.put("/updatebook", book).then().catch();
        redirect("/admin/book", RedirectType.replace)
    }

    const fetchBook = (id : number) => {
        api.get(`/getbook/${id}`)
            .then(response => {
                setBook(response.data)
                console.log(response);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Add New Book</h2>
                <div>
                    <label>Title:</label>
                    <input type="text"
                           value={book.NAME}
                           onChange={e => setBook( {...book, NAME: e.target.value} )} required />
                </div>
                <div>
                    <label>Number of Pages:</label>
                    <input type="number"
                           value={book.NUMBER_OF_PAGE}
                           onChange={e => setBook({...book, NUMBER_OF_PAGE: Number(e.target.value)})} required />
                </div>
                <div>
                    <label>On Sale:</label>
                    <input type="number"
                           value={book.ON_SALE}
                           onChange={e => setBook({...book, ON_SALE: Number(e.target.value)})} required />
                </div>
                <button type="submit">Update Book</button>
            </form>
        </div>
    )
}