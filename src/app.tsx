import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { format, parse } from 'date-fns'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
    price: number,
) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}

const Row: React.FC<DataElement> = (props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {props.symbol}
                </TableCell>
                <TableCell align="right">{props.buy.length}</TableCell>
                <TableCell align="right">{props.sell.length}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {props.buy.map(i => <Box key={props.symbol+i}>+ {i}</Box>)}
                        {props.sell.map(i => <Box key={props.symbol+i}>- {i}</Box>)}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

interface DataState {
    data: DataElement[];
    metadata: MetaData;
}

interface MetaData {
    date: string;
}

interface DataElement {
    symbol: string;
    buy: string[];
    sell: string[];
}

const AppComponent: React.FC = () => {
    const [data, setData] = useState<DataState | undefined>(undefined);
    const [filter, setFilter] = useState("all");
    useEffect(() => {
        const fetchData = async () => {
            console.log("Getting Data");
            var res = await fetch('https://raw.githubusercontent.com/tnuanchuay/stock-signal/master/data/latest.json')
            var json = await res.json();

            return json;
        }

        fetchData().then(data => setData(data)).catch(console.error);
    }, []);


    return (
        <>
            <Box>
                <Typography variant="h1" component="h2">
                    Stock Signals
                </Typography>
                <Typography variant='subtitle2'>
                    {data?.metadata.date}
                </Typography>
            </Box>
            <Box>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="all"
                        name="radio-buttons-group"
                        onChange={(event) => setFilter((event.target as HTMLInputElement).value)}
                    >
                        <FormControlLabel value="all" control={<Radio />} label="All" />
                        <FormControlLabel value="buy" control={<Radio />} label="Only Buy" />
                        <FormControlLabel value="sell" control={<Radio />} label="Only Sell" />
                    </RadioGroup>
                </FormControl>
            </Box>
            <Box>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Symbols</TableCell>
                                <TableCell align="right"># of Buy Signal</TableCell>
                                <TableCell align="right"># of Sell Signal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.data.filter(i => {
                                if(filter === "all")
                                    return true;

                                if (filter === "buy")
                                    return i.buy.length > 0;

                                return i.sell.length > 0;
                            }).sort((a, b) => {
                                return (a.buy.length + a.sell.length) > (b.buy.length + b.sell.length) ? -1 : 1
                            }).map((row) => (
                                <Row key={row.symbol} {...row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export const App = <AppComponent />;