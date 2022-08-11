import { Button, Grid, Modal, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetAddress } from "../redux/actions/addressAction";
import AddressForm from "./AddressForm";
import AddressCard from "./AddressCard";
import LoadingSpinner from "./LoadingSpinner";


const style = {
    internalBox: {
        display: "flex",
        flexGrow: 1,
        maxWidth: "sm",
        align: "center",
        width: "100%",
        p: 5,
        m: "auto",
        mt: 3,
        borderRadius: "8px",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    },
    modal: {
        overflow: "auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "md",
        width: "100%",
        bgcolor: "background.paper",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "6px",
        p: 4,
        my: 3
    }
}

const AddressContainer = (props) => {
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
    const addressDetails = useSelector((state) => {
        return state.addressDetails
    })
    const dispatch = (useDispatch())

    const userId = useSelector((state) => {
        return state.userDetails.user._id
    })
    // onload fetch address
    useEffect(() => {
        if (!addressDetails.address._id && !addressDetails.error.message) {
            dispatch(asyncGetAddress(userId))
        }
    }, [])

    const handleClick = () => {
        setIsAddressFormOpen(!isAddressFormOpen)
    }
    return (
        <Grid px={2}>
            {
                addressDetails.isLoading ? <LoadingSpinner /> : (!addressDetails.isLoading) && (
                    <Grid display="flex" direction="row" container sx={style.internalBox} align="center" item >
                        {
                            (addressDetails.error.message === "address doesn't exist") ? (
                                <>
                                    {!isAddressFormOpen ? (
                                        <>
                                            <Grid item xs={12} mb={2}><Typography>No Address Found</Typography></Grid>
                                            <Grid item xs={12}>
                                                <Button variant="contained" onClick={handleClick}>Create Address</Button>
                                            </Grid>
                                        </>
                                    ) : (
                                        <Modal open={isAddressFormOpen} onClose={handleClick}>
                                            <Box sx={style.modal}>
                                                <AddressForm handleClose={handleClick} />
                                            </Box>
                                        </Modal>

                                    )}
                                </>

                            ) : (addressDetails.address._id && !isAddressFormOpen) ? (
                                <AddressCard handleClick={handleClick} />
                            ) : isAddressFormOpen ? (
                                <Modal open={isAddressFormOpen} onClose={handleClick}>
                                    <Box sx={style.modal}>
                                        <AddressForm handleClose={handleClick} />
                                    </Box>
                                </Modal>

                            ) : null
                        }
                    </Grid>
                )
            }
        </Grid>
    )
}

export default AddressContainer