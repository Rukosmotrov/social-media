import React, {FC, useEffect, useState} from 'react';
import {
    Avatar,
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    Divider,
    Grid,
    IconButton, Link, Tooltip,
    Typography
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from '@mui/icons-material/Close';
import {IPost, IUserInfo} from "../../interfaces";
import {useAuth} from "../providers/useAuth";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";

const Post:FC<IPost> = ({
                            img,
                            alt,
                            description,
                            remove,
                            id,
                            time,
                            author,
                            likes
}) => {
    const {user, db} = useAuth();
    const [data, setData] = useState<IUserInfo>();
    const [avatarUrl, setAvatarUrl] = useState<any>();
    const [imgUrl, setImgUrl] = useState<any>();
    const [currentPost, setCurrentPost] = useState<any>();
    const [like, setLike] = useState<boolean>(false);
    const [canUpload, setCanUpload] = useState<boolean>(false);
    const [posts, setPosts] = useState<any>([]);
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
            const imageRef = ref(storage, `${user?.email}/images/${img}`);
            getDownloadURL(imageRef)
                .then((url) => {
                    setImgUrl(url);
                });
        } else {
            return console.log("No such document!");
        }
    }

    const getCurrentPostFromDoc = async () => {
        const docRef = doc(db, `${user?.email}`, "posts");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            docSnap.data().posts.map((post: any) => {
                if (post.id === id) {
                    setCurrentPost(post);
                    if (post.likes.includes(user?.email)){
                        setLike(true);
                    }
                }
            })
        } else {
            return console.log("No such document!");
        }
    }

    const likePost = async () => {
        const docRef = doc(db, `${user?.email}`, "posts");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await docSnap.data().posts.map(async (post: any) => {
                if (post.id === id) {
                    setPosts([...docSnap.data().posts.filter((item: any) => item.id !== post.id),
                        {...post, likes: [...post.likes, user?.email]}]);
                    setCanUpload(true);
                    setLike(true);
                }
            })
        } else {
            return console.log("No such document!");
        }
    }

    const unLikePost = async () => {
        const docRef = doc(db, `${user?.email}`, "posts");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await docSnap.data().posts.map(async (post: any) => {
                if (post.id === id) {
                    setPosts([...docSnap.data().posts.filter((item: any) => item.id !== post.id),
                        {...post, likes: post.likes.filter((item: any) => item !== user?.email)}]);
                    setCanUpload(true);
                    setLike(false);
                }
            })
        } else {
            return console.log("No such document!");
        }
    }

    const updateLikes = async () => {
        const docRef = doc(db, `${user?.email}`, "posts");
        await updateDoc(docRef, {
            posts: posts
        });
    }

    useEffect(() => {
        getUserDataFromDoc()
            .then(getCurrentPostFromDoc);
    }, []);

    useEffect(() => {
        if (canUpload) {
            updateLikes();
        }
    }, [posts]);

    return (
        <Grid item>
            <Card>
                    <CardHeader
                        avatar={<Link href='/home'><Avatar src={avatarUrl}/></Link>}
                        title={<Link href='/home' underline='none'>{`${data?.firstName} ${data?.lastName}`}</Link>}
                        subheader={time}
                        action={
                            <Tooltip title={'Видалити'}>
                                <IconButton aria-label="settings" onClick={() => remove ? remove(id) : remove}>
                                    <CloseIcon/>
                                </IconButton>
                            </Tooltip>
                        }
                    />
                {img !== ''
                    ?
                    <>
                        <CardMedia
                            component="img"
                            height="300"
                            image={imgUrl}
                            alt={alt}
                        />
                        <Typography sx={{p:2}}>{description}</Typography>
                    </>
                    :
                    <Typography sx={{p:2}}>{description}</Typography>
                }
                <Divider/>
                <CardActions disableSpacing>
                    <IconButton onClick={like ? unLikePost : likePost} aria-label="add to favorites">
                        <FavoriteIcon color={like ? "primary" : "inherit"} />
                    </IconButton>
                    <Typography>{likes.length}</Typography>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default Post;