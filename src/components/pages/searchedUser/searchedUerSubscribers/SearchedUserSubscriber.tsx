import React, {FC, useEffect, useState} from 'react';
import {Avatar, Card, Grid, Typography} from "@mui/material";
import {useAuth} from "../../../providers/useAuth";
import {IUserInfo} from "../../../../interfaces";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useNavigate} from "react-router-dom";

interface ISubscriber {
    dateOfReg: string;
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
}

const SearchedUserSubscriber:FC<ISubscriber> = ({dateOfReg, avatar, firstName, lastName, email}) => {
    const {db} = useAuth();
    const [avatarUrl, setAvatarUrl] = useState<any>();
    const [currentUser, setCurrentUser] = useState<any>({});
    const storage = getStorage();
    const navigate = useNavigate();

    const getCurrentUserDataFromDoc = async () => {
        const docRef = doc(db, `${email}`, "userData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCurrentUser(docSnap.data().data);
            const avatarRef = ref(storage, `${email}/images/${avatar}`);
            await getDownloadURL(avatarRef)
                .then((url) => {
                    setAvatarUrl(url);
                });
        } else {
            return console.log("No such document!");
        }
    }

    const updateCurrentUser = async () => {
        const docRef = doc(db, "usersList", "currentUser");
        await updateDoc(docRef, {
            currentUser: currentUser
        });
    }

    useEffect(() => {
        getCurrentUserDataFromDoc();
    }, []);
    return (
        <Card sx={{mb:5}} onClick={() => {
            updateCurrentUser();
            navigate(`/user/${dateOfReg}`);
        }}>
            <Grid container direction='row'>
                <Grid item sx={{p:1}}>
                    <Avatar alt='User' src={avatarUrl} sx={{
                        position: 'relative',
                        width: '50px',
                        height: '50px',
                        border: '5px solid #eaebed',
                    }}/>
                </Grid>
                <Grid item sx={{p:1}}>
                    <Typography variant='h6'>{firstName} {lastName}</Typography>
                </Grid>
            </Grid>
        </Card>
    );
};

export default SearchedUserSubscriber;