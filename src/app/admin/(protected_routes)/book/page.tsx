'use client';

import api from "@/lib/features/api/axiosInterceptor";
import { useEffect, useState } from "react";
import { Book } from "@/lib/interface/book";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

export default function TabbleManager() {
    const [tableList, setTableList] = useState<Book[]>([]);
    const [book, setBook] = useState<Book>( Book() );
    const [openAdd, setOpenAdd] = useState(false);

    // state cho dialog chi tiết/chỉnh sửa
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Sách được chọn để xem/chỉnh sửa

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        api
            .get("/getallbooks")
            .then((response) => {
                setTableList(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            api
                .delete(`/deletebook/${id}`)
                .then(() => {
                    fetchBooks();
                })
                .catch((error) => {
                    console.error("Delete failed!", error);
                });
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const newBook = {
            ID: null,
            NAME: book.NAME,
            NUMBER_OF_PAGE: book.NUMBER_OF_PAGE,
            ON_SALE: book.ON_SALE,
        };
        api
            .post("/addbook", newBook)
            .catch((e) => console.log(e))
            .finally(() => {
                fetchBooks();
                setOpenAdd(false);
                setBook(Book());
            });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBook) return;
        api
            .put(`/updatebook/`, selectedBook)
            .catch((e) => console.log(e))
            .finally(() => {
                fetchBooks();
                setOpenDetail(false);
                setSelectedBook(null);
            });
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5">Book List</Typography>
                <Button variant="contained" onClick={() => setOpenAdd(true)}>
                    Add Book
                </Button>
            </Box>

            {/* Bảng danh sách sách */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Number of Pages</TableCell>
                            <TableCell>On Sale</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableList.map((b) => (
                            <TableRow key={b.ID}>
                                <TableCell>{b.ID}</TableCell>
                                <TableCell>{b.NAME}</TableCell>
                                <TableCell>{b.NUMBER_OF_PAGE}</TableCell>
                                <TableCell>{b.ON_SALE === 1 ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                        onClick={() => {
                                            setSelectedBook(b);
                                            setOpenDetail(true);
                                        }}
                                    >
                                        View / Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(b.ID)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog thêm sách */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Book</DialogTitle>
                <Box component="form" onSubmit={handleAdd}>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Title"
                            value={book.NAME}
                            onChange={(e) => setBook({ ...book, NAME: e.target.value })}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Number of Pages"
                            type="number"
                            value={book.NUMBER_OF_PAGE}
                            onChange={(e) =>
                                setBook({ ...book, NUMBER_OF_PAGE: Number(e.target.value) })
                            }
                            required
                            fullWidth
                        />
                        <TextField
                            label="On Sale (0 or 1)"
                            type="number"
                            value={book.ON_SALE}
                            onChange={(e) =>
                                setBook({ ...book, ON_SALE: Number(e.target.value) })
                            }
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAdd(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* Dialog chi tiết/chỉnh sửa sách */}
            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Book</DialogTitle>
                {selectedBook && (
                    <Box component="form" onSubmit={handleUpdate}>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/*<TextField*/}
                            {/*    label="ID"*/}
                            {/*    value={selectedBook.ID}*/}
                            {/*    disabled*/}
                            {/*    fullWidth*/}
                            {/*/>*/}
                            {/*<TextField*/}
                            {/*    label="Title"*/}
                            {/*    value={selectedBook.NAME}*/}
                            {/*    onChange={(e) =>*/}
                            {/*        setSelectedBook({ ...selectedBook, NAME: e.target.value })*/}
                            {/*    }*/}
                            {/*    required*/}
                            {/*    fullWidth*/}
                            {/*/>*/}

                            {Object.entries(selectedBook).map(([key, value]) => (
                                <TextField
                                    key={key}
                                    label={key}
                                    value={value}
                                    onChange={(e) =>
                                        setBook({
                                            ...selectedBook,
                                            [key]: isNaN(Number(value)) ? e.target.value : Number(e.target.value),
                                        })
                                    }
                                    fullWidth
                                />
                            ))}

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDetail(false)} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Save Changes
                            </Button>
                        </DialogActions>
                    </Box>
                )}
            </Dialog>
        </Box>
    );
}
