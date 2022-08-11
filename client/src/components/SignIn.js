import React, { useEffect, useState } from 'react'
import { Link, useHistory, withRouter } from "react-router-dom"
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { asyncAuthLogin } from '../redux/actions/userActions'
import { IconButton, InputAdornment, Toolbar } from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'

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

const SignIn = (props) => {

    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const history = useHistory()
    const handleSubmit = (data) => {
        dispatch(asyncAuthLogin(data, setError, history))
    }

    const initialValues = {
        email: "foodbuddy1@outlook.com",
        password: "Admin@123"
    }

    const validationSchema = Yup.object({
        email: Yup.string()
            .required("Email required")
            .email("Invalid email address")
            .min(3, "Email must contain atleast 3 characters")
            .max(128, "Email cannot exceed 128 characters"),
        password: Yup.string()
            .required("Password required")
    })

    const formik = useFormik({
        initialValues,
        onSubmit: (data, { setErrors, resetForm }) => {
            handleSubmit(data, { setErrors, resetForm })
        },
        validationSchema
    })

    useEffect(() => {
        return () => {
            setError("")
            formik.setErrors(initialValues)
            formik.resetForm()
        }
    }, [])

    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (

        <div>
            <Toolbar />
            <Container component="main" maxWidth="sm">
                <Box sx={styles.box}                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit}  >
                        {error && (
                            <Typography variant="body2" sx={{ color: "warning.main", pl: 1 }}>
                                {error}
                            </Typography>
                        )}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            autoComplete="current-email"
                            // autoFocus
                            onChange={(e) => {
                                setError("")
                                formik.handleChange(e)
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            error={Boolean(formik.touched.email && formik.errors.email)}
                            helperText={(formik.touched.email && formik.errors.email) && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            autoComplete="current-password"
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => {
                                setError("")
                                formik.handleChange(e)
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
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
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/reset" style={styles.link}>
                                    {"Forgot password?"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/register" style={styles.link}>
                                    {"Register"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>

        </div>
    );
}






export default withRouter(SignIn)