'use client';

import api from "@/lib/features/api/axiosInterceptor";
import { useEffect, useState } from "react";
import { Book } from "@/lib/interface/book";
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton, MenuItem,
    Paper, Select, Slider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import AddBookDialog from "@/app/admin/(components)/AddBookDialog";
import CustomSearch from "@/app/admin/(components)/CustomSearch";
import {customSearchInfo, CustomSearchInfo} from "@/lib/interface/CustomSearchInfo";

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
    ON_SALE: number;
    PRICE: number;
    DISCOUNT: number;
    DESCRIPTION: string;
    COVER_URL: string;
    CATEGORY: string|null;
    PUBLISHER_DATE: string|null;
    AUTHORS: string|null;
}

interface UpdatedBook {
    Id: number;
    NAME: string;
    DESCRIPTION: string;
    ON_SALE: number;
    PRICE: number;
    DISCOUNT: number;
}

export default function TabbleManager() {
    const [tableList, setTableList] = useState<TabbleRow[]>([]);



    // state cho dialog chi tiết/chỉnh sửa
    const [openDetail, setOpenDetail] = useState(false);
    const [bookDetail, setBookDetail] = useState<DisplayBookDetail | null>(null);
    const [searchBookInfo, setSearchBookInfo] = useState<customSearchInfo>(
        CustomSearchInfo()
    );

    const [openCustomSearch, setOpenCustomSearch] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const handleClose = () => setOpenAdd(false);

    useEffect(() => {
        if(!openCustomSearch)
            fetchBooks();
        else handleCustomSearch(searchBookInfo);
    }, [page]);

    const fetchBooks = () => {
        api
            .get(`/getallbooks?name=${searchTerm}&page=${page}`)
            .then((response) => {
                setTableList(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
                window.alert("Can not connect to server, Please try again later!");
            });
    };

    const getOneBook = (id: number) => {
        api.get(`/getbook/${id}`).then((response1) => {
            console.log(response1.data);
            setBookDetail(response1.data);
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

    const handleSearchInfo = (inputInfo : customSearchInfo) => {
        setSearchBookInfo(inputInfo);
    }

    const handleCustomSearch = (inputInfo : customSearchInfo ) => {
        console.log("Custom search with info:", inputInfo);
        api.post(`/customSearch?page=${page}`, inputInfo)
        .then((response) => {
            setTableList(response.data);
        }).catch((error) => {
            console.error("There was an error!", error);
        });
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookDetail) return;

        const updatedBook: UpdatedBook = {
            Id: bookDetail.ID,
            NAME: bookDetail.NAME,
            DESCRIPTION: bookDetail.DESCRIPTION,
            ON_SALE: bookDetail.ON_SALE,
            PRICE: bookDetail.PRICE,
            DISCOUNT: bookDetail.DISCOUNT
        }

        api
            .put(`/updatebook/`, updatedBook )
            .then((response) => {
                console.log("Response from server:", response.data);
            })
            .catch((e) => console.log(e))
            .finally(() => {
                fetchBooks();
                setOpenDetail(false);
                setBookDetail(null);
            });
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5">Book List</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    {!openCustomSearch && (
                        <>
                            <TextField
                                size="small"
                                placeholder="Search by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    fetchBooks();
                                    console.log("Searching for:", searchTerm);
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </>
                    )}
                    <Button variant="contained" onClick={(e) => {setOpenCustomSearch(!openCustomSearch)}}>
                        Custom search
                    </Button>
                    <Button variant="contained" onClick={() => setOpenAdd(true)}>
                        Add Book
                    </Button>

                </Box>
            </Box>

            <CustomSearch
                state={openCustomSearch}
                onSearch={handleCustomSearch}
            />

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

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2, gap: 2 }}>
                <IconButton
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    &lt;
                </IconButton>

                <Box sx={{ border: "1px solid black", px: 2, py: 1 }}>{page}</Box>

                <IconButton
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    &gt;
                </IconButton>
            </Box>

            <AddBookDialog
                state={openAdd}
                onClose={handleClose}
                onSuccess={fetchBooks}
            />

            {/* Dialog chi tiết/chỉnh sửa sách */}
            <Dialog open={openDetail} onClose={() => {setOpenDetail(false); setBookDetail(null)}} fullWidth maxWidth="sm">
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
                                label="Authors"
                                value={bookDetail.AUTHORS}
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
                            <Button onClick={() => {
                                setOpenDetail(false)
                                setBookDetail(null)
                            }} color="secondary">
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