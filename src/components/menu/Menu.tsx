import React, {FC, useEffect, useState} from 'react';
import {
    Avatar, Badge,
    Button,
    Card,
    CardHeader,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {IMenu, IUserInfo} from "../../interfaces";
import {useNavigate} from "react-router-dom";
import {MenuData} from "../data/MenuData";
import {useAuth} from "../providers/useAuth";
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {doc, getDoc, updateDoc} from "firebase/firestore";
import MailIcon from "@mui/icons-material/Mail";
import {getDownloadURL, getStorage, ref} from "firebase/storage";

const Menu:FC<IMenu> = ({menuOpen, closeMenu}) => {
    const navigate = useNavigate();
    const {user, ga, db} = useAuth();
    const [data, setData] = useState<IUserInfo>();
    const [avatarUrl, setAvatarUrl] = useState<any>();
    const [unreadMsgs, setUnreadMsgs] = useState<any>([]);
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
        } else {
            return console.log("No such document!");
        }
    }

    const getLastMessages = async () => {
        const lastMsgDocSnap = await getDoc(doc(db, 'lastMessage'));
        console.log('Last MSG: ', lastMsgDocSnap.data());
    }

    const handleLogOut = async (e: any) =>{
        e.preventDefault();
        const docRef = doc(db, `${user?.email}`, "userData");
        const docSnap = await getDoc(docRef);
        try {
            await updateDoc(docRef, {
                data: {
                    ...docSnap.data()?.data,
                    isInNetwork: 'offline'
                }
            });
            signOut(ga);
            closeMenu();
        } catch (error:any) {
            console.log('');
        }
    }

    useEffect(() => {
        getUserDataFromDoc();
        getLastMessages();
    }, []);

    return (
        <Drawer
            anchor="left"
            open={menuOpen}
            onClose={closeMenu}
        >
            <List className='menu'>
                <ListItem>
                    <Card sx={{maxWidth: '300px'}}>
                        <CardHeader
                            avatar={<Avatar alt='User' src={avatarUrl}/>}
                            title={`${data?.firstName} ${data?.lastName}`}
                        />
                    </Card>
                    <Divider/>
                </ListItem>
                {MenuData.map(item => {
                    if (item.path !== '/messages') {
                        return (
                            <ListItem key={item.path}>
                                <Button
                                    sx={{width:'100%'}}
                                    onClick={() => {
                                        navigate(item.path);
                                        closeMenu();
                                    }}>
                                    <ListItemIcon>
                                        <item.icon/>
                                    </ListItemIcon>
                                    <ListItemText primary={item.pageName}/>
                                </Button>
                            </ListItem>
                        )
                    } else {
                        return (
                            <ListItem key={item.path}>
                                <Button
                                    sx={{width:'100%'}}
                                    onClick={() => {
                                        navigate(item.path);
                                        closeMenu();
                                    }}>
                                    <ListItemIcon>
                                        <MailIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.pageName}/>
                                </Button>
                            </ListItem>
                        )
                    }
                })}
                <ListItem>
                    <Button onClick={handleLogOut}>Вийти</Button>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Menu;