'use client';
import api from "@/lib/features/api/axiosInterceptor";
import {useEffect, useState} from "react";
import axios from "axios";
import {Book} from "@/lib/interface/book";



export default function TabbleManager()
{
    const [tableList, setTableList] = useState<Book[]>([]);
    const [book,setBook] = useState<Book>(  {ID:0, NAME:"", NUMBER_OF_PAGE:0, ON_SALE:0});

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        api.get("/getallbooks")
            .then(response => {
                console.log(response);
                setTableList(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            api.delete(`/deletebook/${id}`)
                .then(() => {
                    fetchBooks();
                })
                .catch(error => {
                    console.error('Delete failed!', error);
                });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBook = {
            ID : null,
            NAME: book.NAME,
            NUMBER_OF_PAGE: book.NUMBER_OF_PAGE,
            ON_SALE: book.ON_SALE
        };
        api.post("/addbook", newBook ).then((response) => {
            // handle response if needed
        })
            .catch((e)=> {console.log(e)})
            .finally(() =>{
                fetchBooks();
            });
    }

    return(
        <>
            <h2>Book List</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Number of Pages</th>
                    <th>On Sale</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tableList.map(book => (
                    <tr key={book.ID}>
                        <td>{book.ID}</td>
                        <td>{book.NAME}</td>
                        <td>{book.NUMBER_OF_PAGE}</td>
                        <td> {
                            book.ON_SALE === 1 ? "Yes" : "No"
                        } </td>
                        <td>
                            <button onClick={() => handleDelete(book.ID)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

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
                <button type="submit">Add Book</button>
            </form>

        </>

    );
}