'use client';

import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import api from "@/lib/features/api/axiosInterceptor";
import {useEffect, useState} from "react";

interface BookDetailProps {
    state: boolean;
    onClose: () => void;
    onAfterUpdate : (id: boolean) => void,
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
    NAME: string ;
    ON_SALE: number;
    PRICE: number;
    DISCOUNT: number;
    DESCRIPTION: string;
    COVER_URL: string ;
    CATEGORY: string;
    PUBLISHER_DATE: string;
    AUTHORS: string;
}

const BookDetailDialog = ({state, onClose, onAfterUpdate, bookID} : BookDetailProps) => {


    const [bookDetail, setBookDetail] = useState<DisplayBookDetail>();

    const getOneBook = (id: number) => {
        api.get(`/getbook/${id}`).then((response1) => {
            console.log(response1.data);
            setBookDetail(response1.data);
        }).catch((error) => {console.log(error)})
    }



    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookDetail || bookDetail.ID ==null ) return;

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
                onAfterUpdate(true);
            })
            .catch((e) => {console.log(e);onAfterUpdate(false);})

    };

    useEffect(() => {
        if(bookID && bookID === -1) return;
        if(!state) return;
        getOneBook(bookID);
    }, [bookID]);

    if(!state || !bookDetail) return(
        <Dialog open={state} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Book</DialogTitle>
            <DialogTitle>Can not fetch Book</DialogTitle>
        </Dialog>
    );

    return(
        <Dialog open={state} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Book</DialogTitle>
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
                                    onClose()
                                }} color="secondary">
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