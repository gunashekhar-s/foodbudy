

import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useSelector } from 'react-redux';

function AddressCard(props) {
    const { handleClick } = props
    const address = useSelector((state) => {
        return state.addressDetails.address
    })
    return (
        <>
            <Grid item xs={12} align="left" mb={1}><Typography variant="h6" color="text.primary">Address

                <Button sx={{ color: "text.primary", }} onClick={handleClick} size="small">
                    <EditRoundedIcon fontSize="inherit" />
                    Edit
                </Button>
            </Typography>
            </Grid>
            <Grid item xs={12} align="left"><Typography color="text.secondary">#{address.houseNumber}</Typography></Grid>
            <Grid item xs={12} align="left"><Typography color="text.secondary">{address.streetName}</Typography></Grid>
            <Grid item xs={12} align="left"><Typography color="text.secondary">{address.areaName}</Typography></Grid>
            <Grid item xs={12} align="left"><Typography color="text.secondary">{`${address.city} - ${address.pincode}`}</Typography></Grid>
            <Grid item xs={12} align="left"><Typography color="text.secondary">{address.state}</Typography></Grid>

        </>
    )
}

export default AddressCard;