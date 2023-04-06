import React from 'react';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { StockFilter } from '../constants/filter';

interface Props {
    setFilter:  React.Dispatch<React.SetStateAction<StockFilter>>;
}

export const FilterSelector: React.FC<Props> = (props) => {
    return (
        <FormControl>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={StockFilter.All}
                name="radio-buttons-group"
                onChange={(event) => {
                    const filter = parseInt((event.target as HTMLInputElement).value);
                    props.setFilter(filter);
                }}
            >
                <FormControlLabel value={StockFilter.All} control={<Radio />} label="All" />
                <FormControlLabel value={StockFilter.OnlyBuy.toString()} control={<Radio />} label="Only Buy" />
                <FormControlLabel value={StockFilter.OnlySell} control={<Radio />} label="Only Sell" />
            </RadioGroup>
        </FormControl>
    );
}