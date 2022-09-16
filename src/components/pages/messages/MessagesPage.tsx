import React, {FC, useEffect, useState} from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Drawer, Divider
} from "@mui/material";
import Navbar from "../../navbar/Navbar";
import Menu from "../../menu/Menu";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    Timestamp,
    orderBy,
    onSnapshot,
    query,
    setDoc,
    updateDoc
} from "firebase/firestore";
import {useAuth} from "../../providers/useAuth";
import classes from "./messenger.module.scss";
import DialogsItem from "./DialogsItem";
import MessageForm from "./MessageForm";
import Message from "./Message";

const MessagesPage:FC = () => {
    const {db, user} = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [users, setUsers] = useState<any>([]);
    const [currentUser, setCurrentUser] = useState<any>({});
    const [chat, setChat] = useState<any>();
    const [text, setText] = useState<any>('');
    const [messages, setMessages] = useState<any>([]);

    const getUsers = async () => {
        const docRef = doc(db, `${user?.email}`, "messages");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setUsers(docSnap.data().messages);
            console.log('Users', users);
        } else {
            return console.log("No such document!");
        }
    }

    const selectUser = async (item: any) => {
        setChat(item);
        setMessages([]);
        const docRef = doc(db, "usersList", "users");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await docSnap.data().list.map(async (item: any) => {
                if (item.email === user?.email) {
                    setCurrentUser(item);
                    const id = parseInt(item?.dateOfReg) > parseInt(chat?.dateOfReg) ?
                        `${item?.email}${chat?.email}` : `${chat?.email}${item?.email}`
                    const messagesRef = collection(db, 'messages', id, 'chat');
                    const q = query(messagesRef, orderBy('createdAt', 'asc'));

                    onSnapshot(q, (querySnapshot) => {
                        let msgs: any = [];
                        querySnapshot.forEach((doc) => {
                            msgs.push(doc.data());
                        });
                        setMessages(msgs);
                    });

                    const lastMsgDocSnap = await getDoc(doc(db, 'lastMessage', id));

                    if (lastMsgDocSnap.exists()) {
                        if (lastMsgDocSnap.data()?.from !== user?.email) {
                            await updateDoc(doc(db, 'lastMessage', id), {unread: false})
                        }
                    }
                }
            })
        } else {
            return console.log("No such document!");
        }
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const docRef = doc(db, "usersList", "users");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await docSnap.data().list.map(async (item: any) => {
                if (item.email === user?.email) {
                    const id = parseInt(item.dateOfReg) > parseInt(chat.dateOfReg) ?
                        `${item.email}${chat.email}` : `${chat.email}${item.email}`
                    await addDoc(collection(db, 'messages', id, 'chat'), {
                        text,
                        from: user?.email,
                        to: chat?.email,
                        createdAt: Timestamp.fromDate(new Date())
                    });

                    await setDoc(doc(db, 'lastMessage', id), {
                        text,
                        from: user?.email,
                        to: chat?.email,
                        createdAt: Timestamp.fromDate(new Date()),
                        unread: true
                    })
                }
            })
        } else {
            return console.log("No such document!");
        }
        setText('');
    }

    useEffect(() => {
        getUsers();
    }, []);
    return (
        <>
            <Navbar openMenu={() => setMenuOpen(true)}/>
            <Box className={classes.messenger_container}>
                <Box className={classes.users_container}>
                    {users.length > 0
                    ?
                        users.map((item:any) => <DialogsItem
                            usr={item}
                            key={item.email}
                            selectUser={selectUser}
                            chat={chat}
                        />)
                        :
                        <Typography variant='h5'>Чати відсутні</Typography>
                    }
                </Box>
                <Box className={classes.messages_container}>
                    {chat
                        ?
                        <>
                            <div className={classes.messages_user}>
                                <Typography variant='h5'>{`${chat.firstName} ${chat.lastName}`}</Typography><br/>
                                <Divider sx={{width:'100%'}}/>
                            </div>
                            <div className={classes.messages}>
                                {messages.length ? messages.map((msg: any, i: any) =>{
                                        console.log('Msg: ', msg);
                                        return (
                                            <Message key={i} message={msg} currentUser={currentUser}/>
                                        )
                                    }
                                ) : null}
                            </div>
                            <MessageForm handleSubmit={handleSubmit} text={text} setText={setText}/>
                        </>
                        :
                        <>
                            <div className={classes.messages_user}>
                                <Typography variant='h5'>Оберіть чат</Typography><br/>
                                <Divider style={{width:'100%'}}/>
                            </div>
                        </>
                    }
                </Box>
            </Box>
            <Menu menuOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)}/>
        </>
    );
};

export default MessagesPage;