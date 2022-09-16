import React, {FC, useState, useEffect} from 'react';
import {Avatar, Button, Card} from "@mui/material";
import classes from "./navbar.module.scss";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {useAuth} from "../providers/useAuth";
import {useNavigate} from "react-router-dom";

interface ISearchedUserCard {
    email: string;
    dateOfReg: string;
    name: string;
    avatar: string;
    data: any;
    item: any;
}

const SearchedUserCard:FC<ISearchedUserCard> = ({email, name, data, dateOfReg, item, avatar}) => {
    const {db} = useAuth();
    const storage = getStorage();
    const [currentUser, setCurrentUser] = useState<any>({});
    const [searchedUserAvatarUrl, setSearchedUserAvatarUrl] = useState<any>();
    const navigate = useNavigate();

    const getAvatar = () => {
        const avatarRef = ref(storage, `${email}/images/${avatar}`);
        getDownloadURL(avatarRef)
            .then((url) => {
                setSearchedUserAvatarUrl(url);
            });
    }

    useEffect(() => {
        getAvatar();
    }, []);

    const updateCurrentUser = async () => {
        const docRef = doc(db, "usersList", "currentUser");
        await updateDoc(docRef, {
            currentUser: currentUser
        });
    }

    // useEffect(() => {
    //     getAvatar();
    // }, [searchedUserAvatarUrl]);

    return (
        <Button onMouseDown={(e) => {
            e.preventDefault();
            if (dateOfReg === data.dateOfReg) {
                navigate('/home');
            } else {
                setCurrentUser(item);
                if (currentUser === item) {
                    updateCurrentUser();
                    navigate(`/user${dateOfReg}`);
                }
            }
        }}>
            <Card className={classes.searchedUser} id={dateOfReg}>
                <Avatar src={searchedUserAvatarUrl}/>{name}
            </Card>
        </Button>
    );
};

export default SearchedUserCard;