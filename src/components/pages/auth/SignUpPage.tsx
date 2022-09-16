import React, {FC, SyntheticEvent, useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, ButtonGroup, Grid, Modal, TextField} from "@mui/material";
import {IUserData, IUserInfo} from "../../../interfaces";
import classes from '../../styles/authPage.module.scss'
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../providers/useAuth";
import {createUserWithEmailAndPassword, getAuth, sendEmailVerification} from 'firebase/auth';
import {setDoc, doc, getDoc, updateDoc, addDoc, collection} from 'firebase/firestore';
import Navbar from "../../navbar/Navbar";
import {getDownloadURL, getStorage, ref, uploadBytesResumable, getMetadata} from "firebase/storage";

const SignUpPage:FC = () => {
    const navigate = useNavigate();
    const {user, ga, db} = useAuth();
    const storage = getStorage();
    const [isRegError, setRegError] = useState(false);
    const regError = useRef('');
    const [userData, setUserData] = useState<IUserData>({email:'', password:''} as IUserData);
    const [userInfo, setUserInfo] = useState<IUserInfo>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        countryOfBirth: '',
        countryOfResidence: '',
        cityOfResidence: '',
        avatar: '',
        bgImg: '',
        dateOfReg: `${Date.now()}`,
        subscribes: [],
        subscribers: [],
        isInNetwork: ''
    });
    const [userNamesFromDoc, setUserNamesFromDoc] = useState<any>([]);
    const [userNamesToDoc, setUserNamesToDoc] = useState<any>({
        email: '',
        firstName: '',
        lastName: '',
        avatar: '',
        name: '',
        dateOfReg: ''
    });
    const [infoDone, setInfoDone] = useState<boolean>(false);

    const getUsers = async () => {
        const usersNamesRef = doc(db, "usersList", "users");
        const docSnapUsers = await getDoc(usersNamesRef);
        if (docSnapUsers.exists()) {
            setUserNamesFromDoc(docSnapUsers.data().list);
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getUsers();
        setUserNamesToDoc([...userNamesFromDoc, {
            email: userData.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            avatar: '',
            name: `${userInfo.firstName} ${userInfo.lastName}`,
            dateOfReg: userInfo.dateOfReg
        }]);
    }, [userInfo]);

    const handleSignUp = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(ga, userData.email, userData.password);
            await setDoc(doc(db, userData.email, "posts"), {
                posts: []
            });
            await setDoc(doc(db, userData.email, "messages"), {
                messages: []
            });
            await setDoc(doc(db, userData.email, "userData"), {
                data: {
                    email: userData.email,
                    password: userData.password,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    birthDate: userInfo.birthDate,
                    countryOfBirth: userInfo.countryOfBirth,
                    countryOfResidence: userInfo.countryOfResidence,
                    cityOfResidence: userInfo.cityOfResidence,
                    avatar: '',
                    bgImg: 'light_faded_background_85547_1920x1080.jpg',
                    dateOfReg: userInfo.dateOfReg,
                    subscribes: [],
                    subscribers: [],
                    isInNetwork: 'online'
                }
            })

            const usersNamesRef = doc(db, "usersList", "users");
            await updateDoc(usersNamesRef, {
                list: userNamesToDoc
            });
        } catch (error:any) {
            error.message && console.log(error.message);
            setRegError(true);
            setTimeout(() => setRegError(true), 1500);
            regError.current = error.message;
        }
        window.location.reload();
        navigate('/home');
    }

    return (
        <>
            <Navbar/>
            {isRegError && <Alert severity="error" sx={{m:'1rem 0'}}>{regError.current}</Alert>}
            <Box className={classes.authBox}>
                <form onSubmit={handleSignUp} className={classes.authForm}>
                    <Grid container spacing={5}>
                        <Grid container direction="column" item spacing={5} xs={6}>
                            <Grid item xs={3}>
                                <TextField
                                    type='email'
                                    label='Email'
                                    variant='outlined'
                                    value={userData.email}
                                    onChange={e => setUserData( {...userData, email: e.target.value})}
                                    required
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type='password'
                                    label='Пароль'
                                    variant='outlined'
                                    value={userData.password}
                                    onChange={e => setUserData( {...userData, password: e.target.value})}
                                    required
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type='text'
                                    label="Ім'я"
                                    variant='outlined'
                                    value={userInfo.firstName}
                                    onChange={e => {setUserInfo({...userInfo, firstName: e.target.value})}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type='text'
                                    label='Прізвище'
                                    variant='outlined'
                                    value={userInfo.lastName}
                                    onChange={e => {setUserInfo({...userInfo, lastName: e.target.value})}}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Grid container item direction="column" spacing={5} xs={6}>
                            <Grid item xs={3}>
                                <TextField
                                    type='date'
                                    variant='outlined'
                                    value={userInfo.birthDate}
                                    onChange={e => {setUserInfo({...userInfo, birthDate: e.target.value})}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type='text'
                                    label='Країна народження'
                                    variant='outlined'
                                    value={userInfo.countryOfBirth}
                                    onChange={e => {setUserInfo({...userInfo, countryOfBirth: e.target.value})}}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type='text'
                                    label='Країна проживання'
                                    variant='outlined'
                                    value={userInfo.countryOfResidence}
                                    onChange={e => {setUserInfo({...userInfo, countryOfResidence: e.target.value})}}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type='text'
                                    label='Місто'
                                    variant='outlined'
                                    value={userInfo.cityOfResidence}
                                    onChange={e => {setUserInfo({...userInfo, cityOfResidence: e.target.value})}}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <ButtonGroup variant='text' sx={{display:'flex', justifyContent:'space-between', mt:5}}>
                        <Button type='submit' variant='contained'>Зареєструватись</Button>
                        <Button onClick={() => navigate('/sign-in')}>Вхід</Button>
                    </ButtonGroup>
                </form>
            </Box>
        </>
    );
};

export default SignUpPage;