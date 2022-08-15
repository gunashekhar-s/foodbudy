import axios from "../../config/axios"
export const INITIAL_UPDATE_PREFERENCE = "INITIAL_UPDATE_PREFERENCE"
export const UPDATE_PREFERENCE_ERROR = "UPDATE_PREFERENCE_ERROR"





export const initialUpdatePreference = (data) => {
    return {
        type: INITIAL_UPDATE_PREFERENCE,
        payload: data
    }
}

export const updateError = (error) => {
    return {
        type: UPDATE_PREFERENCE_ERROR,
        payload: error
    }
}


export const asyncCreateNewPreference = (data, successToast) => {
    return (dispatch) => {
        axios.post("/user/preference", data, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result.message === "preference created") {
                    successToast("Preference Created")
                    dispatch(initialUpdatePreference(result.preference))
                } else {
                    console.log(result)
                }

            })
            .catch((err) => {
                alert("here")
                console.log(err)
            })
    }
}

export const asyncUpdatePreference = (id, data, successToast, handleClose) => {
    return (dispatch) => {
        axios.put(`/user/preference/${id}`, data, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result.message === "preference updated") {
                    console.log("preference", result.preference)
                    successToast && successToast("Preference Updated")
                    dispatch(initialUpdatePreference(result.preference))
                    handleClose && handleClose()
                } else {
                    console.log(result)
                    handleClose && handleClose()
                }

            })
            .catch((err) => {
                console.log(err)
                handleClose && handleClose()
            })
    }
}




export const asyncGetUserPreference = (id) => {
    return (dispatch) => {
        axios.get(`/user/preference/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result._id) {
                    dispatch(initialUpdatePreference(result))
                } else if (result.error === "preference doesn't exist") {
                    dispatch(updateError({ message: result }))
                } else {
                    console.log(result)
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }
}