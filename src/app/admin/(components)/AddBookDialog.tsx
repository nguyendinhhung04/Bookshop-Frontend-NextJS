'use client';

import {
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
    Stack,
    FormHelperText,
    InputLabel,
    FormControl
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import {useState, useEffect} from "react";
import api from "@/lib/features/api/axiosInterceptor";

interface AddBookDialogProps {
    state: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface NewBook {
    NAME: string;
    ON_SALE: number;
    PRICE?: number;
    DISCOUNT?: number;
    DESCRIPTION: string;
    COVER_URL?: string;
    CATEGORY_ID: number | null;
    PUBLISHER_DATE?: string;
    AUTHORS_ID: number[];
}

function NewBook(): NewBook {
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

const AddBookDialog = ({state, onClose, onSuccess}: AddBookDialogProps) => {

    const [book, setBook] = useState<NewBook>(NewBook());
    const [categoryList, setCategoryList] = useState<{ID: number, NAME: string}[]>([]);
    const [authorInput, setAuthorInput] = useState(0);
    const [authors, setAuthors] = useState<number[]>([]);
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const handleAddAuthor = () => {
        if (!authorInput) return;
        if (authors.includes(authorInput)) {
            setErrors(prev => ({...prev, author: "Author already added"}));
            return;
        }
        setAuthors([...authors, authorInput]);
        setAuthorInput(0);
        setErrors(prev => ({...prev, author: ""}));
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
    }, [])

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        if (!book.NAME.trim()) newErrors.name = "Book name is required";
        if (!book.CATEGORY_ID) newErrors.category = "Category is required";
        if (!book.DESCRIPTION.trim()) newErrors.description = "Description is required";
        if (!book.PRICE) newErrors.price = "Price is required";
        if (book.ON_SALE && !book.DISCOUNT) newErrors.discount = "Discount is required if on sale";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newBook = { ...book, AUTHORS_ID: authors };
        api.post("/addbook", newBook)
            .then((res) => {
                alert("Book created successfully!");
                setBook(NewBook());
                setAuthors([]);
                setAuthorInput(0);
                setErrors({});
                onClose();
                if (res.data === true && onSuccess) {
                    onSuccess();
                }
            })
            .catch((err) => {
                console.error("Error creating book:", err);
                alert("Failed to create book!");
            });
    };

    const getAuthorName = (id: number) => {
        return allAuthors.find(a => a.ID === id)?.NAME || `Author #${id}`;
    };

    return (
        <Dialog open={state} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
                Add New Book
            </DialogTitle>
            <Box component="form" onSubmit={handleAdd}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                    {/* Book Name */}
                    <TextField
                        label="Book Name"
                        value={book.NAME}
                        onChange={(e) => {
                            setBook({ ...book, NAME: e.target.value });
                            if (errors.name) setErrors(prev => ({...prev, name: ""}));
                        }}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                        placeholder="Enter book name"
                    />

                    {/* Category */}
                    <FormControl fullWidth error={!!errors.category}>
                        <InputLabel>Category *</InputLabel>
                        <Select
                            value={book.CATEGORY_ID || ''}
                            label="Category *"
                            onChange={(e) => {
                                setBook({ ...book, CATEGORY_ID: Number(e.target.value) });
                                if (errors.category) setErrors(prev => ({...prev, category: ""}));
                            }}
                        >
                            {categoryList.map((category) => (
                                <MenuItem key={category.ID} value={category.ID}>
                                    {category.NAME}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                    </FormControl>

                    {/* On Sale, Price, Discount */}
                    <Stack spacing={2}>
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
                        />

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                            <TextField
                                label="Price *"
                                type="number"
                                value={book.PRICE || ""}
                                onChange={(e) => {
                                    setBook({ ...book, PRICE: Number(e.target.value) });
                                    if (errors.price) setErrors(prev => ({...prev, price: ""}));
                                }}
                                error={!!errors.price}
                                helperText={errors.price}
                                inputProps={{ min: 0, step: "0.01" }}
                            />

                            <TextField
                                label="Discount"
                                type="number"
                                value={book.DISCOUNT || ""}
                                onChange={(e) => setBook({ ...book, DISCOUNT: Number(e.target.value) })}
                                error={!!errors.discount}
                                helperText={errors.discount}
                                inputProps={{ min: 0, max: 100, step: "1" }}
                                disabled={book.ON_SALE === 0}
                            />
                        </Box>
                    </Stack>

                    {/* Description */}
                    <TextField
                        label="Description *"
                        value={book.DESCRIPTION}
                        onChange={(e) => {
                            setBook({ ...book, DESCRIPTION: e.target.value });
                            if (errors.description) setErrors(prev => ({...prev, description: ""}));
                        }}
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={5}
                        error={!!errors.description}
                        helperText={errors.description}
                        placeholder="Enter book description"
                    />

                    {/* Cover URL */}
                    <TextField
                        label="Cover URL"
                        value={book.COVER_URL || ""}
                        onChange={(e) => setBook({ ...book, COVER_URL: e.target.value })}
                        fullWidth
                        placeholder="https://example.com/image.jpg"
                    />

                    {/* Publisher Date */}
                    <TextField
                        label="Publisher Date"
                        type="date"
                        value={book.PUBLISHER_DATE || ""}
                        onChange={(e) => setBook({ ...book, PUBLISHER_DATE: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    {/* Authors Section */}
                    <Box sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        p: 2,
                        backgroundColor: "#fafafa"
                    }}>
                        <Box sx={{ mb: 1.5 }}>
                            <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Authors</InputLabel>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <FormControl sx={{ flex: 1 }} error={!!errors.author} size="small">
                                    <Select
                                        value={authorInput}
                                        onChange={(e) => setAuthorInput(e.target.value as number)}
                                        displayEmpty
                                    >
                                        <MenuItem value={0}>Select an author</MenuItem>
                                        {allAuthors.map((author) => (
                                            <MenuItem key={author.ID} value={author.ID}>
                                                {author.NAME}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    onClick={handleAddAuthor}
                                    endIcon={<AddIcon />}
                                    sx={{ textTransform: "none" }}
                                >
                                    Add
                                </Button>
                            </Box>
                            {errors.author && <FormHelperText error>{errors.author}</FormHelperText>}
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                            {authors.length === 0 ? (
                                <Box sx={{ color: "#999", fontSize: "0.875rem", py: 1 }}>
                                    No authors added yet
                                </Box>
                            ) : (
                                authors.map((author) => (
                                    <Chip
                                        key={author}
                                        label={getAuthorName(author)}
                                        onDelete={() => handleDeleteAuthor(author)}
                                        deleteIcon={<DeleteIcon />}
                                        variant="outlined"
                                        color="primary"
                                    />
                                ))
                            )}
                        </Box>
                    </Box>

                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Save Book
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default AddBookDialog;