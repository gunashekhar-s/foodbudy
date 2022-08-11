import axios from "axios"
import { toast } from "react-toastify"

export const INITIAL_UPDATE_RESTAURANT_DETAILS = "INITIAL_UPDATE_RESTAURANT_DETAILS"

export const initialUpdateRestaurantDetails = (data) => {
    return {
        type: INITIAL_UPDATE_RESTAURANT_DETAILS,
        payload: data
    }
}

export const asyncgetRestaurantDetails = () => {
    return (dispatch) => {
        axios.get("http://localhost:3040/public/restaurant")
            .then((response) => {
                const result = response.data
                dispatch(initialUpdateRestaurantDetails({ ...result, isLoading: false, error: { message: "" } }))
            })
            .catch((err) => {
                if (err.message === "Network Error") {
                    dispatch(initialUpdateRestaurantDetails({ error: { message: "Internal Server Error" } }))
                    toast.error("Internal Server Error, Try Again Later")
                }
                console.log(err)
            })
    }
}