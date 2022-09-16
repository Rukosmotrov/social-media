import React, {FC, MutableRefObject, useRef, useState, useEffect, createContext} from 'react';
import {
    Box, Container
} from "@mui/material";
import './style.scss'
import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";
import {BrowserRouter} from "react-router-dom"
import Routers from "./components/router/Routers";


const Main:FC = () => {

    return (
        <BrowserRouter>
            <Box className='main'>
                <Container>
                    <Routers/>
                </Container>
            </Box>
        </BrowserRouter>
    );
};

export default Main;