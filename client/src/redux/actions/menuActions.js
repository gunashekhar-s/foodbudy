import axios from "../../config/axios"

export const INITIAL_MENU_UDPATE = "INITIAL_MENU_UDPATE"

export const initialUpdateMenu = (data) => {
    return {
        type: INITIAL_MENU_UDPATE,
        payload: data
    }
}
export const asyncGetInitialMenu = (id) => {
    return (dispatch) => {
        axios.get(`/user/menu/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result.dates) {
                    dispatch(initialUpdateMenu(result))
                } else {
                    console.log(result)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}