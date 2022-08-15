import axios from "../../config/axios"
export const UPDATE_LOGIN_STATUS = "UPDATE_LOGIN_STATUS"
export const UPDATE_USER_DETAILS = "UPDATE_USER_DETAILS"
export const LOGOUT_RESET = "LOGOUT_RESET"



export const loginToggle = () => {
    return {
        type: UPDATE_LOGIN_STATUS
    }
}

export const initialValueReset = () => {
    return {
        type: LOGOUT_RESET
    }
}

export const logoutToggle = () => {
    return (dispatch) => {
        dispatch(initialValueReset())
    }

}

export const updateUserDetails = (data) => {
    return {
        type: UPDATE_USER_DETAILS,
        payload: data
    }
}
//reset api calls
export const asyncResetSendOtp = (data, { setErrors, resetForm }, setIsLoading, setOtpSent, setCertificationKey, errorToast) => {

    return (dispatch) => {
        axios.post("/auth/sendotp", data)
            .then((response) => {
                const data = response.data
                console.log(data)
                if (data.error === "unable to send email") {
                    setIsLoading(false)
                    errorToast("Try Again Later")
                    resetForm()
                } else if (data.error && data.error.includes("email")) {
                    setErrors({ email: data.error })
                    setIsLoading(false)
                } else if (data.message === "otp sent") {
                    setOtpSent(true)
                    setIsLoading(false)
                    setCertificationKey(data.certificationKey)
                } else {
                    console.log(data)
                    setIsLoading(false)
                    setOtpSent(false)
                    errorToast("Try Again Later")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const asyncResetVerifyOtp = (data, { setErrors, resetForm }, errorToast, setOtpSent, successToast, redirect) => {
    return (dispatch) => {
        axios.post("/auth/verify", data)
            .then((response) => {
                const data = response.data
                console.log(data)
                if (data.error === "Invalid OTP") {
                    setErrors({ otp: data.error })
                } else if (data.error === "Invalid Certification Key") {
                    errorToast("Invalid Request")
                    resetForm()
                    setOtpSent(false)
                } else if (data.error && data.error.includes("OTP")) {
                    errorToast("Invalid Request")
                    resetForm()
                    setOtpSent(false)
                } else if (data.error === "Invalid verificationfor value") {
                    errorToast("Invalid Request")
                    resetForm()
                    setOtpSent(false)
                }
                else if (data.message === "password changed") {
                    successToast("Password Reset Successful")
                    resetForm()
                    setOtpSent(false)
                    redirect()
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }
}

//login api call
export const asyncAuthLogin = (data, setError, history) => {
    return (dispatch) => {
        axios.post("/auth/login", data)
            .then((response) => {
                const data = response.data
                if (data.error) {
                    setError(data.error)
                } else if (data.token) {
                    localStorage.setItem("token", data.token)
                    history.push("/")
                    dispatch(loginToggle())
                } else {
                    console.log(data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

}

//register api calls
export const asyncGenerateRegisterOtp = (newData, { setErrors, resetForm }, setIsLoading, setCertificationKey, errorToast, setOtpSent) => {
    return (dispatch) => {

        axios.post("/auth/sendotp", newData)
            .then((response) => {
                const result = response.data
                if (result.error === "unable to send email") {
                    setIsLoading(false)
                    errorToast("Try Again Later")
                    resetForm()
                } else if (result.error && result.error.includes("email")) {
                    setErrors({ email: result.error })
                    setIsLoading(false)
                } else if (result.message === "otp sent") {
                    setOtpSent(true)
                    setIsLoading(false)
                    setCertificationKey(result.certificationKey)
                } else {
                    console.log(result)
                    setIsLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const asyncVerifyRegisterOtp = (newData, { setErrors, resetForm }, errorToast, successToast, setOtpSent, history, continueFormReset) => {
    return (dispatch) => {
        axios.post("/auth/verify", newData)
            .then((response) => {
                const result = response.data
                if (result.error === "OTP cannot be empty") {
                    setErrors({ otp: result.error })
                } else if (result.error === "Invalid OTP") {
                    setErrors({ otp: result.error })
                } else if (result.error === "OTP already used or verified" || result.error === "OTP was not sent for this request" || result.error === "OTP Expired") {
                    resetForm()
                    errorToast(result.error)
                    setOtpSent(false)
                    continueFormReset()
                } else if (result.message === "registered") {
                    successToast("Registered Successfully")
                    resetForm()
                    setOtpSent(false)
                    continueFormReset()
                    history.push("/login")
                }
                else {
                    console.log(result)
                    resetForm()
                    errorToast("Try Again Later!")
                    setOtpSent(false)
                    continueFormReset()
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

// fetch user data - post login
export const asyncGetUserDetails = (history) => {
    return (dispatch) => {
        axios.get("/user/account", {
            headers: {
                'Authorization': localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result._id) {
                    dispatch(loginToggle())
                    dispatch(updateUserDetails(result))
                    // dispatch(asyncGetUserPreference(result._id))
                    // dispatch(asyncGetAddress(result._id))

                } else if (result.error === "invalid user id") {
                    localStorage.removeItem("token")
                    dispatch(logoutToggle())
                    history.push("/login")

                }
            })
            .catch((err) => {
                console.log("in error")
                if (err.response?.status === 401) {
                    localStorage.removeItem("token")
                    dispatch(logoutToggle())
                    history.push("/login")
                } else {
                    console.log(err)
                }
            })
    }
}

//api call - update user account details
export const asyncUpdateUserDetails = (data, setIsEdit, resetForm, succestoast) => {
    return (dispatch) => {
        axios.post("/user/update", data, {
            headers: {
                'Authorization': localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result.message === "user details updated") {
                    dispatch(updateUserDetails(result.user))
                    resetForm()
                    setIsEdit(false)
                    succestoast("Details Updated!")
                } else {
                    console.log(result)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}