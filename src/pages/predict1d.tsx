import React, { useEffect, useState } from 'react';
import { Header } from '../components/appbar';
import { StockFilter } from '../constants/filter';
import { Container, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { FilterSelector } from '../components/filter';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { StockSort as Sort } from '../constants/sort';
import { Order } from '../constants/order';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Link from '@mui/material/Link';

interface DataState {
    [key: string]: PredictResult;
}

interface PredictResult {
    tomorrow_price: number;
    today_close: number;
    percent_change: number;
}

interface RowData {
    symbol: string;
    tomorrow_price: number;
    today_close: number;
    percent_change: number;
}

const getPercentChange = (a: number, b: number): number => {
    return Math.round((b - a) / a * 10000) / 100
}

const Predict1D: React.FC = () => {
    const [data, setData] = useState<DataState | undefined>(undefined);
    const [symbolFilter, setSymbolFilter] = useState("");
    const [sort, setSort] = useState(Sort.BySignal);
    const [order, setOrder] = useState(Order.Descending);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Getting Data");
            const res = await fetch('https://signals-bck.storage.googleapis.com/predict1d.json');
            const json = await res.json();

            return json;
        }

        fetchData().then(data => {
            Object.keys(data).forEach((key) => {
                const item = (data[key] as PredictResult);
                item.percent_change = getPercentChange(item.today_close, item.tomorrow_price);
            });

            setData(data);
        }).catch(console.error);
    }, []);

    const clickToSort = (newSort: Sort): () => void => {
        return () => {
            if (newSort != sort) {
                setSort(newSort);
                setOrder(Order.Descending);
                return;
            }

            setOrder(order === Order.Descending ? Order.Ascending : Order.Descending);
        }
    };

    const filterFunction = (symbol: string) => {
        if (!data)
            return false


        if (symbolFilter != "") {
            const textSymbols = symbolFilter.toLocaleLowerCase().split(',');
            if (textSymbols
                .map(textSymbol => textSymbol != "" && symbol.toLocaleLowerCase().indexOf(textSymbol) >= 0)
                .indexOf(true) < 0
            ) {
                return false;
            }
        }

        if (data[symbol].percent_change > 10 || data[symbol].percent_change < -10)
            return false

        if (data[symbol].tomorrow_price < 0)
            return false

        return true;
    };



    const sortFunction = (order: Order): (a: string, b: string) => number => {
        const orderValue = order === Order.Ascending ? [-1, 1] : [1, -1];
        return (a: string, b: string) => {
            if (data == null || data == undefined) {
                return orderValue[0];
            }

            const itemA = data!![a];
            const itemB = data!![b];


            switch (sort) {
                default:
                case Sort.TodayClose:
                    return itemA.today_close < itemB.today_close ? orderValue[0] : orderValue[1];
                case Sort.TomorrowClose:
                    return itemA.tomorrow_price < itemB.tomorrow_price ? orderValue[0] : orderValue[1];
                case Sort.PercentChange:
                    return itemA.percent_change < itemB.percent_change ? orderValue[0] : orderValue[1];

            }
        }

    }

    return (
        <>
            <Header version={``} />
            <Container sx={{ mt: '2vh' }}>
                <Box display="flex" justifyContent="right">
                    <Box display="flex" flexGrow={1}>
                        <TextField fullWidth={true} id="outlined-basic" label="Search" placeholder='Multiple search with comma(,) separate' variant="outlined"
                            onChange={(event) => {
                                setSymbolFilter(event.target.value);
                            }} />
                    </Box>
                </Box>
            </Container>
            <Container sx={{ mt: '2vh' }}>
                <Box>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Symbols</TableCell>
                                    <TableCell align="right" onClick={clickToSort(Sort.TodayClose)}>
                                        <Box display="flex" justifyContent="right">
                                            {sort === Sort.TodayClose && (order === Order.Ascending ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                                            <Typography variant="subtitle2" fontWeight={sort === Sort.TodayClose ? 600 : 500}>
                                                Today Close
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" onClick={clickToSort(Sort.TomorrowClose)} >
                                        <Box display="flex" justifyContent="right">
                                            {sort === Sort.TomorrowClose && (order === Order.Ascending ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                                            <Typography variant="subtitle2" fontWeight={sort === Sort.TomorrowClose ? 600 : 500}>
                                                Predicted Tomorrow Close
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" onClick={clickToSort(Sort.PercentChange)} >
                                        <Box display="flex" justifyContent="right">
                                            {sort === Sort.PercentChange && (order === Order.Ascending ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                                            <Typography variant="subtitle2" fontWeight={sort === Sort.PercentChange ? 600 : 500}>
                                                % Percent Change
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data && Object.keys(data)
                                        .filter(filterFunction)
                                        .sort(sortFunction(order))
                                        .map((symbol) => {
                                            const d = data[symbol];
                                            return <Row key={symbol} symbol={symbol} {...d} />
                                        })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </>
    )
}

const Row: React.FC<RowData> = (props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    <Link href={`https://www.tradingview.com/chart/?symbol=SET%3A${props.symbol.slice(0, -3)}`} variant='body1' target="_blank">
                        {props.symbol}
                    </Link>
                </TableCell>
                <TableCell align="right">
                    <Typography variant='body1'>
                        {Math.round(props.today_close * 100) / 100}
                    </Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography variant='body1'>
                        {Math.round(props.tomorrow_price * 100) / 100}
                    </Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography variant='body1'>
                        {props.percent_change} %
                    </Typography>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default React.memo(Predict1D)