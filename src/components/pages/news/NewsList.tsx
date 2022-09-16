import React, {FC, useContext, useEffect, useState} from 'react';
import {doc, getDoc} from "firebase/firestore";
import {useAuth} from "../../providers/useAuth";
import News from "./News";
import {IUserInfo} from "../../../interfaces";
import {Grid, Box, Typography} from "@mui/material";

interface INewsList {
    email: string;
}

const NewsList:FC<INewsList> = ({email}) => {
    const {db} = useAuth();
    const [sortedPostsByTime, setSortedPostsByTime] = useState<any>([]);
    const [data, setData] = useState<IUserInfo>();

    const getUserPostsFromDoc = async () => {
        const docRef = doc(db, `${email}`, "posts");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setSortedPostsByTime([...docSnap.data().posts].sort((a,b) => b.id - a.id));
        } else {
            return console.log("No such document!");
        }
    }

    const getUserDataFromDoc = async () => {
        const docRef = doc(db, `${email}`, "userData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setData(docSnap.data().data);
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getUserPostsFromDoc()
            .then(getUserDataFromDoc)
    }, []);

    return (
        <Grid container direction="column" sx={{display:'flex', alignItems:'center'}}>
            {
                sortedPostsByTime.map((item: any) => {
                    return (
                        <News
                            avatar={data?.avatar}
                            email={email}
                            time={item.time}
                            img={item.img}
                            alt={item.alt}
                            description={item.description}
                            likes={item.likes}
                            id={item.id}
                        />
                    )
                })
            }
        </Grid>
    );
};

export default NewsList;