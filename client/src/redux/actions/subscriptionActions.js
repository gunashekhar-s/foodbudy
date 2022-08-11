import axios from "axios"








export const asyncCreateSubscription = (data) => {
    return (dispatch) => {
        alert("here")

        axios.post("http://localhost:3040/user/subscription", data, {
            headers: {
                Authrization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data

            })
            .catch((err) => {
                console.log(err)
            })

    }
}