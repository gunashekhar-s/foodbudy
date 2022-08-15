import Axios from "axios"
import axios from "../../config/axios"
export const UPDATE_NEW_ADDRESS = "UPDATE_NEW_ADDRESS"
export const UPDATE_ADDRESS_ERROR = "UPDATE_ADDRESS_ERROR"

export const asyncgetDetailsByPincode = (pincode, updator) => {
    return (dispatch) => {
        Axios.get(`http://postalpincode.in/api/pincode/${pincode}`)
            .then((response) => {
                const result = response.data
                if (result.Status === "Error") {
                    updator("", "", "Invalid Pincode")
                } else if (result.Status === "Success") {

                    const state = result.PostOffice[0].State
                    const city = result.PostOffice[0].District
                    updator(city, state, "")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}


export const updateAddress = (data) => {
    return {
        type: UPDATE_NEW_ADDRESS,
        payload: data
    }
}


export const asyncCreateAddress = (data, notify, handleClose) => {
    return (dispatch) => {
        axios.post("/user/address", data, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {

                const result = response.data
                if (result.message === "address created") {
                    dispatch(updateAddress(result.address))
                    notify("Address Saved")
                    handleClose()
                } else if (result.message === "address updated") {
                    dispatch(updateAddress(result.address))
                    notify("Address Updated")
                    handleClose()
                } else {
                    //handle server side errors(field error etc>..)
                    console.log(result)
                    handleClose()
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const updateAddressError = (errorMessage) => {
    return {
        type: UPDATE_ADDRESS_ERROR,
        payload: errorMessage
    }
}

export const asyncGetAddress = (id) => {
    return (dispatch) => {
        axios.get(`user/address/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {

                const result = response.data
                if (result.address?._id) {
                    dispatch(updateAddress(result.address))
                } else if (result.error === "address doesn't exist") {
                    dispatch(updateAddressError(result.error))
                }


            })
            .catch((err) => {
                console.log(err)
            })
    }
}
