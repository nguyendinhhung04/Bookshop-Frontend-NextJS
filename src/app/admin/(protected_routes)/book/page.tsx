'use client';

import api from "@/lib/features/api/axiosInterceptor";
import {useEffect, useRef, useState} from "react";
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
import BookDetailDialog from "@/app/admin/(components)/BookDetailDialog";
import CustomSearch from "@/app/admin/(components)/CustomSearch";
import {customSearchInfo, CustomSearchInfo} from "@/lib/interface/CustomSearchInfo";

interface TabbleRow{
    // ID: number,
    // NAME: string,
    // CATEGORY: string,
    // ON_SALE: number,
    // PRICE: number
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


export default function TabbleManager() {
    const [tableList, setTableList] = useState<TabbleRow[]>([]);



    // state cho dialog chi tiết/chỉnh sửa
    const [openDetail, setOpenDetail] = useState(false);
    const [bookDetailId, setBookDetailId] = useState<number>(-1);

    const searchBookInfo = useRef(CustomSearchInfo());

    const [openCustomSearch, setOpenCustomSearch] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const handleCloseAddDialog = () => setOpenAdd(false);

    const handleCloseDetailDialog = () => {
        setOpenDetail(false);
        setBookDetailId(-1)
    }
    const handleAfterUpdate = (result : boolean) => {
        if(result) {
            alert("Book update successfully!");
        }
        else {
            alert("Can not update book!");
        }
        setOpenDetail(false);
        setBookDetailId(-1);
        fetchBooks();
    }



    useEffect(() => {
        if(!openCustomSearch)
            fetchBooks();
        else handleCustomSearch(searchBookInfo.current);
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


    const handleCustomSearch = (inputInfo : customSearchInfo ) => {

        searchBookInfo.current  = inputInfo ;
        console.log("Custom search with info:", inputInfo);
        api.post(`/customSearch?page=${page}`, inputInfo)
        .then((response) => {
            setTableList(response.data);
        }).catch((error) => {
            console.error("There was an error!", error);
        });
    }

    const handleGetXlsx = async () => {
        try {
            let searchInfo = CustomSearchInfo();

            if (openCustomSearch) {
                searchInfo = searchBookInfo.current;
            } else {
                searchInfo.name = searchTerm;
            }

            const res = await api.post("/getxlsx", searchInfo, {
                responseType: "blob", // 👈 bắt buộc để nhận file binary
            });

            if (res.status === 200) {
                // Tạo link tải file Excel
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement("a");
                a.href = url;
                a.download = "Books.xlsx"; // tên file tải về
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Error exporting Excel:", error);
            alert("Export failed!");
        }
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
                                            setBookDetailId(b.ID);
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

            {/* Nút Export Excel */}
            <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleGetXlsx}
                >
                    Export Excel
                </Button>
            </Box>

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
                onClose={handleCloseAddDialog}
                onSuccess={fetchBooks}
            />

             {/*Dialog chi tiết/chỉnh sửa sách */}
            <BookDetailDialog
                state = {openDetail}
                onClose = {handleCloseDetailDialog}
                onAfterUpdate = {handleAfterUpdate}
                bookID = {bookDetailId}
            />

        </Box>
    );
}