import React, {FC, useEffect, useRef, useState} from 'react';
import {IPost, IPostListProps, IUserInfo} from "../../../../interfaces";
import {Grid, Typography} from "@mui/material";
import SearchedUserPost from "./SearchedUserPost";
import {useAuth} from "../../../providers/useAuth";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {doc, getDoc} from "firebase/firestore";

interface ISearchedPostListProps {
    posts: IPost[];
}



const SearchedUserPostList:FC<ISearchedPostListProps> = ({posts}) => {
    const {db} = useAuth();
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

    useEffect(() => {
        getCurrentUserFromDoc();
    }, []);

    return (
        <>
            {posts.length !== 0
                ?
                <Grid container spacing={5} direction="column">
                    {
                        posts.map((post: any) => {
                            return <SearchedUserPost
                                key={post.id}
                                id={post.id}
                                img={post.img}
                                alt='Post image'
                                description={post.description}
                                time={post.time}
                                author={post.author}
                                currentUser={currentUser}
                                likes={post.likes}
                            />
                        })
                    }
                </Grid>
                :
                <Typography variant='h5'>There is no posts</Typography>
            }
        </>
    );
};

export default SearchedUserPostList;