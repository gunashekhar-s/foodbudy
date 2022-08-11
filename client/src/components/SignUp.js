import React, { useEffect, useState } from 'react'
import { Link, useHistory, withRouter } from "react-router-dom"
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { Avatar, Grid, Box, Typography, Container, CircularProgress, Toolbar, InputAdornment, IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { toast } from 'react-toastify';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { useDispatch } from 'react-redux';
import { asyncGenerateRegisterOtp, asyncVerifyRegisterOtp } from '../redux/actions/userActions';

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
    const verificationFor = "register"
    const history = useHistory()
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
    const dispatch = useDispatch()

    //continue form
    const handleContinueFormSubmit = (data, { setErrors, resetForm }) => {
        setIsLoading(true)
        const newData = { ...data, verificationFor }
        dispatch(asyncGenerateRegisterOtp(newData, { setErrors, resetForm }, setIsLoading, setCertificationKey, errorToast, setOtpSent))

        // making API call -  without redux (test)
        // axios.post("http://localhost:3040/auth/sendotp", { ...data, verificationFor })
        //     .then((response) => {
        //         const data = response.data
        //         if (data.error === "unable to send email") {
        //             setIsLoading(false)
        //             errorToast("Try Again Later")
        //             resetForm()
        //         } else if (data.error && data.error.includes("email")) {
        //             setErrors({ email: data.error })
        //             setIsLoading(false)
        //         } else if (data.message === "otp sent") {
        //             setOtpSent(true)
        //             setIsLoading(false)
        //             setCertificationKey(data.certificationKey)
        //         } else {
        //             console.log(data)
        //             setIsLoading(false)
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
    }
    const intialValuesContinueForm = {
        username: "",
        email: "",
        password: ""
    }
    const validationSchemaConinueForm = Yup.object({
        username: Yup.string()
            .required("Username required")
            .min(3, "Username must contain atleast 3 characters")
            .max(64, "Username must cannot exceed 64 characters"),
        email: Yup.string()
            .required("Email required")
            .email("Invalid email address")
            .min(3, "Email must contain atleast 3 characters")
            .max(128, "Email cannot exceed 128 characters"),
        password: Yup.string()
            .required("Password required")
            .min(8, "Password must contain atleast 8 characters")
            .max(128, "Password cannot exceed 128 characters")

    })
    const formik = useFormik({
        initialValues: intialValuesContinueForm,
        onSubmit: (data, { setErrors, resetForm }) => {
            handleContinueFormSubmit(data, { setErrors, resetForm })
        },
        validationSchema: validationSchemaConinueForm
    })

    //verifiy form
    const handleVerifyFormSubmit = (data, { setErrors, resetForm }) => {
        // making API call -  without redux (test)


        const newData = { ...data, certificationKey, verificationFor, ...formik.values }
        dispatch(asyncVerifyRegisterOtp(newData, { setErrors, resetForm }, errorToast, successToast, setOtpSent, history, formik.resetForm))
        // axios.post("http://localhost:3040/auth/verify", newData)
        //     .then((response) => {
        //         const data = response.data
        //         if (data.error === "OTP cannot be empty") {
        //             setErrors({ otp: data.error })
        //         } else if (data.error === "Invalid OTP") {
        //             setErrors({ otp: data.error })
        //         } else if (data.error === "OTP already used or verified" || data.error === "OTP was not sent for this request" || data.error === "OTP Expired") {
        //             resetForm()
        //             errorToast(data.error)
        //             setOtpSent(false)
        //             formik.resetForm()
        //         } else if (data.message === "registered") {
        //             toast.success("Registered Successfully", {
        //                 position: "top-center",
        //                 autoClose: 1500,
        //                 hideProgressBar: true,
        //                 closeOnClick: true,
        //                 pauseOnHover: false,
        //                 draggable: true,
        //                 progress: undefined,
        //                 width: "200"
        //             })
        //             resetForm()
        //             setOtpSent(false)
        //             formik.resetForm()
        //             props.history.push("/login")
        //         }
        //         else {
        //             console.log(data)
        //             resetForm()
        //             errorToast("Try Again Later!")
        //             setOtpSent(false)
        //             formik.resetForm()
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
    }

    const initialValuesVerifyForm = { otp: "" }

    const validationSchemaVerifyForm = Yup.object({

        otp: Yup.number()
            .required("OTP required")
            .min(6, "OTP must be six digits value")
            .min(6, "OTP must be six digits value")
    })
    const newFormik = useFormik({
        initialValues: initialValuesVerifyForm,
        onSubmit: (data, { setErrors, resetForm }) => {
            handleVerifyFormSubmit(data, { setErrors, resetForm })
        },
        validationSchema: validationSchemaVerifyForm
    })

    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);


    //unmount reset
    useEffect(() => {
        return () => {
            setIsLoading(false)
            setOtpSent(false)
            setCertificationKey("")

            formik.setErrors(intialValuesContinueForm)
            newFormik.setErrors(initialValuesVerifyForm)
            formik.resetForm()
            newFormik.resetForm()
        }
    }, [])

    return (

        <div>

            <Toolbar />
            <Container component="main" maxWidth="sm">

                <Box sx={styles.box}                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register

                    </Typography>

                    {
                        !otpSent ? (
                            <Box component="form" onSubmit={formik.handleSubmit}>


                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    id="username"
                                    name="username"
                                    label="Username"
                                    autoComplete="current-username"
                                    onBlur={formik.handleBlur}
                                    error={Boolean(formik.touched.username && formik.errors.username)}
                                    helperText={(formik.touched.username && formik.errors.username) && formik.errors.username}
                                />


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


                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
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


                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {isLoading ? (<CircularProgress sx={{ color: "white" }} />)
                                        : "Continue"
                                    }
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link to="/login" style={styles.link}>
                                            {"Already have an account? Sign In"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                            :
                            (<Box component="form" onSubmit={newFormik.handleSubmit}>

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={formik.values.email}
                                    id="email"
                                    name="email"
                                    label="Email"
                                    autoFocus
                                    autoComplete="current-email"
                                    disabled
                                />

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={newFormik.values.otp}
                                    onChange={newFormik.handleChange}
                                    id="otp"
                                    name="otp"
                                    label="One Time Password"
                                    autoFocus
                                    autoComplete="current-otp"
                                    onBlur={newFormik.handleBlur}
                                    error={Boolean(newFormik.touched.otp && newFormik.errors.otp)}
                                    helperText={(newFormik.touched.otp && newFormik.errors.otp) && newFormik.errors.otp}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {"Verify & Register"}
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link to="/register" style={styles.link}>
                                            {"Start Again"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>)
                    }














                </Box>
            </Container>
        </div>
    )
}






export default withRouter(SignUp)