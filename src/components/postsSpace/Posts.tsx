import React, {FC, useState, useEffect} from 'react';
import {Box, Card, CardHeader, IconButton} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {IPost} from "../../interfaces";
import PostList from "./PostList";
import CreatePost from "../postsSpace/CreatePost";
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useAuth} from "../providers/useAuth";

const Posts:FC = () => {
    const [isPostCreating, setPostCreating] = useState(false);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [canUpload, setCanUpload] = useState(false);
    const {db, user} = useAuth();

    const getPostsFromDoc = async () => {
        const docRef = doc(db, `${user?.email}`, "posts");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setPosts(docSnap.data().posts);
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getPostsFromDoc();
        setCanUpload(true);
    }, []);

    const addPost = (newPost: IPost) => {
        setPosts([newPost, ...posts]);
    }

    const removePost = (id: number) => {
        setPosts(prev => prev.filter(item => item.id !== id));
    }

    const addPostToDoc = async () => {
        const postDocRef = doc(db, `${user?.email}`, "posts");
        await updateDoc(postDocRef, {
            posts: posts
        });
    }

    useEffect( () => {
        if (canUpload) {
            addPostToDoc();
        }
    }, [posts]);

    return (
        <Box sx={{top:'5rem'}}>
            <Card sx={{mt:5, mb:5}}>
                <CardHeader
                    title={'Публікації'}
                />
            </Card>
            <Card sx={{mt:5, mb:5}}>
                <CardHeader
                    title={'Створити допис'}
                    action={
                        <IconButton aria-label='create post' onClick={() => setPostCreating(true)}>
                            <AddIcon/>
                        </IconButton>
                    }
                />
            </Card>
            <PostList posts={posts} onRemove={removePost}/>
            <Box sx={{mt:5}}></Box>
            <CreatePost
                postCreating={isPostCreating}
                setPostCreating={setPostCreating}
                endCreating={() => setPostCreating(false)}
                addPost={addPost}
                posts={posts}
            />
        </Box>
    );
};

export default Posts;