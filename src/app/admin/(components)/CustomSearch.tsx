'use client'
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import api from "@/lib/features/api/axiosInterceptor";
import {customSearchInfo, CustomSearchInfo} from "@/lib/interface/CustomSearchInfo";

interface CustomSearchProps{
    state: boolean;
    onSearch: (customSearchInfo: customSearchInfo) => void;
}

const CustomSearch = ({state, onSearch} : CustomSearchProps)=>{
    const [categoryList, setCategoryList] = useState<{ID: number, NAME: string}[]>([{ID: -1, NAME: "Default(All)"}]);
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
            console.log(res.data);
            setCategoryList([...categoryList, ...res.data]); // ??????????????????????????????
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
               <FormControl fullWidth size="small" >
                   <InputLabel>Category</InputLabel>
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
               </FormControl>
            </Box>
            {/* Hàng 2: OnSale, Price, Discount */}
            <Box sx={{ display: "flex", alignItems: "center", maxWidth: 200 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>On Sale</InputLabel>
                    <Select
                        label="On Sale"
                        value={customSearchInfo.on_Sale}
                        onChange={(e) =>
                            setCustomSearchInfo({
                                ...customSearchInfo,
                                on_Sale: e.target.value,
                            })
                        }
                    >
                        <MenuItem value={-1}>Default (All)</MenuItem>
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 1, maxWidth: 500}}>
                <TextField
                    label="Min Price"
                    type="number"
                    required
                    value={priceBarValue[0]}
                    onChange={(e) => {
                        setPriceBarValue([Number(e.target.value), priceBarValue[1]])
                        setCustomSearchInfo( {...customSearchInfo, min_Price : Number(e.target.value)})
                    }}
                />
                <Slider
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
                    onChange={(e) => {
                        setPriceBarValue([priceBarValue[0], Number(e.target.value)])
                        setCustomSearchInfo({...customSearchInfo, max_Price : Number(e.target.value)})
                    }}
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
                        console.log(customSearchInfo);
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