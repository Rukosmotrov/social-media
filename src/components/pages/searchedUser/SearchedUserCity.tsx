import React, {FC} from 'react';
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

interface ISearchedUserCity {
    city: any;
}

const SearchedUserCity:FC<ISearchedUserCity> = ({city}) => {
    if (city) {
        return (
            <ListItem>
                <ListItemIcon>
                    <HomeIcon/>
                </ListItemIcon>
                <ListItemText primary={`Місто: ${city}`}/>
            </ListItem>
        );
    } else {
        return (
          <>
          </>
        );
    }
};

export default SearchedUserCity;