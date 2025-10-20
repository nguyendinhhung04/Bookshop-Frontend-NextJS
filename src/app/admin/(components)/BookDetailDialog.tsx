'use client';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
    Alert,
    Stack,
    Divider,
    Chip,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import api from "@/lib/features/api/axiosInterceptor";
import {useEffect, useState} from "react";
import EditIcon from "@mui/icons-material/Edit";

interface BookDetailProps {
    state: boolean;
    onClose: () => void;
    onAfterUpdate: (id: boolean) => void,
    bookID: number;
}

interface UpdatedBook {
    Id: number;
    NAME: string;
    DESCRIPTION: string;
    ON_SALE: number;
    PRICE: number;
    DISCOUNT: number;
}

interface DisplayBookDetail {
    ID: number;
    NAME: string;
    ON_SALE: number;
    PRICE: number;
    DISCOUNT: number;
    DESCRIPTION: string;
    COVER_URL: string;
    CATEGORY: string;
    PUBLISHER_DATE: string;
    AUTHORS: string;
}

const BookDetailDialog = ({state, onClose, onAfterUpdate, bookID}: BookDetailProps) => {

    const [bookDetail, setBookDetail] = useState<DisplayBookDetail>();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const getOneBook = (id: number) => {
        setLoading(true);
        api.get(`/getbook/${id}`)
            .then((response) => {
                setBookDetail(response.data);
                setErrors({});
            })
            .catch((error) => {
                console.log(error);
                setErrors({fetch: "Failed to load book details"});
            })
            .finally(() => setLoading(false));
    }

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        if (!bookDetail?.NAME.trim()) newErrors.name = "Book name is required";
        if (!bookDetail?.DESCRIPTION.trim()) newErrors.description = "Description is required";
        if ((bookDetail?.PRICE || 0) <= 0) newErrors.price = "Price must be greater than 0";
        if (bookDetail?.ON_SALE === 1 && (bookDetail?.DISCOUNT || 0) <= 0) {
            newErrors.discount = "Discount is required when on sale";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookDetail || bookDetail.ID == null) return;
        if (!validateForm()) return;

        const updatedBook: UpdatedBook = {
            Id: bookDetail.ID,
            NAME: bookDetail.NAME,
            DESCRIPTION: bookDetail.DESCRIPTION,
            ON_SALE: bookDetail.ON_SALE,
            PRICE: bookDetail.PRICE,
            DISCOUNT: bookDetail.DISCOUNT
        }

        api.put(`/updatebook/`, updatedBook)
            .then((response) => {
                console.log("Response from server:", response.data);
                onAfterUpdate(true);
            })
            .catch((e) => {
                console.log(e);
                onAfterUpdate(false);
            })
    };

    useEffect(() => {
        if (bookID && bookID === -1) return;
        if (!state) return;
        getOneBook(bookID);
    }, [bookID, state]);

    if (!state) return null;

    if (loading) {
        return (
            <Dialog open={state} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Book</DialogTitle>
                <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    if (!bookDetail) {
        return (
            <Dialog open={state} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Book</DialogTitle>
                <DialogContent>
                    <Alert severity="error">Could not fetch book details. Please try again.</Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={state} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: 1 }}>
                <EditIcon /> Edit Book
            </DialogTitle>
            <Box component="form" onSubmit={handleUpdate}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                    {/* General Info Section */}
                    <Box>
                        <Box sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#666", mb: 1.5 }}>
                            BASIC INFORMATION
                        </Box>

                        <TextField
                            label="ID"
                            value={bookDetail.ID}
                            disabled
                            fullWidth
                            size="small"
                            sx={{ mb: 1.5 }}
                        />

                        <TextField
                            label="Book Name *"
                            value={bookDetail.NAME}
                            onChange={(e) => {
                                setBookDetail({ ...bookDetail, NAME: e.target.value });
                                if (errors.name) setErrors(prev => ({...prev, name: ""}));
                            }}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mb: 1.5 }}
                        />

                        <TextField
                            label="Category"
                            value={bookDetail.CATEGORY}
                            disabled
                            fullWidth
                            size="small"
                            sx={{ mb: 1.5 }}
                        />

                        <TextField
                            label="Authors"
                            value={bookDetail.AUTHORS}
                            disabled
                            fullWidth
                            size="small"
                            multiline
                            maxRows={2}
                        />
                    </Box>

                    <Divider />

                    {/* Sales Info Section */}
                    <Box>
                        <Box sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#666", mb: 1.5 }}>
                            SALES INFORMATION
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={bookDetail.ON_SALE === 1}
                                    onChange={(e) =>
                                        setBookDetail({ ...bookDetail, ON_SALE: e.target.checked ? 1 : 0 })
                                    }
                                />
                            }
                            label="On Sale"
                            sx={{ mb: 1.5 }}
                        />

                        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
                            <TextField
                                label="Price *"
                                type="number"
                                value={bookDetail.PRICE}
                                onChange={(e) => {
                                    setBookDetail({ ...bookDetail, PRICE: Number(e.target.value) });
                                    if (errors.price) setErrors(prev => ({...prev, price: ""}));
                                }}
                                fullWidth
                                error={!!errors.price}
                                helperText={errors.price}
                                inputProps={{ min: 0, step: "0.01" }}
                            />

                            <TextField
                                label="Discount"
                                type="number"
                                value={bookDetail.DISCOUNT}
                                onChange={(e) => {
                                    setBookDetail({ ...bookDetail, DISCOUNT: Number(e.target.value) });
                                    if (errors.discount) setErrors(prev => ({...prev, discount: ""}));
                                }}
                                fullWidth
                                error={!!errors.discount}
                                helperText={errors.discount}
                                inputProps={{ min: 0, max: 100, step: "1" }}
                                disabled={bookDetail.ON_SALE === 0}
                            />
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Description Section */}
                    <Box>
                        <Box sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#666", mb: 1.5 }}>
                            DETAILS
                        </Box>

                        <TextField
                            label="Description *"
                            value={bookDetail.DESCRIPTION}
                            onChange={(e) => {
                                setBookDetail({ ...bookDetail, DESCRIPTION: e.target.value });
                                if (errors.description) setErrors(prev => ({...prev, description: ""}));
                            }}
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={5}
                            error={!!errors.description}
                            helperText={errors.description}
                            sx={{ mb: 1.5 }}
                        />

                        <TextField
                            label="Publish Date"
                            value={bookDetail.PUBLISHER_DATE}
                            disabled
                            fullWidth
                            size="small"
                            sx={{ mb: 1.5 }}
                        />

                        {bookDetail.COVER_URL && (
                            <Box sx={{
                                p: 1.5,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}>
                                <Box sx={{ fontSize: "0.875rem", color: "#666" }}>Cover URL:</Box>
                                <Chip label={bookDetail.COVER_URL} variant="outlined" size="small" />
                            </Box>
                        )}
                    </Box>

                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1, backgroundColor: "#fafafa" }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default BookDetailDialog;