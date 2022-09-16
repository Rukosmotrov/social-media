import React, {FC, useContext, useEffect, useState} from 'react';
import {Card, CardHeader, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import {IUserInfo} from "../../../interfaces";
import {useAuth} from "../../providers/useAuth";
import {doc, getDoc} from "firebase/firestore";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const SearchedUserShortInfo:FC = () => {
    const {user, db} = useAuth();
    const [currentUser, setCurrentUser] = useState<any>();
    const [data, setData] = useState<IUserInfo>();
    const [shortInfo, setShortInfo] = useState<any>([]);

    const getCurrentUserFromDoc = async () => {
        const docRef = doc(db, "usersList", "currentUser");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
        } else {
            return console.log("No such document!");
        }
    }

    const getUserDataFromDoc = async () => {
        const docRef = doc(db, `${currentUser?.currentUser.email}`, "userData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setData(docSnap.data().data);
            setShortInfo([
                {
                    icon: HomeIcon,
                    info: `Місто: ${docSnap.data().data.cityOfResidence}`,
                    state: docSnap.data().data.cityOfResidence
                },
                {
                    icon: LocationOnIcon,
                    info: `Країна народження: ${docSnap.data().data.countryOfBirth}`,
                    state: docSnap.data().data.countryOfBirth
                },
                {
                    icon: ChildFriendlyIcon,
                    info: `Дата народження: ${docSnap.data().data.birthDate}`,
                    state: docSnap.data().data.birthDate
                } ,
            ]);
        } else {
            return console.log("No such document!");
        }
    }

    useEffect(() => {
        getCurrentUserFromDoc();
    }, []);

    useEffect(() => {
        getUserDataFromDoc();
    }, [currentUser]);
    return (
        <Card className='card' sx={{mt:5, p:2}}>
            <CardHeader
                title={'Коротка інформація'}
            />
            <List>
                {
                    shortInfo.map((item: any) => {
                        if (item.state) {
                            return (
                                <ListItem>
                                    <ListItemIcon>
                                        <item.icon/>
                                    </ListItemIcon>
                                    <ListItemText primary={item.info}/>
                                </ListItem>
                            );
                        } else {
                            return (
                                <>
                                </>
                            );
                        }
                    })
                }
            </List>
        </Card>
    );
};

export default SearchedUserShortInfo;