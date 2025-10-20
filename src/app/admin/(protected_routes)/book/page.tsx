'use client';

import api from "@/lib/features/api/axiosInterceptor";
import {useEffect, useRef, useState} from "react";
import { Book } from "@/lib/interface/book";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Stack,
    Chip,
    Pagination,
    Card
} from "@mui/material";
import AddBookDialog from "@/app/admin/(components)/AddBookDialog";
import BookDetailDialog from "@/app/admin/(components)/BookDetailDialog";
import CustomSearch from "@/app/admin/(components)/CustomSearch";
import {customSearchInfo, CustomSearchInfo} from "@/lib/interface/CustomSearchInfo";

interface TabbleRow {
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
    const [openDetail, setOpenDetail] = useState(false);
    const [bookDetailId, setBookDetailId] = useState<number>(-1);
    const searchBookInfo = useRef(CustomSearchInfo());
    const [openCustomSearch, setOpenCustomSearch] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const pageRef = useRef(1);
    const [loading, setLoading] = useState(false);

    const handleCloseAddDialog = () => setOpenAdd(false);

    const handleCloseDetailDialog = () => {
        setOpenDetail(false);
        setBookDetailId(-1)
    }

    const handleAfterUpdate = (result: boolean) => {
        if (result) {
            alert("Book updated successfully!");
        } else {
            alert("Failed to update book!");
        }
        setOpenDetail(false);
        setBookDetailId(-1);
        fetchBooks(pageRef.current);
    }

    useEffect(() => {
        fetchBooks(pageRef.current);
    }, []);

    const fetchBooks = (input_page : number) => {
        setLoading(true);
        api
            .get(`/getallbooks?name=${searchTerm}&page=${input_page}`)
            .then((response) => {
                setTableList(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
                alert("Cannot connect to server. Please try again later!");
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            api
                .delete(`/deletebook/${id}`)
                .then(() => {
                    alert("Book deleted successfully!");
                    fetchBooks(pageRef.current);
                })
                .catch((error) => {
                    console.error("Delete failed!", error);
                    alert("Failed to delete book!");
                });
        }
    };

    const handleCustomSearch = (inputInfo: customSearchInfo, input_page:number) => {
        searchBookInfo.current = inputInfo;
        setLoading(true);
        api.post(`/customSearch?page=${input_page}`, inputInfo)
            .then((response) => {
                setTableList(response.data);
            })
            .catch((error) => {
                console.error("Search error:", error);
                alert("Search failed!");
            })
            .finally(() => setLoading(false));
    }

    const handleChangePage = ()=>{
        if (openCustomSearch) {
            handleCustomSearch(searchBookInfo.current, pageRef.current);
        } else {
            fetchBooks(pageRef.current);
        }
    }

    const handleGetXlsx = async () => {
        try {
            let searchInfo = CustomSearchInfo();
            if (openCustomSearch) {
                searchInfo = searchBookInfo.current;
            } else {
                searchInfo.name = searchTerm;
            }

            setLoading(true);
            const res = await api.post("/getxlsx", searchInfo, {
                responseType: "blob",
            });

            if (res.status === 200) {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement("a");
                a.href = url;
                a.download = `Books_${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                alert("Export successful!");
            }
        } catch (error) {
            console.error("Export error:", error);
            alert("Export failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
            {/* Header Section */}
            <Card
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderRadius: 2
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            📚 Book Management
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                            Manage your book inventory
                        </Typography>
                    </Box>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignSelf: "flex-end" }}>
                        {!openCustomSearch && (
                            <TextField
                                size="small"
                                placeholder="Search books..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter'){
                                        pageRef.current = 1;
                                        setPage(pageRef.current);
                                        fetchBooks(pageRef.current);
                                    };
                                }}
                                sx={{
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    borderRadius: 1,
                                    minWidth: 200
                                }}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: "#667eea" }} />
                                }}
                            />
                        )}

                        <Button
                            variant={openCustomSearch ? "contained" : "outlined"}
                            onClick={() => setOpenCustomSearch(!openCustomSearch)}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                color: openCustomSearch ? "white" : "white",
                                borderColor: "rgba(255,255,255,0.5)",
                                backgroundColor: openCustomSearch ? "rgba(255,255,255,0.2)" : "transparent"
                            }}
                        >
                            Advanced Search
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenAdd(true)}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                backgroundColor: "rgba(255,255,255,0.2)",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.3)"
                                }
                            }}
                        >
                            Add Book
                        </Button>
                    </Stack>
                </Box>
            </Card>

            {/* Custom Search Section */}
            <CustomSearch
                state={openCustomSearch}
                onSearch={handleCustomSearch}
            />

            {/* Table Section */}
            <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                            <TableCell sx={{ fontWeight: 700, color: "#495057" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: "#495057" }}>Book Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: "#495057" }}>Category</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#495057" }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: "#495057" }}>Price</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#495057" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="textSecondary">
                                        No books found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tableList.map((b) => (
                                <TableRow
                                    key={b.ID}
                                    sx={{
                                        "&:hover": { backgroundColor: "#f8f9fa" },
                                        borderBottom: "1px solid #e9ecef"
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>{b.ID}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#212529" }}>
                                            {b.NAME}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={b.CATEGORY || "N/A"}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={b.ON_SALE === 1 ? "On Sale" : "Regular"}
                                            size="small"
                                            color={b.ON_SALE === 1 ? "success" : "default"}
                                            variant={b.ON_SALE === 1 ? "filled" : "outlined"}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: "#667eea" }}>
                                        {(b.PRICE*(1-b.DISCOUNT/100.0)).toLocaleString()} VND
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => {
                                                    setBookDetailId(b.ID);
                                                    setOpenDetail(true);
                                                }}
                                                title="Edit"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(b.ID, b.NAME)}
                                                title="Delete"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Action Buttons & Pagination */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CloudDownloadIcon />}
                    onClick={handleGetXlsx}
                    disabled={loading}
                    sx={{ textTransform: "none", fontWeight: 600, flex: { xs: 1, sm: "auto" } }}
                >
                    Export to Excel
                </Button>

                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                    <IconButton
                        size="small"
                        onClick={() =>{
                            pageRef.current = Math.max(1, pageRef.current - 1);
                            setPage(pageRef.current);
                            handleChangePage();
                        }}
                        disabled={page === 1 || loading}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>

                    <Box sx={{
                        px: 2,
                        py: 0.75,
                        border: "1px solid #dee2e6",
                        borderRadius: 1,
                        fontWeight: 600,
                        backgroundColor: "#f8f9fa",
                        minWidth: 50,
                        textAlign: "center"
                    }}>
                        {page}
                    </Box>

                    <IconButton
                        size="small"
                        onClick={() => {
                            pageRef.current += 1;
                            setPage(pageRef.current);
                            handleChangePage();
                        }}
                        disabled={loading || tableList.length === 0}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Stack>
            </Stack>

            {/* Dialogs */}
            <AddBookDialog
                state={openAdd}
                onClose={handleCloseAddDialog}
                onSuccess={()=> {
                    pageRef.current = 1;
                    setPage(pageRef.current);
                    fetchBooks(1);
                }}
            />

            <BookDetailDialog
                state={openDetail}
                onClose={handleCloseDetailDialog}
                onAfterUpdate={(result: boolean)=>{
                    handleAfterUpdate(result);
                }}
                bookID={bookDetailId}
            />
        </Box>
    );
}