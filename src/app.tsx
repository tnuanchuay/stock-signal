import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignalsPage from './pages/signals';
import Predict1D from './pages/predict1d';



const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


const router = createBrowserRouter([
    { path: "/", element: <SignalsPage /> },
    { path: "/signals", element: <SignalsPage /> },
    { path: "/predict1d", element: <Predict1D /> }
])

export const App = (
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
    </ThemeProvider>
)