import React, {FC} from 'react';
import classes from "./messenger.module.scss";
import {Button, TextField} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface IMessageForm {
    handleSubmit(e: any): void;
    text: string;
    setText(text: string): void;
}

const MessageForm:FC<IMessageForm> = ({handleSubmit, text, setText}) => {
    return (
        <form className={classes.message_form} onSubmit={handleSubmit}>
            <div>
                <input type='text' value={text} onChange={(e:any) => setText(e.target.value)}/>
            </div>
            <div>
                <Button type='submit' variant='contained' className={classes.btn}><SendIcon/></Button>
            </div>
        </form>
    );
};

export default MessageForm;