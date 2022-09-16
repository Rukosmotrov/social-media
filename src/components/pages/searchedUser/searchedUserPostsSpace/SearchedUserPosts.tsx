import React, {FC, useState, useEffect, useContext} from 'react';
import {Box, Card, CardHeader, IconButton} from "@mui/material";
import SearcheduserPostList from "./SearchedUserPostList";
import AddIcon from '@mui/icons-material/Add';
import {IPost, IUserInfo} from "../../../../interfaces";
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useAuth} from "../../../providers/useAuth";

const SearchedUserPosts:FC = () => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const {db, user} = useAuth();
    const [currentUser, setCurrentUser] = useState<any>();

    const getCurrentUserFromDoc = async () => {
        const docRef = doc(db, "usersList", "currentUser");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
        } else {
            return console.log("No such document!");
        }
    }

    const getPostsFromDoc = async () => {
        const docRef = doc(db, `${currentUser?.currentUser.email}`, "posts");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setPosts(docSnap.data().posts);
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getCurrentUserFromDoc();
    }, []);

    useEffect(() => {
        getPostsFromDoc();
    }, [currentUser]);

    return (
        <Box sx={{top:'5rem'}}>
            <Card sx={{mt:5, mb:5}}>
                <CardHeader
                    title={'Публікації'}
                />
            </Card>
            <SearcheduserPostList posts={posts}/>
            <Box sx={{mt:5}}></Box>
        </Box>
    );
};

export default SearchedUserPosts;