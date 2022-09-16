import React, {FC, useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardMedia,
    Divider,
    Grid,
    CardHeader,
    CardContent,
    Typography, CardActions, ListItem, List, ListItemIcon, ListItemText, Avatar,
    Box
} from "@mui/material";
import {IUserInfo} from "../../interfaces";
import {useAuth} from "../providers/useAuth";
import {doc, getDoc} from "firebase/firestore";
import Loader from "../loader/Loader";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {Link, useNavigate} from "react-router-dom";

const UserInfo:FC = () => {
    const {user, db, ga} = useAuth();
    const [data, setData] = useState<IUserInfo>();
    const [avatarUrl, setAvatarUrl] = useState<any>();
    const [bgImgUrl, setBgImgUrl] = useState<any>();
    const [infoDone, setInfoDone] = useState<boolean>(false);
    const storage = getStorage();
    const navigate = useNavigate();

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
            const bgImgRef = ref(storage, `${user?.email}/images/${docSnap.data().data.bgImg}`);
            getDownloadURL(bgImgRef)
                .then((url) => {
                    setBgImgUrl(url);
                });
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getUserDataFromDoc()
            .then(() => setInfoDone(true));
    }, []);

    if (infoDone) {
        return(
            <Grid container spacing={5} direction='row'>
                <Grid item xs={12}>
                    <div className='user-header' style={{backgroundImage: `url(${bgImgUrl ? bgImgUrl : '/'+data?.bgImg})`}}>
                        <Avatar alt='User' src={avatarUrl} sx={{
                            position: 'relative',
                            width: '150px',
                            height: '150px',
                            border: '5px solid #eaebed',
                        }}/>
                    </div>
                    <Card className='user-header-bottom'>
                        <Typography variant={'h5'}>{`${data?.firstName} ${data?.lastName}`}</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <Typography variant={'h6'} sx={{width:'150px', m:'0 20px'}}>
                                <Button onClick={() => navigate('/subscribers')}>
                                    {`Підписники: ${data?.subscribers.length}`}
                                </Button>
                            </Typography>
                            <Typography variant={'h6'} sx={{width:'150px', m:'0 20px'}}>
                                <Button variant='text' onClick={() => navigate('/subscribes')}>
                                    {`Підписки: ${data?.subscribes.length}`}
                                </Button>
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        )
    } else {
        return(
            <Loader/>
        )
    }
};

export default UserInfo;