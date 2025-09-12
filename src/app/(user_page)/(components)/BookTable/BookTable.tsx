'use client';

import {Suspense, useEffect, useState} from "react";
import Loading from "@/app/(user_page)/loading";

interface Book {
    title: string;
    numberOfPages: number;
    onSale: number;
}



export default function BookTable({ params }: { params: Book[] }) {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        setBooks(params);
    }, []);


    return (
        <div>
            <p>This is Home Page</p>
            <ul>
                {books.map((book, index) => (
                    <li key={index}>
                        <h3>{book.title}</h3>
                        <p>Number of Pages: {book.numberOfPages}</p>
                        <p>On Sale: {book.onSale}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
