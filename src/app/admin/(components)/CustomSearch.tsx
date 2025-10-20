'use client'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    TextField,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import api from "@/lib/features/api/axiosInterceptor";
import {customSearchInfo, CustomSearchInfo} from "@/lib/interface/CustomSearchInfo";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface CustomSearchProps {
    state: boolean;
    onSearch: (customSearchInfo: customSearchInfo, input_page: number) => void;
}

const CustomSearch = ({state, onSearch}: CustomSearchProps) => {
    const [categoryList, setCategoryList] = useState<{ID: number, NAME: string}[]>([{ID: -1, NAME: "All Categories"}]);
    const [customSearchInfo, setCustomSearchInfo] = useState(CustomSearchInfo());
    const [priceBarValue, setPriceBarValue] = useState<number[]>([0, 1000000]);
    const PRICE_LIMIT = 1000000;

    const handleChangePriceBar = (event: Event, newValue: number[]) => {
        setPriceBarValue(newValue);
        setCustomSearchInfo({...customSearchInfo, min_Price: newValue[0], max_Price: newValue[1]});
    };

    useEffect(() => {
        api.get("/getallcategory").then((res) => {
            setCategoryList([{ID: -1, NAME: "All Categories"}, ...res.data]);
        }).catch(err => console.error("Error loading categories:", err));
    }, []);

    const handleReset = () => {
        setCustomSearchInfo(CustomSearchInfo());
        setPriceBarValue([0, 1000000]);
    };

    const handleSearch = () => {
        onSearch(customSearchInfo, 1);
    };

    if (!state) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 3,
                backgroundColor: "#f8f9fa",
                border: "1px solid #e9ecef",
                borderRadius: 2
            }}
        >
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 600, color: "#212529" }}>
                🔍 Advanced Search
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                {/* Row 1: ID, Book Name, Author */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        name="id"
                        label="Book ID"
                        type="number"
                        size="small"
                        sx={{ flex: 0.8 }}
                        value={customSearchInfo.id || ""}
                        onChange={(e) => setCustomSearchInfo({...customSearchInfo, id: Number(e.target.value)})}
                        placeholder="e.g. 123"
                    />
                    <TextField
                        name="name"
                        label="Book Name"
                        size="small"
                        fullWidth
                        value={customSearchInfo.name}
                        onChange={(e) => setCustomSearchInfo({...customSearchInfo, name: e.target.value})}
                        placeholder="Search by book name..."
                    />
                    <TextField
                        name="author"
                        label="Author"
                        size="small"
                        fullWidth
                        value={customSearchInfo.author_Name}
                        onChange={(e) => setCustomSearchInfo({...customSearchInfo, author_Name: e.target.value})}
                        placeholder="Search by author..."
                    />
                </Stack>

                {/* Row 2: Category, On Sale, Discount */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={customSearchInfo.category_Id || -1}
                            label="Category"
                            onChange={(e) => setCustomSearchInfo({...customSearchInfo, category_Id: Number(e.target.value)})}
                        >
                            {categoryList.map((category) => (
                                <MenuItem key={category.ID} value={category.ID}>
                                    {category.NAME}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>On Sale</InputLabel>
                        <Select
                            label="On Sale"
                            value={customSearchInfo.on_Sale}
                            onChange={(e) =>
                                setCustomSearchInfo({
                                    ...customSearchInfo,
                                    on_Sale: e.target.value as number,
                                })
                            }
                        >
                            <MenuItem value={-1}>All</MenuItem>
                            <MenuItem value={1}>Yes - On Sale</MenuItem>
                            <MenuItem value={0}>No - Regular</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                {/* Row 3: Price Range */}
                <Box sx={{
                    p: 2.5,
                    backgroundColor: "#fff",
                    borderRadius: 1.5,
                    border: "1px solid #dee2e6"
                }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: "#495057" }}>
                        💰 Price Range: ${priceBarValue[0].toLocaleString()} - ${priceBarValue[1].toLocaleString()}
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
                        <TextField
                            label="Min Price ($)"
                            type="number"
                            size="small"
                            value={priceBarValue[0]}
                            onChange={(e) => {
                                const newMin = Number(e.target.value);
                                setPriceBarValue([newMin, priceBarValue[1]]);
                                setCustomSearchInfo({...customSearchInfo, min_Price: newMin});
                            }}
                            inputProps={{ min: 0, step: 10000 }}
                        />
                        <TextField
                            label="Max Price ($)"
                            type="number"
                            size="small"
                            value={priceBarValue[1]}
                            onChange={(e) => {
                                const newMax = Number(e.target.value);
                                setPriceBarValue([priceBarValue[0], newMax]);
                                setCustomSearchInfo({...customSearchInfo, max_Price: newMax});
                            }}
                            inputProps={{ min: 0, step: 10000 }}
                        />
                    </Stack>

                    <Slider
                        value={priceBarValue}
                        onChange={handleChangePriceBar}
                        valueLabelDisplay="auto"
                        min={0}
                        max={PRICE_LIMIT}
                        step={10000}
                        marks={[
                            { value: 0, label: "$0" },
                            { value: PRICE_LIMIT, label: `$${(PRICE_LIMIT / 1000).toFixed(0)}k` }
                        ]}
                        sx={{
                            "& .MuiSlider-markLabel": {
                                fontSize: "0.75rem"
                            }
                        }}
                    />
                </Box>

                {/* Action Buttons */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            flex: 1
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={handleReset}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            flex: 1
                        }}
                    >
                        Reset
                    </Button>
                </Stack>
            </Box>
        </Paper>
    )
}

export default CustomSearch;