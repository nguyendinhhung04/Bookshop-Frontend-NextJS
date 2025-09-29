'use client';

import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useState} from "react";
import {Book} from "@/lib/interface/book";
import api from "@/lib/features/api/axiosInterceptor";

interface AddBookDialogProps {
    state: boolean;
    onClose: () => void;   // callback để đóng dialog từ ngoài
    onSuccess?: () => void; // callback khi thêm thành công
}

const AddBookDialog = ({state, onClose, onSuccess} : AddBookDialogProps  ) => {

    const [openAdd, setOpenAdd] = useState(state);
    const [book, setBook] = useState<Book>(Book());

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
                setOpenAdd(false);
                setBook(Book());
            });
    };

    return (

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

    )

}