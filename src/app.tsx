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
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { FilterSelector } from './components/filter';
import { StockSort as Sort } from './constants/sort';
import { StockFilter } from './constants/filter';
import { Order } from './constants/order';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import Link from '@mui/material/Link';

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
    activities: string[];
    last_day_percent_change: number;
    last_5days_percent_change: number;
}

const AppComponent: React.FC = () => {
    const [data, setData] = useState<DataState | undefined>(undefined);
    const [filter, setFilter] = useState(StockFilter.All);
    const [sort, setSort] = useState(Sort.BySignal);
    const [order, setOrder] = useState(Order.Descending);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Getting Data");
            const res = await fetch('https://storage.googleapis.com/signals-bck/latest.json');
            const json = await res.json();

            return json;
        }

        fetchData().then(data => setData(data)).catch(console.error);
    }, []);

    const filterFunction = (item: DataElement) => {
        switch (filter) {
            case StockFilter.OnlyBuy:
                return item.buy.length > 0;
            case StockFilter.OnlySell:
                return item.sell.length > 0;
            case StockFilter.Activities:
                return item.activities.length > 0;
            default:
            case StockFilter.All:
                return true;
        }
    };

    const sortFunction = (order: Order): (a: DataElement, b: DataElement) => number => {
        const orderValue = order === Order.Ascending ? [-1, 1] : [1, -1]
        return (a: DataElement, b: DataElement) => {
            switch (sort) {
                case Sort.BySignal:
                default:
                    return [""].concat(a.buy).concat(a.sell).length < [""].concat(b.buy).concat(b.sell).length ? orderValue[0] : orderValue[1];
                case Sort.ByLastDayChange:
                    return a.last_day_percent_change < b.last_day_percent_change ? orderValue[0] : orderValue[1];
                case Sort.ByLast5DayChange:
                    return a.last_5days_percent_change < b.last_5days_percent_change ? orderValue[0] : orderValue[1];
            }
        }

    }

    const clickToSort = (newSort: Sort): () => void => {
        return () => {
            if (newSort != sort) {
                setSort(newSort);
                setOrder(Order.Descending);
                return;
            }

            setOrder(order === Order.Descending ? Order.Ascending : Order.Descending);
        }
    }

    return (
        <>
            <Box display="flex" justifyContent="center" >
                <Box>
                    <Box display="flex">
                        <Typography variant="h1" component="h1">
                            Signals
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="right">
                        <Typography variant='subtitle2' color='GrayText'>
                            v.{data?.metadata.date}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Container sx={{ mt: '2vh' }}>
                <Box display="flex" justifyContent="right">
                    <Box display="flex">
                        <FilterSelector setFilter={setFilter} />
                    </Box>
                </Box>
            </Container>
            <Container sx={{ mt: '2vh' }}>
                <Box>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Symbols</TableCell>
                                    <TableCell align="right" onClick={clickToSort(Sort.BySignal)}>
                                        <Box display="flex" justifyContent="right">
                                            {sort === Sort.BySignal && (order === Order.Ascending ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                                            <Typography variant="subtitle2" fontWeight={sort === Sort.BySignal ? 600 : 500}>
                                                Signals
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" onClick={clickToSort(Sort.ByLastDayChange)}>
                                        <Box display="flex" justifyContent="right">
                                            {sort === Sort.ByLastDayChange && (order === Order.Ascending ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                                            <Typography variant="subtitle2" fontWeight={sort === Sort.ByLastDayChange ? 600 : 500}>
                                                Last day % change
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" onClick={clickToSort(Sort.ByLast5DayChange)} >
                                        <Box display="flex" justifyContent="right">
                                            {sort === Sort.ByLast5DayChange && (order === Order.Ascending ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                                            <Typography variant="subtitle2" fontWeight={sort === Sort.ByLast5DayChange ? 600 : 500}>
                                                Last 5 day % change
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data && data.data
                                        .filter(filterFunction)
                                        .sort(sortFunction(order))
                                        .map((row) => (
                                            <Row key={row.symbol} {...row} />
                                        ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </>
    )
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
                    <Link href={`https://www.tradingview.com/chart/?symbol=SET%3A${props.symbol.slice(0, -3)}`} variant='body1' target="_blank">
                        {props.symbol}
                    </Link>
                </TableCell>
                <TableCell align="right">
                    {
                        ([] as string[])
                            .concat(props.buy.map(_ => "🟩"))
                            .concat(props.activities.map(_ => "🟦"))
                            .concat(props.sell.map(_ => "🟥"))
                    }
                </TableCell>
                <TableCell align="right">
                    <Typography variant='body1'>
                        {Math.round(props.last_day_percent_change * 100) / 100} % {props.last_day_percent_change > 0 ? "🟢" : "🔴"}
                    </Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography variant='body1'>
                        { }{Math.round(props.last_5days_percent_change * 100) / 100} % {props.last_5days_percent_change > 0 ? "🟢" : "🔴"}
                    </Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                            {props.buy.map(i => <Typography key={props.symbol + i} variant="body1">🟩 {i}</Typography>)}
                        </Box>
                        <Box>
                            {props.activities.map(i => <Typography key={props.symbol + i} variant="body1">🟦 {i}</Typography>)}
                        </Box>
                        <Box>
                            {props.sell.map(i => <Typography key={props.symbol + i} variant="body1">🟥 {i}</Typography>)}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export const App = (
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppComponent />;
    </ThemeProvider>
)