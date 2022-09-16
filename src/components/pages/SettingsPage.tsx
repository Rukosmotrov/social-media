import React, {FC, useEffect, useState} from 'react';
import {
    Accordion,
    Button,
    Container,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    AccordionSummary,
    AccordionDetails,
    Card,
    Box,
    Grid, Avatar, TextField,
    Snackbar,
    Alert
} from "@mui/material";
import ImageUploader from "../utils/ImageUploader";
import {generalUserData} from '../data/generalUserData';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useAuth} from "../providers/useAuth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {IUserInfo} from "../../interfaces";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ImageIcon from '@mui/icons-material/Image';
import Navbar from "../navbar/Navbar";
import Menu from "../menu/Menu";
import {getStorage, ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";
import Loader from "../loader/Loader";
import classes from '../styles/settingsPage.module.scss';

const SettingsPage:FC = () => {
    const {user, db} = useAuth();
    const [isAvatarChanging, setAvatarChanging] = useState(false);
    const [isBgChanging, setBgChanging] = useState(false);
    const [data, setData] = useState<IUserInfo>();
    const [users, setUsers] = useState<any>([]);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [newUserInfo, setNewUserInfo] = useState<any>(data);
    const [isSettingsDone, setIsSettingsDone] = useState<boolean>(false);
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
        const usersNamesRef = doc(db, "usersList", "users");
        const docSnap = await getDoc(usersNamesRef);
        if (docSnap.exists()) {
            setUsers(docSnap.data().list);
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getUserDataFromDoc();
        getUsersFromDoc();
        //setPosts(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateUser = () => {
        return setUsers((prev: any) => prev.map((item: any) =>
            item.dateOfReg === data?.dateOfReg && prev.splice(users.indexOf(item), 1)));
    };

    const changeAvatar = async (newAvatar:string | undefined) => {
        setNewUserInfo({...newUserInfo, avatar: newAvatar});
    }

    const changeBgImg = async (newBgImg:string | undefined) => {
        setNewUserInfo({...newUserInfo, bgImg: newBgImg});
    }

    const updateUserData = async () => {
        updateUser();
        const postDocRef = doc(db, `${user?.email}`, "userData");
        await updateDoc(postDocRef, {
            data: {...data, ...newUserInfo}
        });
        const usersNamesRef = doc(db, "usersList", "users");
        await updateDoc(usersNamesRef, {
            list: [...users, {
                email: newUserInfo.email ? newUserInfo.email : data?.email,
                firstName: newUserInfo.firstName ? newUserInfo.firstName : data?.firstName,
                lastName: newUserInfo.lastName ? newUserInfo.lastName : data?.lastName,
                avatar: newUserInfo.avatar ? newUserInfo.avatar : data?.avatar,
                dateOfReg: data?.dateOfReg,
                name: `${newUserInfo.firstName ?
                    newUserInfo.firstName : data?.firstName} ${newUserInfo.lastName ? newUserInfo.lastName :
                    data?.lastName}`
            }]
        });
        setIsSettingsDone(true);
    }

    return (
        <Container sx={{p:5}}>
            <Navbar openMenu={() => setMenuOpen(true)}/>
            <Card sx={{p:2}} className={classes.settings}>
                <Grid container direction='column' spacing={2}>
                    <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {data
                            ?
                            <Avatar alt='User' src={avatarUrl} sx={{
                                position: 'relative',
                                width: '150px',
                                height: '150px',
                                border: '5px solid #eaebed',
                                mb:2
                            }}/>
                            :
                            <Loader/>
                        }
                    </Grid>
                    <Divider/>
                    <Grid item sx={{display:'flex', justifyContent:'space-between', mr:2}}>
                        <Button
                            onClick={() => setAvatarChanging(true)}>
                            <ListItemText primary={'Змінити аватар'}/>
                            <ListItemIcon>
                                <AccountCircleIcon/>
                            </ListItemIcon>
                        </Button>
                        <Button
                            onClick={() => setNewUserInfo( {...newUserInfo, avatar: ''})}
                        >Встановити стандартний аватар</Button>
                    </Grid>
                    <Divider/>
                    <ImageUploader
                        isOpen={isAvatarChanging}
                        closeModal={() => setAvatarChanging(false)}
                        changer={changeAvatar}
                    />
                    <Grid item sx={{display:'flex', justifyContent:'space-between', mr:2}}>
                        <Button
                            onClick={() => setBgChanging(true)}>
                            <ListItemText primary={'Змінити обкладинку профілю'}/>
                            <ListItemIcon>
                                <ImageIcon/>
                            </ListItemIcon>
                        </Button>
                        <Button
                            onClick={() => setNewUserInfo( {...newUserInfo, bgImg: 'light_faded_background_85547_1920x1080.jpg'})}
                        >Встановити стандартну обкладинку</Button>
                    </Grid>
                    <Divider/>
                    <ImageUploader
                        isOpen={isBgChanging}
                        closeModal={() => setBgChanging(false)}
                        changer={changeBgImg}
                    />
                </Grid>
                <br/>
                <Grid container spacing={5} className={classes.settingsText}>
                    <Grid container direction="row" item spacing={5} xs={12}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                type='text'
                                label="Ім'я"
                                variant='outlined'
                                value={newUserInfo?.firstName}
                                onChange={e => setNewUserInfo( {...newUserInfo, firstName: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                type='text'
                                label='Прізвище'
                                variant='outlined'
                                value={newUserInfo?.lastName}
                                onChange={e => setNewUserInfo( {...newUserInfo, lastName: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <label>Дата народження</label><br/>
                            <TextField
                                type='date'
                                variant='outlined'
                                value={newUserInfo?.birthDate}
                                onChange={e => setNewUserInfo( {...newUserInfo, birthDate: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" spacing={5} xs={12}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                type='text'
                                label='Країна народження'
                                variant='outlined'
                                value={newUserInfo?.countryOfBirth}
                                onChange={e => setNewUserInfo( {...newUserInfo, countryOfBirth: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                type='text'
                                label='Країна проживання'
                                variant='outlined'
                                value={newUserInfo?.countryOfResidence}
                                onChange={e => setNewUserInfo( {...newUserInfo, countryOfResidence: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                type='text'
                                label='Місто'
                                variant='outlined'
                                value={newUserInfo?.cityOfResidence}
                                onChange={e => setNewUserInfo( {...newUserInfo, cityOfResidence: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <br/>
                <Divider/>
                <br/>
                <Button variant='contained' onClick={updateUserData}>Зберегти</Button>
            </Card>
            <Snackbar
                autoHideDuration={4000}
                anchorOrigin={{vertical:'bottom', horizontal:'right'}}
                open={isSettingsDone}
                onClose={() => setIsSettingsDone(false)}
                key={'bottom' + 'right'}
            >
                <Alert severity="success">Налаштування збережені</Alert>
            </Snackbar>
            <Menu menuOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)}/>
        </Container>
    );
};

export default SettingsPage;