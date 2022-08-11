import { createTheme, ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from '@mui/material'
import React from 'react';
import { ToastContainer } from 'react-toastify'
import AppRouter from '../routes/Router'
import NavBar from './NavBar'

function AppContainer(props) {
    const theme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#541554',
            },
            secondary: {    
                main: '#ECB22E',
            },
        }
    }
    )
    return (
        <ThemeProvider theme={theme}>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
            />
            <CssBaseline />
            <NavBar />
            <AppRouter />
        </ThemeProvider >
    );
}

export default AppContainer;