import React, {FC, useEffect, useState} from 'react';
import {Container, Typography, Card, Avatar, Grid} from "@mui/material";
import {useAuth} from "../../providers/useAuth";
import {IUserInfo} from "../../../interfaces";
import {doc, getDoc} from "firebase/firestore";
import Navbar from "../../navbar/Navbar";
import Menu from "../../menu/Menu";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import SubscribedUser from "../subscribers/SubscribedUser";
import FollowedUser from "./FollowedUser";

const Subscribes:FC = () => {
    const {db, user} = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [subscribes, setSubscribes] = useState<any>();
    const storage = getStorage();

    const getUserDataFromDoc = async () => {
        const docRef = doc(db, `${user?.email}`, "userData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setSubscribes(docSnap.data().data.subscribes);
            // const avatarRef = ref(storage, `${user?.email}/images/${docSnap.data().data.avatar}`);
            // getDownloadURL(avatarRef)
            //     .then((url) => {
            //         setAvatarUrl(url);
            //     });
            // const bgImgRef = ref(storage, `${user?.email}/images/${docSnap.data().data.bgImg}`);
            // getDownloadURL(bgImgRef)
            //     .then((url) => {
            //         setBgImgUrl(url);
            //     });
        } else {
            return console.log("No such document!");
        }
    }


    useEffect(() => {
        getUserDataFromDoc()
    }, []);
    return (
        <Container>
            <Navbar openMenu={() => setMenuOpen(true)}/>
            <Card sx={{p: 2, mb: 5}}>
                <Typography variant='h5'>
                    Підписки
                </Typography>
            </Card>
            {subscribes?.map((item: any) => {
                console.log(item)
                return(
                    <FollowedUser
                        dateOfReg={item.dateOfReg}
                        avatar={item.avatar}
                        firstName={item.firstName}
                        lastName={item.lastName}
                        email={item.email}
                        key={item.dateOfReg}
                    />
                )}
            )}

            <Menu menuOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)}/>
        </Container>
    );
};

export default Subscribes;