import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { StockFilter } from '../constants/filter';

interface Props {
    setFilter: React.Dispatch<React.SetStateAction<StockFilter>>;
}

export const FilterSelector: React.FC<Props> = (props) => {
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Filter"
                    defaultValue={StockFilter.All}
                    onChange={(event) => {
                        const filter = parseInt((event.target as HTMLInputElement).value);
                        props.setFilter(filter);
                    }}
                >
                    <MenuItem value={StockFilter.All}>All</MenuItem>
                    <MenuItem value={StockFilter.OnlyBuy}>Only Buy</MenuItem>
                    <MenuItem value={StockFilter.OnlySell}>Only Sell</MenuItem>
                    <MenuItem value={StockFilter.Activities}>Activities</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}