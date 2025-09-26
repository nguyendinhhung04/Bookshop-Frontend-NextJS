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

interface TabbleRow{
    ID: number,
    NAME: string,
    CATEGORY: string,
    ON_SALE: number,
    PRICE: number
}

interface DisplayBookDetail {
    ID: number;
    NAME: string;
    NUMBER_OF_PAGE: number;
    ON_SALE: number;
    PRICE: number;
    DISCOUNT: number;
    DESCRIPTION: string;
    COVER_URL: string;
    CATEGORY: string|null;
    PUBLISHER_DATE: string|null;
}

function DisplayBookDetail() {
    return {
        ID: 0,
        NAME: "",
        NUMBER_OF_PAGE: 0,
        ON_SALE: 0,
        PRICE: 0,
        DISCOUNT: 0,
        DESCRIPTION: "",
        COVER_URL: "",
        CATEGORY: "",
        PUBLISHER_DATE: null
    }
}

export default function TabbleManager() {
    const [tableList, setTableList] = useState<TabbleRow[]>([]);
    const [book, setBook] = useState<Book>(Book());
    const [openAdd, setOpenAdd] = useState(false);

    // state cho dialog chi tiết/chỉnh sửa
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Sách được chọn để xem/chỉnh sửa
    const [bookDetail, setBookDetail] = useState<DisplayBookDetail>()

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

    const getOneBook = (id: number) => {
        api.get(`/getbook/${id}`).then((response1) => {
            console.log(response1.data);
            setBookDetail(response1.data);

            // api.get(`/getcategory/${response1.data.CATEGORY_ID}`).then((responese2) => {
            //     if(responese2.data)
            //     {
            //         setBookDetail(
            //             {
            //                 ID: response1.data.ID,
            //                 NAME: response1.data.NAME,
            //                 NUMBER_OF_PAGE: response1.data.NUMBER_OF_PAGE,
            //                 ON_SALE: response1.data.ON_SALE,
            //                 PRICE: response1.data.PRICE,
            //                 DISCOUNT: response1.data.DISCOUNT,
            //                 DESCRIPTION: response1.data.DESCRIPTION,
            //                 COVER_URL: response1.data.COVER_URL,
            //                 CATEGORY: responese2.data.NAME,
            //                 PUBLISHER_DATE: response1.data.PUBLISHER_DATE
            //             }
            //         )
            //     }
            // }).catch((error) => {console.log(error)})
        }).catch((error) => {console.log(error)})
    }


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
            CATEGORY_ID: book.CATEGORY_ID,
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
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>On Sale</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableList.map((b) => (
                            <TableRow key={b.ID}>
                                <TableCell>{b.ID}</TableCell>
                                <TableCell>{b.NAME}</TableCell>
                                <TableCell>{b.CATEGORY}</TableCell>
                                <TableCell>{b.ON_SALE === 1 ? "Yes" : "No"}</TableCell>
                                <TableCell>{b.PRICE}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                        onClick={() => {
                                            getOneBook(b.ID);
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
                            label="Name"
                            value={book.NAME}
                            onChange={(e) => setBook({ ...book, NAME: e.target.value })}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Category"
                            value={book.CATEGORY_ID}
                            onChange={(e) => setBook({ ...book, CATEGORY_ID: Number(e.target.value) })}
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
                {bookDetail && (
                    <Box component="form" onSubmit={handleUpdate}>
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="ID"
                                value={bookDetail.ID}
                                disabled
                                fullWidth
                            />
                            <TextField
                                label="Name"
                                value={bookDetail.NAME}
                                onChange={(e) =>
                                    setBookDetail({ ...bookDetail, NAME: e.target.value })
                                }
                                required
                                fullWidth
                            />
                            <TextField
                                label="Category"
                                value={bookDetail.CATEGORY}
                                disabled={true}
                                fullWidth
                            />
                            <TextField
                                label="On Sale (0 or 1)"
                                type="number"
                                value={bookDetail.ON_SALE}
                                onChange={(e) =>
                                    setBookDetail({ ...bookDetail, ON_SALE: Number(e.target.value) })
                                }
                                required
                                fullWidth
                            />
                            <TextField
                                label="Price"
                                type="number"
                                value={bookDetail.PRICE}
                                onChange={(e) =>
                                    setBookDetail({ ...bookDetail, PRICE: Number(e.target.value) })
                                }
                                required
                                fullWidth
                            />
                            <TextField
                                label="Discount"
                                type="number"
                                value={bookDetail.DISCOUNT}
                                onChange={(e) =>
                                    setBookDetail({ ...bookDetail, DISCOUNT: Number(e.target.value) })
                                }
                                required
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                value={bookDetail.DESCRIPTION}
                                onChange={(e) => setBookDetail({ ...bookDetail, DESCRIPTION: e.target.value })}
                                required
                                fullWidth
                                multiline
                                minRows={4}
                            />
                            <TextField
                                label="Publish date"
                                value={bookDetail.PUBLISHER_DATE}
                                disabled={true}
                                fullWidth
                            />
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