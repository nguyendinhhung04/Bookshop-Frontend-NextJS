'use client'
import {Box, Button, Checkbox, FormControlLabel, MenuItem, Select, Slider, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import api from "@/lib/features/api/axiosInterceptor";
import {customSearchInfo, CustomSearchInfo} from "@/lib/interface/CustomSearchInfo";

interface CustomSearchProps{
    state: boolean;
    onSearch: (customSearchInfo: customSearchInfo) => void;
}

const CustomSearch = ({state, onSearch} : CustomSearchProps)=>{
    const [categoryList, setCategoryList] = useState<{ID: number, NAME: string}[]>([]);
    const [customSearchInfo, setCustomSearchInfo] = useState(
        CustomSearchInfo()
    );
    const [priceBarValue, setPriceBarValue] = useState<number[]>([0, 1000000]);
    const PRICE_LIMIT = 1000000;

    const handleChangePriceBar = (event: Event, newValue: number[]) => {
        setPriceBarValue(newValue);
        setCustomSearchInfo({...customSearchInfo, min_Price: newValue[0], max_Price: newValue[1] });
    };

    useEffect(() => {
        api.get("/getallcategory").then((res) => {
            setCategoryList(res.data);
        });
    }, []);

    if (!state) return null;
    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 3,
                maxWidth: 650,   // độ rộng tối đa của form
                mx: "left",      // căn giữa theo chiều ngang
            }}
        >
            {/* Hàng 1: Tên sách, Category, Author */}
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField name="name" label="ID" required onChange={
                    (e) => setCustomSearchInfo({...customSearchInfo, id: Number(e.target.value)})
                } />
                <TextField name="name" label="Book Name" required fullWidth onChange={
                    (e) => setCustomSearchInfo({...customSearchInfo, name: e.target.value})
                } />

                <TextField
                    name="author"
                    label="Author"
                    fullWidth
                    value={customSearchInfo.author_Name}
                    onChange={(e) => setCustomSearchInfo({ ...customSearchInfo, author_Name: e.target.value })}
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1, maxWidth: 200 }}>
                <Select
                    value={customSearchInfo.category_Id || ''}
                    label="Category"
                    onChange={(e) => setCustomSearchInfo({ ...customSearchInfo, category_Id: Number(e.target.value) })}
                >
                    {categoryList.map((category) => (
                        <MenuItem key={category.ID} value={category.ID}>
                            {category.NAME}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            {/* Hàng 2: OnSale, Price, Discount */}
            <Box sx={{ display: "flex", alignItems: "center", maxWidth: 200 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={customSearchInfo.on_Sale === 1}
                            onChange={(e) =>
                                setCustomSearchInfo({
                                    ...customSearchInfo,
                                    on_Sale: e.target.checked ? 1 : 0,
                                })
                            }
                        />
                    }
                    label="On Sale"
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1, maxWidth: 500}}>
                <TextField
                    label="Min Price"
                    type="number"
                    required
                    value={priceBarValue[0]}
                    onChange={(e) => setPriceBarValue([Number(e.target.value), priceBarValue[1]])}
                />
                <Slider
                    getAriaLabel={() => 'Temperature range'}
                    value={priceBarValue}
                    onChange={handleChangePriceBar}
                    valueLabelDisplay="auto"
                    min = {10000}
                    max = {PRICE_LIMIT}
                    step = {10000}
                />
                <TextField
                    label="Max Price"
                    type="number"
                    required
                    value={priceBarValue[1]}
                    onChange={(e) => setPriceBarValue([priceBarValue[0], Number(e.target.value)])}
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1, maxWidth: 300}}>
                <TextField
                    name="discount"
                    label="Discount"
                    type="number"
                    fullWidth
                    value  = {customSearchInfo.discount}
                    onChange={(e) => setCustomSearchInfo({...customSearchInfo, discount: Number(e.target.value)})}
                />
            </Box>
            {/* Hàng 3: Nút Search */}
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                        e.preventDefault();
                        onSearch(customSearchInfo);
                    }}
                >
                    Search
                </Button>
            </Box>
        </Box>
    )
}

export default CustomSearch;