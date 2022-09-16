import React, {useEffect, useRef, useState, FC} from 'react';
import {Alert, Box, Button, Modal, Typography, Divider} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import {IImageUploader, IUserInfo} from "../../interfaces";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {useAuth} from "../providers/useAuth";
import {doc, getDoc} from "firebase/firestore";

const ImageUploader:FC<IImageUploader> = ({isOpen, closeModal, changer}) => {
    const storage = getStorage();
    const [imageDrag, setImageDrag] = useState(false);
    const [imageDropped, setImageDropped] = useState(false);
    const [isError, setError] = useState(false);
    const errorText = useRef('');
    const image = useRef('');
    const {user} = useAuth();

    function dragStartHandler(e :any) {
        e.preventDefault();
        setImageDrag(true);
    }
    function dragLeaveHandler(e :any) {
        e.preventDefault();
        setImageDrag(false);
    }

    const uploadImageToStorage = (file: any) => {
        if (!file) return;
        const storageRef = ref(storage, `${user?.email}/images/${file.name}`);
        const upload = uploadBytesResumable(storageRef, file);

        upload.on("state_changed", (snapshot) => {
            getDownloadURL(upload.snapshot.ref)
                .then((url) => {
                    console.log(url);
                    setImageDropped(true);
                })
        });
    }

    function onDropHandler(e: any) {
        e.preventDefault();
        let file = e.dataTransfer.files[0];
        let fileType =  file.name.split(".").splice(-1,1)[0];
        if (fileType === 'bmp' || fileType === 'jpeg' || fileType === 'png' || fileType === 'tif' || fileType === 'tiff' || fileType === 'jpg') {
            image.current = file.name;
            uploadImageToStorage(file);
        } else {
            errorText.current = 'Невірний тип файлу';
            setError(true);
            setTimeout(() => {
                setError(false);
                setImageDropped(false);
            }, 1500)
        }
        setImageDropped(true);
    }

    const onClickChooseImage = (e :any) => {
        let file = e.target.files[0];
        let fileType =  file.name.split(".").splice(-1,1)[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            if (fileType === 'bmp' || fileType === 'jpeg' || fileType === 'png' || fileType === 'tif' || fileType === 'tiff' || fileType === 'jpg') {
                image.current = file.name;
                uploadImageToStorage(file);
                setImageDropped(true);
            } else {
                errorText.current = 'Невірний тип файлу';
                setError(true);
                setTimeout(() => {
                    setError(false);
                    setImageDropped(false);
                }, 1500)
            }
        }
    }

    useEffect(() => {
        if(!isOpen){
            setImageDropped(false);
            setError(false);
        }
    }, [isOpen]);

    const uploadImage = () => {
        if (image.current === ''){
            return;
        } else{
            if (changer) {
                changer(image.current);
                closeModal();
            }
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className='modal'>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Завантаження зображення
                </Typography>
                <Box id="modal-modal-description">
                    <p>Завантажте файл:  </p>
                    {imageDrag
                        ? <Box
                            className='image-drop-area'
                            onDragStart={e => dragStartHandler(e)}
                            onDragLeave={e => dragLeaveHandler(e)}
                            onDragOver={e => dragStartHandler(e)}
                            onDrop={e => onDropHandler(e)}
                        >
                            {imageDropped && isError ? <CloseIcon color='error'/> : imageDropped ?
                            <DoneIcon color='success'/> : 'Оберіть файл'}
                        </Box>
                        : <Box
                            className='image-drop-area'
                            onDragStart={e => dragStartHandler(e)}
                            onDragLeave={e => dragLeaveHandler(e)}
                            onDragOver={e => dragStartHandler(e)}
                        ><input onChange={onClickChooseImage} type='file'/>{'Оберіть файл'}</Box>
                    }
                </Box>
                <Divider/>
                <Button onClick={uploadImage}>Створити</Button>
                {isError
                    ? <Alert severity="error">{errorText.current}</Alert>
                    : <Alert severity="info">Натисніть на поле з рамкою, щоб обрати зображення, або перенесіть зображення</Alert>
                }
            </Box>
        </Modal>
    );
};

export default ImageUploader;