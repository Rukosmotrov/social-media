import React, {FC, useEffect, useState} from 'react';
import {
    Button,
    Card,
    Grid,
    Typography, CardActions, Avatar, Box,
    ButtonGroup
} from "@mui/material";
import {IUserInfo} from "../../../interfaces";
import {useAuth} from "../../providers/useAuth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import Loader from "../../loader/Loader";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {useNavigate} from "react-router-dom";

const SearchedUserInfo:FC = () => {
    const {user, db, ga} = useAuth();
    const [currentUser, setCurrentUser] = useState<any>();
    const [data, setData] = useState<IUserInfo>();
    const [signedUserData, setSignedUserData] = useState<any>();
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [searchedUserAvatarUrl, setSearchedUserAvatarUrl] = useState<any>();
    const [searchedUserBgImgUrl, setSearchedUserBgImgUrl] = useState<any>();
    const [signedSubs, setSignedSubs] = useState<any>([]);
    const [currentSubs, setCurrentSubs] = useState<any>([]);
    const [canUpload, setCanUpload] = useState<boolean>(false);
    const [infoDone, setInfoDone] = useState<boolean>(false);
    const storage = getStorage();
    const navigate = useNavigate();

    const getCurrentUserFromDoc = async () => {
        const docRef = doc(db, "usersList", "currentUser");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCurrentUser(docSnap.data().currentUser);
        } else {
            return console.log("No such document!");
        }
    }

    const getUserDataFromDoc = async () => {
        const docRef = doc(db, `${currentUser?.email}`, "userData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setData(docSnap.data().data);
            setInfoDone(true);
            setCurrentSubs(docSnap.data().data.subscribers)
            const searchedUserAvatarRef = ref(storage, `${currentUser?.email}/images/${docSnap.data().data.avatar}`);
            getDownloadURL(searchedUserAvatarRef)
                .then((url) => {
                    setSearchedUserAvatarUrl(url);
                });
            const searchedUserBgImgRef = ref(storage, `${currentUser?.email}/images/${docSnap.data().data.bgImg}`);
            getDownloadURL(searchedUserBgImgRef)
                .then((url) => {
                    setSearchedUserBgImgUrl(url);
                });
        } else {
            return console.log("No such document!");
        }
    }

    const getSignedUserDataFromDoc = async () => {
        const currentDocRef = doc(db, "usersList", "currentUser");
        const currentDocSnap = await getDoc(currentDocRef);
        const docRef = doc(db, `${user?.email}`, "userData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setSignedUserData(docSnap.data().data);
            setSignedSubs(docSnap.data().data.subscribes);
            docSnap.data().data.subscribes.map((item: any) => {
                if (item.email === currentDocSnap.data()?.currentUser.email){
                    setIsSubscribed(true);
                }
            })
        } else {
            return console.log("No such document!");
        }
    }

    const subscribe = async () => {
        const docRef = doc(db, "usersList", "currentUser");
        const docSnap = await getDoc(docRef);
        const currentDocRef = doc(db, `${docSnap.data()?.currentUser.email}`, "userData");
        const currentDocSnap = await getDoc(currentDocRef);
        const signedDocRef = doc(db, `${user?.email}`, "userData");
        const signedDocSnap = await getDoc(signedDocRef);
        await updateDoc(signedDocRef, {
            data: {...signedDocSnap.data()?.data,
                subscribes: [...signedDocSnap.data()?.data.subscribes, currentDocSnap.data()?.data]}
        });
        await updateDoc(currentDocRef, {
            data: {...currentDocSnap.data()?.data,
                subscribers: [...currentDocSnap.data()?.data.subscribers, signedDocSnap.data()?.data]}
        });
        setIsSubscribed(true);
    }

    const unSubscribe = async () => {
        const docRef = doc(db, "usersList", "currentUser");
        const docSnap = await getDoc(docRef);
        const currentDocRef = doc(db, `${docSnap.data()?.currentUser.email}`, "userData");
        const currentDocSnap = await getDoc(currentDocRef);
        const signedDocRef = doc(db, `${user?.email}`, "userData");
        const signedDocSnap = await getDoc(signedDocRef);
        if (docSnap.exists()) {
            setCurrentSubs( (prev: any) => prev.filter((item: any) => item.email !== signedDocSnap.data()?.data.email));
            setSignedSubs((prev: any) => prev.filter((item: any) => item.email !== currentDocSnap.data()?.data.email));
            updateDoc(signedDocRef, {
                data: {
                    ...signedDocSnap.data()?.data,
                    subscribes: signedDocSnap.data()?.data.subscribes.filter((item: any) => item.email !== currentDocSnap.data()?.data.email)
                }
            });
            updateDoc(currentDocRef, {
                data: {
                    ...currentDocSnap.data()?.data,
                    subscribers: currentDocSnap.data()?.data.subscribers.filter((item: any) => item.email !== signedDocSnap.data()?.data.email)
                }
            });
            setCanUpload(true);
            setIsSubscribed(false);
        } else {
            return console.log("No such document!");
        }
    }

    const setChat = async () => {
        const docRef = doc(db, "usersList", "currentUser");
        const docSnap = await getDoc(docRef);
        const signedUserMessagesRef = doc(db, `${user?.email}`, "messages");
        const signedUserMessagesSnap = await getDoc(signedUserMessagesRef);
        const currentUserMessagesRef = doc(db, `${docSnap.data()?.currentUser.email}`, "messages");
        const currentUserMessagesSnap = await getDoc(currentUserMessagesRef);
        const currentDocRef = doc(db, `${docSnap.data()?.currentUser.email}`, "userData");
        const currentDocSnap = await getDoc(currentDocRef);
        const signedDocRef = doc(db, `${user?.email}`, "userData");
        const signedDocSnap = await getDoc(signedDocRef);

        if (signedUserMessagesSnap.data()?.messages.indexOf(docSnap.data()?.currentUser.email) == -1) {
            await updateDoc(signedUserMessagesRef, {
                messages: [docSnap.data()?.currentUser.email, ...signedUserMessagesSnap.data()?.messages]
            });
        }
        if (currentUserMessagesSnap.data()?.messages.indexOf(user?.email) == -1) {
            await updateDoc(currentUserMessagesRef, {
                messages: [user?.email, ...currentUserMessagesSnap.data()?.messages]
            });
        }
    }

    useEffect(() => {
        getCurrentUserFromDoc()
            .then(getSignedUserDataFromDoc);
    }, []);

    useEffect(() => {
        getUserDataFromDoc();
    }, [currentUser]);

    if (infoDone) {
        return (
            <Grid container spacing={5} direction='row'>
                <Grid item xs={12}>
                    <div className='user-header' style={{backgroundImage: `url(${searchedUserBgImgUrl ? searchedUserBgImgUrl : '/'+data?.bgImg})`}}>
                        <Avatar alt='User' src={searchedUserAvatarUrl} sx={{
                            position: 'relative',
                            width: '150px',
                            height: '150px',
                            border: '5px solid #eaebed',
                        }}/>
                    </div>
                    <Card className='user-header-bottom'>
                        <Typography variant={'h5'}>{`${data?.firstName} ${data?.lastName}`}</Typography>
                        <Typography>{data?.isInNetwork}</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row'}} >
                            <Button
                                sx={{width:'150px'}}
                                onClick={() => navigate(`/subscribers${data?.dateOfReg}`)}
                            >
                                {`Підписники: ${data?.subscribers.length}`}
                            </Button>
                            <Button
                                sx={{width:'150px'}}
                                onClick={() => navigate(`/subscribes${data?.dateOfReg}`)}
                            >
                                {`Підписки: ${data?.subscribes.length}`}
                            </Button>
                        </Box>
                        <CardActions>
                            <ButtonGroup>
                                <Button variant={isSubscribed ? 'outlined' : 'contained'}
                                        onClick={isSubscribed ? unSubscribe : subscribe}
                                        sx={{width:'150px'}}
                                >{isSubscribed ? 'Відслідковується' : 'Підписатись'}
                                </Button>
                                <Button
                                    variant='contained'
                                    sx={{width:'150px'}}
                                    onClick={() => {
                                        setChat().then(() => navigate('/messages'));
                                    }}
                                >Повідомлення</Button>
                            </ButtonGroup>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        );
    } else {
        return (
            <Loader/>
        )
    }

    // if (infoDone) {
    //     return (
    //         <Grid container spacing={5} direction='row'>
    //             <Grid item xs={12}>
    //                 <div className='user-header' style={{backgroundImage: `url(${searchedUserBgImgUrl ? searchedUserBgImgUrl : '/'+data?.bgImg})`}}>
    //                     <Avatar alt='User' src={searchedUserAvatarUrl} sx={{
    //                         position: 'relative',
    //                         width: '150px',
    //                         height: '150px',
    //                         border: '5px solid #eaebed',
    //                     }}/>
    //                 </div>
    //                 <Card className='user-header-bottom'>
    //                     {/*<Typography variant={'h5'}>{`${data?.firstName} ${data?.lastName}`} <small>{data?.isInNetwork}</small></Typography>*/}
    //                     {/*<Typography>{data?.isInNetwork && data?.isInNetwork}</Typography>*/}
    //                     <Box sx={{display: 'flex', flexDirection: 'row'}} >
    //                         <Button
    //                             sx={{width:'150px'}}
    //                             onClick={() => navigate(`/subscribers${data?.dateOfReg}`)}
    //                         >
    //                             {`Підписники: ${data?.subscribers.length}`}
    //                         </Button>
    //                         <Button
    //                             sx={{width:'150px'}}
    //                             onClick={() => navigate(`/subscribes${data?.dateOfReg}`)}
    //                         >
    //                             {`Підписки: ${data?.subscribes.length}`}
    //                         </Button>
    //                     </Box>
    //                     <CardActions>
    //                         <Button variant={isSubscribed ? 'outlined' : 'contained'}
    //                                 onClick={isSubscribed ? unSubscribe : subscribe}
    //                                 sx={{width:'150px', m:'0 20px'}}
    //                         >{isSubscribed ? 'Відстежується' : 'Стежити'}
    //                         </Button>
    //                         {isSubscribed &&
    //                         <Button
    //                             variant='contained'
    //                             sx={{width:'150px', m:'0 20px'}}
    //                             onClick={() => setChat().then(() => {navigate('/messages')})}
    //                         >Повідомлення</Button>
    //                         }
    //                     </CardActions>
    //                 </Card>
    //             </Grid>
    //         </Grid>
    //     );
    // } else {
    //     return (
    //         <Loader/>
    //     )
    // }
};

export default SearchedUserInfo;