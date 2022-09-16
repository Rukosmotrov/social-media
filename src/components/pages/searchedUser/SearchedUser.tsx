import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {
    Box,
    Container,
    Grid,
} from "@mui/material";
import Posts from "../../postsSpace/Posts";
import UserInfo from "../../user/UserInfo";
import ShortUserInfo from "../../user/ShortUserInfo";
import {doc, getDoc} from "firebase/firestore";
import {useAuth} from "../../providers/useAuth";
import {IUserInfo} from "../../../interfaces";
import Navbar from "../../navbar/Navbar";
import Menu from "../../menu/Menu";
import SearchedUserInfo from "./SearchedUserInfo";
import SearchedUserShortInfo from "./SearchedUserShortInfo";
import SearchedUserPosts from "./searchedUserPostsSpace/SearchedUserPosts";

const SearchedUser:FC = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <Container>
            <Navbar openMenu={() => setMenuOpen(true)}/>
            <SearchedUserInfo/>
            <Grid container spacing={5} direction='row'>
                <Grid item md={5} xs={12}>
                    <Box className='leftSide'>
                        <SearchedUserShortInfo/>
                    </Box>
                </Grid>
                <Grid item md={7} xs={12}>
                    <SearchedUserPosts/>
                </Grid>
            </Grid>
            <Menu menuOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)}/>
        </Container>
    );
};

export default SearchedUser;