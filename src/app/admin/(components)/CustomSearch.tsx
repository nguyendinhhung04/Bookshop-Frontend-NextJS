'use client'
import {Box, Button, MenuItem, Select, Slider, TextField} from "@mui/material";

const CustomSearch = ()=>{
    return(
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

                <TextField name="author" label="Author" fullWidth />
            </Box>
            <Box sx={{ display: "flex", gap: 1, maxWidth: 200 }}>
                <Select
                    value={customSearchInfo.category_id || ''}
                    label="Category"
                    onChange={(e) => setCustomSearchInfo({ ...customSearchInfo, category_id: Number(e.target.value) })}
                >
                    {categoryList.map((category) => (
                        <MenuItem key={category.ID} value={category.ID}>
                            {category.NAME}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            {/* Hàng 2: OnSale, Price, Discount */}
            <Box sx={{ display: "flex", gap: 1, maxWidth: 100}}>
                <TextField name="onsale" label="On Sale (0/1)" type="number" required fullWidth />
            </Box>
            <Box sx={{ display: "flex", gap: 1, maxWidth: 500}}>
                <TextField name="price" label="Min Price" type="number" required value ={priceBarValue[0]}
                           onChange={(e) => setPriceBarValue([Number(e.target.value), priceBarValue[0]])}
                />
                <Slider
                    getAriaLabel={() => 'Temperature range'}
                    value={priceBarValue}
                    onChange={handleChangePriceBar}
                    valueLabelDisplay="auto"
                />
                <TextField name="price" label="Max Price" type="number" required value ={priceBarValue[1]}
                           onChange={(e) => setPriceBarValue([Number(e.target.value), priceBarValue[1]])}

                />
            </Box>
            <Box sx={{ display: "flex", gap: 1, maxWidth: 300}}>
                <TextField name="discount" label="Discount" type="number" fullWidth />
            </Box>
            {/* Hàng 3: Nút Search */}
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button type="submit" variant="contained" color="primary">
                    Search
                </Button>
            </Box>
        </Box>
    )
}