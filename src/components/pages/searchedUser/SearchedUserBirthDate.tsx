import React, {FC} from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";

interface ISearchedUserBirthDate {
    date: any;
}

const SearchedUserBirthDate:FC<ISearchedUserBirthDate> = ({date}) => {
    return (
        <ListItem>
            <ListItemIcon>
                <ChildFriendlyIcon/>
            </ListItemIcon>
            <ListItemText primary={`Дата народження: ${date}`}/>
        </ListItem>
    );
};

export default SearchedUserBirthDate;