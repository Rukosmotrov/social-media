import React, {FC, useContext, useEffect, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Avatar,
    Card, Button
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import classes from './navbar.module.scss';
import {INavbar, IUserInfo} from "../../interfaces";
import {useAuth} from "../providers/useAuth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import SearchedUserCard from "./SearchedUserCard";

const Navbar:FC<INavbar> = ({openMenu}) => {
    const [searchActive, setSearchActive] = useState<boolean>(false);
    const {user, db} = useAuth();
    const [data, setData] = useState<IUserInfo>();
    const [users, setUsers] = useState<any>([]);
    const [usersList, setUsersList] = useState<any>(users);
    const [searchTerm, setSearchTerm] = useState<any>();
    const [searchedUserAvatarUrl, setSearchedUserAvatarUrl] = useState<any>();
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState<any>();
    const storage = getStorage();

    const getUserDataFromDoc = async () => {
        const docRef = doc(db, `${user?.email}`, "userData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setData(docSnap.data().data);
            const avatarRef = ref(storage, `${user?.email}/images/${docSnap.data().data.avatar}`);
            getDownloadURL(avatarRef)
                .then((url) => {
                    setAvatarUrl(url);
                });
        } else {
            return console.log("No such document!");
        }
    }

    const getUsersFromDoc = async () => {
        const docRef = doc(db, "usersList", "users");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setUsers(docSnap.data().list);
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getUserDataFromDoc()
            .then(getUsersFromDoc)
    }, []);



    const filterUsers = (searchText: any, listOfUsers: any) => {
        if (searchText == '') {
            return listOfUsers;
        }
        return listOfUsers.filter(({name}:any) =>
            name.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            const filteredUsers = filterUsers(searchTerm, users);
            setUsersList(filteredUsers);
        }, 300);
        setUsersList(users);
        return () => clearTimeout(debounce)
    }, [searchTerm]);

    return (
        user
            ?
            <AppBar className={classes.navbar}>
                <Toolbar sx={{display:'flex', justifyContent:'space-between'}}>
                    <Box>
                        <IconButton
                            size="medium"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={openMenu}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <IconButton
                            color="inherit"
                            onClick={() => navigate('/home')}
                            className={classes.logo}
                        >
                            {'yikes!'}
                        </IconButton>
                    </Box>
                    <Box className={classes.wrapper}>
                        {!searchActive && <SearchIcon/>}
                        <input
                            type="text"
                            placeholder='Пошук'
                            value={searchTerm}
                            onFocus={(e) => {
                                setSearchActive(true)
                                setSearchTerm(e.target.value)
                            }
                            }
                            onBlur={() => setSearchActive(false)}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchActive &&
                        <Box className={classes.searchField}>
                            {usersList.map((item: any) => {
                                return (
                                    <SearchedUserCard
                                        email={item.email}
                                        dateOfReg={item.dateOfReg}
                                        data={data}
                                        name={item.name}
                                        item={item}
                                        avatar={item.avatar}
                                    />
                                )
                            })}
                        </Box>
                        }
                    </Box>
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <Avatar alt='User avatar' src={avatarUrl}/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            :
            <AppBar className={classes.navbar}>
                <Toolbar sx={{display:'flex', justifyContent:'space-between'}}>
                    <IconButton
                        size="medium"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        {'yikes!'}
                    </IconButton>
                </Toolbar>
            </AppBar>
    );
};

export default Navbar;