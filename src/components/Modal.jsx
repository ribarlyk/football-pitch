import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "./Pitch.scss"
import { useState } from 'react';

const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 100,
    bgcolor: '#ffffff',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,

};



export default function BasicModal({ name,onPlayerChangeHandler }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const switchPlayerHandler = () => {
        console.log(name);
        setOpen(false);
        console.log(onPlayerChangeHandler)
        onPlayerChangeHandler(true)
    }

    return (
        <div>
            <Button size={'large'} onClick={handleOpen}><img className='change-icon'width='30' height='30' position='absolute' src='assets\swapplayers.png' /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">

                    </Typography>

                    <div className="modal-buttons">
                        <button onClick={switchPlayerHandler}>SWITCH</button>
                        <button>INFO</button>
                    </div>

                </Box>
            </Modal>
        </div>
    );
}
