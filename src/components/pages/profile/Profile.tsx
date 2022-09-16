import React, {FC, useEffect, useRef, useState} from 'react';
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
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "../../loader/Loader";

const Profile:FC = () => {
    const {ga} = useAuth();
    const [user, loading, error] = useAuthState(ga);
    const [isMenuOpen, setMenuOpen] = useState(false);

    if (loading) {
        return <Loader/>
    } else {
        return (
            <Container>
                <Navbar openMenu={() => setMenuOpen(true)}/>
                <UserInfo/>
                <Grid container spacing={5} direction='row'>
                    <Grid item md={5} xs={12}>
                        <Box className='leftSide'>
                            <ShortUserInfo/>
                        </Box>
                    </Grid>
                    <Grid item md={7} xs={12}>
                        <Posts/>
                    </Grid>
                </Grid>
                <Menu menuOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)}/>
            </Container>
        );
    }
};

export default Profile;