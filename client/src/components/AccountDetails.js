import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Box } from "@mui/system";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import * as Yup from 'yup';
import { useFormik } from "formik";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { asyncUpdateUserDetails } from "../redux/actions/userActions";
import { toast } from "react-toastify"
const styles = {
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
function AccountDetails(props) {
    const [isEdit, setIsEdit] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isChanged, setIsChanged] = useState(false)

    const userData = useSelector((state) => {
        return state.userDetails.user
    })
    const handleClick = () => {
        setIsEdit(true)
    }
    const successToast = (string) => {
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
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const intialValuesUserForm = {
        username: userData.username,
        password: ""
    }
    const validationSchemaUserForm = Yup.object({
        username: Yup.string()
            .required("Username required")
            .min(3, "Username must contain atleast 3 characters")
            .max(64, "Username must cannot exceed 64 characters"),
        password: Yup.string()
            .required("Password required")
            .min(8, "Password must contain atleast 8 characters")
            .max(128, "Password cannot exceed 128 characters")

    })
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: intialValuesUserForm,
        onSubmit: (data, { setErrors, resetForm }) => {
            dispatch(asyncUpdateUserDetails(data, setIsEdit, resetForm, successToast))
        },
        validationSchema: validationSchemaUserForm
    })


    return (
        <Grid display="flex" direction="row" container sx={styles.internalBox} align="center" item >
            {isEdit ? (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid align="right" sx={{ color: "text.secondary" }} ><CancelRoundedIcon sx={{ cursor: "pointer" }} onClick={() => { setIsEdit(false) }} /></Grid>
                    <TextField
                        margin="normal"
                        fullWidth
                        value={formik.values.username}
                        id="username"
                        name="username"
                        label="Username"
                        autoComplete="current-username"
                        onChange={(e) => {
                            setIsChanged(true)
                            formik.handleChange(e)
                        }}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.username && formik.errors.username)}
                        helperText={(formik.touched.username && formik.errors.username) && formik.errors.username}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        value={formik.values.password}
                        onChange={(e) => {
                            setIsChanged(true)
                            formik.handleChange(e)
                        }}
                        id="password"
                        name="password"
                        label="Password"
                        autoComplete="current-password"
                        type={showPassword ? "text" : "password"}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.password && formik.errors.password)}
                        helperText={(formik.touched.password && formik.errors.password) && formik.errors.password}
                        InputProps={{ // <-- This is where the toggle button is added.
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />


                    {isChanged && (
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Save

                        </Button>
                    )}
                </Box>
            ) : (
                <>
                    <Grid item xs={12} align="left" mb={1}><Typography variant="h6" color="text.primary">User Details

                        <Button sx={{ color: "text.primary", }} onClick={handleClick} size="small">
                            <EditRoundedIcon fontSize="inherit" />
                            Edit
                        </Button>
                    </Typography>
                    </Grid>
                    <Grid item xs={12} align="left"><Typography color="text.secondary">Username : {userData.username}</Typography></Grid>
                    <Grid item xs={12} align="left"><Typography color="text.secondary">Email : {userData.email}</Typography></Grid>
                </>
            )}








        </Grid>
    );
}

export default AccountDetails;