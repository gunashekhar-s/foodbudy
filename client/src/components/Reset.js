import React, { useEffect, useState } from 'react'
import { Link, withRouter } from "react-router-dom"
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { Avatar, Grid, Box, Typography, Container, CircularProgress, Toolbar, InputAdornment, IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { asyncResetSendOtp, asyncResetVerifyOtp } from '../redux/actions/userActions';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';



const styles = {
    box: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: "1px solid grey",
        borderRadius: "5px",
        padding: "15px 15px"
    },
    link: {
        color: "inherit"
    }
}

const SignUp = (props) => {
    const [otpSent, setOtpSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [certificationKey, setCertificationKey] = useState("")
    const dispatch = useDispatch()
    const errorToast = (string) => {
        toast.error(string, {
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

    const verificationFor = "reset"
    const handleContinueFormSubmit = (data, { setErrors, resetForm }) => {
        setIsLoading(true)
        dispatch(asyncResetSendOtp({ ...data, verificationFor }, { setErrors, resetForm }, setIsLoading, setOtpSent, setCertificationKey, errorToast))

    }

    //continue form
    const intialValuesSendOtpForm = { email: "" }
    const validationSchemaSendOtpForm = Yup.object({

        email: Yup.string()
            .required("Email required")
            .email("Invalid email address")
            .min(3, "Email must contain atleast 3 characters")
            .max(128, "Email cannot exceed 128 characters")


    })
    const formik = useFormik({
        initialValues: intialValuesSendOtpForm,
        onSubmit: (data, { setErrors, resetForm }) => {
            handleContinueFormSubmit(data, { setErrors, resetForm })
        },
        validationSchema: validationSchemaSendOtpForm
    })

    //otp verifiy form
    const handleVerifyFormSubmit = (data, { setErrors, resetForm }) => {
        const redirect = () => {
            props.history.push("/login")
        }
        const newData = { ...data, email: formik.values.email, verificationFor, certificationKey }
        dispatch(asyncResetVerifyOtp(newData, { setErrors, resetForm }, errorToast, setOtpSent, successToast, redirect))
    }
    const initialValuesVerifyForm = {
        otp: "",
        password: ""
    }
    const validationSchemaVerifyForm = Yup.object({
        otp: Yup.number()
            .required("OTP required"),
        password: Yup.string()
            .required("Password required")
            .min(8, "Password must contain atleast 8 characters")
            .max(128, "Password cannot exceed 128 characters")
    })
    const verifyFormik = useFormik({
        initialValues: initialValuesVerifyForm,
        onSubmit: (data, { setErrors, resetForm }) => {
            handleVerifyFormSubmit(data, { setErrors, resetForm })
        },
        validationSchema: validationSchemaVerifyForm
    })

    //unmount reset
    useEffect(() => {
        return () => {
            setIsLoading(false)
            setOtpSent(false)
            formik.setErrors(intialValuesSendOtpForm)
            verifyFormik.setErrors(initialValuesVerifyForm)
            formik.resetForm()
            verifyFormik.resetForm()
        }
    }, [])

    const submithere = (e) => {
        e.preventDefault()
        verifyFormik.handleSubmit()
    }
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (

        <div>
            <Toolbar />
            <Container component="main" maxWidth="sm">
                <Box sx={styles.box}               >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Reset Password

                    </Typography>
                    {
                        !otpSent ? (
                            <Box component="form" onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    autoComplete="current-email"
                                    onBlur={formik.handleBlur}
                                    error={Boolean(formik.touched.email && formik.errors.email)}
                                    helperText={(formik.touched.email && formik.errors.email) && formik.errors.email}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {isLoading ? (<CircularProgress sx={{ color: "white" }} />)
                                        : "Send OTP"
                                    }
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link to="/login" style={styles.link}>
                                            {"Remember Password? Sign In"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                            :
                            (<Box component="form" onSubmit={submithere}>

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={formik.values.email}
                                    id="email"
                                    name="email"
                                    label="Email"
                                    autoComplete="current-email"
                                    disabled
                                />

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={verifyFormik.values.otp}
                                    onChange={verifyFormik.handleChange}
                                    id="otp"
                                    name="otp"
                                    label="One Time Password"
                                    autoComplete="current-otp"
                                    onBlur={verifyFormik.handleBlur}
                                    error={Boolean(verifyFormik.touched.otp && verifyFormik.errors.otp)}
                                    helperText={(verifyFormik.touched.otp && verifyFormik.errors.otp) && verifyFormik.errors.otp}
                                />

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={verifyFormik.values.password}
                                    onChange={verifyFormik.handleChange}
                                    id="password"
                                    name="password"
                                    label="New Password"
                                    autoComplete="current-password"
                                    onBlur={verifyFormik.handleBlur}
                                    type={showPassword ? "text" : "password"}
                                    error={Boolean(verifyFormik.touched.password && verifyFormik.errors.password)}
                                    helperText={(verifyFormik.touched.password && verifyFormik.errors.password) && verifyFormik.errors.password}
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

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {"Reset Password"}
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link to="/login" style={styles.link}>
                                            {"Remember Password? Sign In"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>)
                    }
                </Box>
            </Container>
        </div >
    )
}

export default withRouter(SignUp)