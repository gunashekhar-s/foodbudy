import axios from "axios"

export const INITIAL_UPDATE_CUSINES = "INITIAL_UPDATE_CUSINES"

export const initialUpdateCuisines = (data) => {
    return {
        type: INITIAL_UPDATE_CUSINES,
        payload: data
    }
}

export const asyncGetCuisines = () => {
    return (dispatch) => {
        axios.get("http://localhost:3040/public/cuisines")
            .then((response) => {
                const result = response.data
                if (Array.isArray(result)) {
                    dispatch(initialUpdateCuisines({ cuisinesList: [...result], isLoading: false, error: { message: "" } }))
                } else {
                    console.log(result)
                }
            })
            .catch((err) => {
                if (err.message === "Network Error") {
                    dispatch(initialUpdateCuisines({ error: { message: "Internal Server Error" } }))
                }
                console.log(err)
            })
    }
}