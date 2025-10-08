'use client';

import {
    Box,
    Button, Checkbox, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Close";
import {useState, useEffect} from "react";
import api from "@/lib/features/api/axiosInterceptor";

interface AddBookDialogProps {
    state: boolean;
    onClose: () => void;   // callback để đóng dialog từ ngoài
    onSuccess?: () => void; // callback khi thêm thành công
}

interface NewBook {
    NAME: string;
    ON_SALE: number;
    PRICE?: number;
    DISCOUNT?: number;
    DESCRIPTION?: string;
    COVER_URL?: string;
    CATEGORY_ID: number | null;
    PUBLISHER_DATE?: string;
    AUTHORS_ID: number[];
}

function NewBook() : NewBook {
    return {
        NAME: "",
        ON_SALE: 0,
        PRICE: undefined,
        DISCOUNT: undefined,
        DESCRIPTION: "",
        COVER_URL: "",
        CATEGORY_ID: null,
        PUBLISHER_DATE: undefined,
        AUTHORS_ID: []
    };
}

interface Author {
    ID: number,
    NAME: string,
    BIOGRAPHY: string
}

const AddBookDialog = ({state, onClose, onSuccess} : AddBookDialogProps  ) => {

    const [book, setBook] = useState<NewBook>(NewBook());
    const [categoryList, setCategoryList] = useState<{ID: number, NAME: string}[]>([]);


    const [authorInput, setAuthorInput] = useState(0);
    const [authors, setAuthors] = useState<number[]>([]);
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);

    const handleAddAuthor = () => {
        if (!authorInput) {return}
        if (authors.includes(authorInput)) {
            alert("Author already added");
            return;
        }
        setAuthors([...authors, authorInput]);
    };

    const handleDeleteAuthor = (authorID: number) => {
        setAuthors(authors.filter((a) => a !== authorID));
    };

    useEffect(() => {
        api.get("/getallcategory").then((res) => {
            setCategoryList(res.data);
        });
        api.get("/getallauthors").then((res) => {
            setAllAuthors(res.data);
        });
    },[])

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();

        const newBook = { ...book, AUTHORS_ID: authors };
        console.log(newBook);
        api.post("/addbook", newBook)
            .then((res) => {
                alert("Book created successfully!");
                onClose();
                if (res.data === true) {
                    if (onSuccess) onSuccess();
                }
            })
            .catch((err) => {
                console.error("Error creating book:", err);
                alert("Failed to create book!");
            });
    };

    return (

        <Dialog open={state} onClose={onClose} fullWidth maxWidth="sm">
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
                    <Select
                        value={book.CATEGORY_ID || ''}
                        label="Category"
                        onChange={(e) => setBook({ ...book, CATEGORY_ID: Number(e.target.value) })}
                    >
                        {categoryList.map((category) => (
                            <MenuItem key={category.ID} value={category.ID}>
                                {category.NAME}
                            </MenuItem>
                        ))}
                    </Select>

                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={book.ON_SALE === 1}
                                    onChange={(e) =>
                                        setBook({ ...book, ON_SALE: e.target.checked ? 1 : 0 })
                                    }
                                />
                            }
                            label="On Sale"
                            labelPlacement="start"
                        />

                        <TextField
                            label="Price"
                            type="number"
                            value={book.PRICE || ""}
                            onChange={(e) => setBook({ ...book, PRICE: Number(e.target.value) })}
                        />

                        <TextField
                            label="Discount"
                            type="number"
                            value={book.DISCOUNT || ""}
                            onChange={(e) => setBook({ ...book, DISCOUNT: Number(e.target.value) })}
                        />
                    </Box>
                    <TextField
                        label="Description"
                        value={book.DESCRIPTION}
                        onChange={(e) => setBook({ ...book, DESCRIPTION: e.target.value })}
                        required
                        fullWidth
                        multiline
                        minRows={4}
                    />
                    <TextField
                        label="Cover URL"
                        value={book.COVER_URL || ""}
                        onChange={(e) => setBook({ ...book, COVER_URL: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Publisher Date"
                        type="date"
                        value={book.PUBLISHER_DATE || ""}
                        onChange={(e) => setBook({ ...book, PUBLISHER_DATE: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Select
                                value={authorInput}
                                label="Authors"
                                onChange={(e) => setAuthorInput(e.target.value)}
                            >
                                {allAuthors.map((author) => (
                                    <MenuItem key={author.ID} value={author.ID}>
                                        {author.NAME}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Button variant="outlined" onClick={handleAddAuthor}>
                                Add
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {authors.map((author) => (
                                <Chip
                                    key={author}
                                    label={author}
                                    onDelete={() => handleDeleteAuthor(author)}
                                    deleteIcon={<DeleteIcon />}
                                />
                            ))}
                        </Box>
                    </Box>

                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="secondary">
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

export default AddBookDialog;