import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {Box, Typography, Container, Card, Button, Dialog, DialogTitle, List, ListItem, Divider, Grid} from "@mui/material";
import classes from '../../styles/news.module.scss'
import Navbar from "../../navbar/Navbar";
import Menu from "../../menu/Menu";
import {useAuth} from "../../providers/useAuth";
import {getStorage} from "firebase/storage";
import {doc, getDoc} from "firebase/firestore";
import News from "./News";
import NewsList from "./NewsList";
import {IPost} from "../../../interfaces";
import Loader from "../../loader/Loader";
import NewsListByPopularity from "./NewsListByPopularity";

const NewsPage:FC = () => {
    const {db, user} = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [subscribes, setSubscribes] = useState<any>([]);
    const [news, setNews] = useState<IPost[]>([]);
    const [sortMenu, setSortMenu] = useState<boolean>(false);
    const [sortMethod, setSortMethod] = useState<string>('standard');
    const [newsDone, setNewsDone] = useState<boolean>(false);

    const getUserDataFromDoc = async () => {
        const docRef = doc(db, `${user?.email}`, "userData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await setSubscribes(docSnap.data()?.data.subscribes);
            await docSnap.data()?.data.subscribes.map(async (item:any) => {
                const subDocRef = doc(db, `${item.email}`, "posts");
                const subDocSnap = await getDoc(subDocRef);
                if (subDocSnap.exists()) {
                    await subDocSnap.data()?.posts.map(async (post:IPost) => {
                        setNews([post, ...news]);
                    })
                } else {
                    return console.log("No such document!");
                }
            });
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getUserDataFromDoc()
            .then(() => setNewsDone(true));
    }, []);

    return (
        <Container>
            <>
                <Navbar openMenu={() => setMenuOpen(true)}/>
                <Card sx={{p: 2, mb: 5, display:'flex', justifyContent:'space-between'}} onClick={() => {
                    console.log('News:', news);
                    console.log('Subs:', subscribes);
                }}>
                    <Typography variant='h5'>
                        Новини
                    </Typography>
                    <>
                        <Button
                            variant='outlined'
                            onClick={() => setSortMenu(true)}
                        >Сортувати</Button>
                        <Dialog onClose={() => setSortMenu(false)} open={sortMenu}>
                            <DialogTitle>Оберіть метод сортування</DialogTitle>
                            <List sx={{ pt: 0 }}>
                                <Divider/>
                                <ListItem button onClick={() => {
                                    setSortMethod('newest');
                                    setSortMenu(false);
                                }}>
                                    Спочатку найновіші
                                </ListItem>
                                <Divider/>
                                <ListItem button onClick={() => {
                                    setSortMethod('popular');
                                    setSortMenu(false);
                                }}>
                                    Спочатку найпопулярніші
                                </ListItem>
                            </List>
                        </Dialog>
                    </>
                </Card>
                {newsDone
                    ?
                    sortMethod === 'newest'
                        ?
                        subscribes.map((item: any) =>
                            <NewsList email={item.email} key={item.email}/>
                        )
                        :
                        subscribes.map((item: any) =>
                            <NewsListByPopularity email={item.email} key={item.email}/>
                        )
                    :
                    <Loader/>
                }
                <Menu menuOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)}/>
            </>
        </Container>
    );
};

export default NewsPage;