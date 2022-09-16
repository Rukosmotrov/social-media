import React, {FC} from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface ISearchedUserCountry {
    country: any;
}

const SearchedUserCountry:FC<ISearchedUserCountry> = ({country}) => {
    if (country) {
        return (
            <ListItem>
                <ListItemIcon>
                    <LocationOnIcon/>
                </ListItemIcon>
                <ListItemText primary={`Країна народження: ${country}`}/>
            </ListItem>
        );
    } else {
        return (
            <>
            </>
        );
    }
};

export default SearchedUserCountry;