import { Button, Grid, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useFormik } from "formik"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { asyncCreateAddress, asyncGetAddress, asyncgetDetailsByPincode } from "../redux/actions/addressAction";

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
    }
}

const Address = (props) => {

    const address = useSelector((state) => {
        return state.addressDetails
    })


    const [isLoading, setIsLoading] = useState(true)
    const [state, setState] = useState(address._id ? address.state : "")
    const [city, setCity] = useState(address._id ? address.city : "")
    const [pincode, setPincode] = useState(address._id ? address.pincode : "")
    const [pincodeError, setPincodeError] = useState("")
    const [isChanged, setIsChanged] = useState(false)
    const userRef = useSelector((state) => {
        return state.userDetails.user._id
    })
    const dispatch = useDispatch()

    const initialValues = {
        houseNumber: address._id ? address.houseNumber : "",
        streetName: address._id ? address.streetName : "",
        areaName: address._id ? address.areaName : "",
    }
    const validationSchema = Yup.object({
        houseNumber: Yup.string()
            .required("House Number required")
            .min(1, "House Number contain atleast 3 characters")
            .max(64, "House Number exceed 64 characters"),
        streetName: Yup.string()
            .required("Street Name required")
            .min(3, "Street Name contain atleast 3 characters")
            .max(256, "Street Name exceed 64 characters"),
        areaName: Yup.string()
            .required("Area Name required")
            .min(3, "Area Name contain atleast 3 characters")
            .max(256, "Area Name cannot exceed 64 characters"),

    })
    const formik = useFormik({
        initialValues,
        onSubmit: (data, { setErrors, resetForm }) => {
            handleSubmit(data, { setErrors, resetForm })
        },
        validationSchema
    })

    useEffect(() => {
        //initially address is empty, after change in stiore update state value
        if (address.city && address.pincode && address.state) {
            setState(address.state)
            setCity(address.city)
            setPincode(address.pincode)
            formik.values.houseNumber = address.houseNumber
            formik.values.streetName = address.streetName
            formik.values.areaName = address.areaName
        }
    }, [address])

    useEffect(() => {

        if (address.error === "address doesn't exist") {
            setIsLoading(false)
        } else if (!address._id) {
            dispatch(asyncGetAddress(userRef, setIsLoading))
        } else if (address._id) {
            setIsLoading(false)
        }
    }, [])

    const handlePincodeChange = (e) => {
        const setDetails = (city, state, error) => {
            setCity(city)
            setState(state)
            setPincodeError(error)
        }
        setIsChanged(true)
        setCity("")
        setState("")
        const value = e.target.value
        if (value.length <= 6) {
            setPincode(value)
            if (value.length < 6) {
                setPincodeError("Enter six digit pincode")
            } else if (value.length === 6) {
                setPincodeError("")
                dispatch(asyncgetDetailsByPincode(value, setDetails))
            }
        }
    }
    const handleSubmit = (data) => {
        const notify = (string) => {
            toast.success(string, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                width: "200"
            })
            setIsChanged(false)
        }
        if (!pincodeError && city.length > 0 && state.length > 0) {
            dispatch(asyncCreateAddress({ ...data, pincode, city, state, userRef }, notify))
        }
    }
    return (
        <Grid px={2}>
            {
                !isLoading && (
                    <Grid display="flex" direction="row" container sx={style.internalBox} align="center" item >
                        <Grid item align="center" >
                            <Typography variant="h5">
                                Address
                            </Typography>
                            <Box component="form" onSubmit={formik.handleSubmit}  >

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="houseNumber"
                                    name="houseNumber"
                                    label="House Number"
                                    autoComplete="current-houseNumber"
                                    onChange={(e) => {
                                        setIsChanged(true)
                                        formik.handleChange(e)
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.houseNumber}
                                    error={Boolean(formik.touched.houseNumber && formik.errors.houseNumber)}
                                    helperText={(formik.touched.houseNumber && formik.errors.houseNumber) && formik.errors.houseNumber}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="streetName"
                                    name="streetName"
                                    label="Street Name"
                                    autoComplete="current-streetName"
                                    onChange={(e) => {
                                        setIsChanged(true)
                                        formik.handleChange(e)
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.streetName}
                                    error={Boolean(formik.touched.streetName && formik.errors.streetName)}
                                    helperText={(formik.touched.streetName && formik.errors.streetName) && formik.errors.streetName}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="areaName"
                                    name="areaName"
                                    label="Area Name"
                                    autoComplete="current-areaName"
                                    onChange={(e) => {
                                        setIsChanged(true)
                                        formik.handleChange(e)
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.areaName}
                                    error={Boolean(formik.touched.areaName && formik.errors.areaName)}
                                    helperText={(formik.touched.areaName && formik.errors.areaName) && formik.errors.areaName}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="pincode"
                                    name="pincode"
                                    label="Pincode"
                                    autoComplete="current-pincode"
                                    onChange={handlePincodeChange}
                                    value={pincode}
                                    error={Boolean(pincodeError)}
                                    helperText={pincodeError && pincodeError}
                                />



                                {city && (
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="city"
                                        name="city"
                                        label="City"
                                        value={city}
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                                {
                                    state && (
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="satte"
                                            name="satte"
                                            label="State"
                                            value={state}
                                            disabled
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )
                                }

                                {
                                    (city.length > 0 && state.length > 0 && isChanged) && (
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Save
                                        </Button>
                                    )
                                }

                            </Box>
                        </Grid>
                    </Grid>
                )
            }
        </Grid>
    )
}

export default Address