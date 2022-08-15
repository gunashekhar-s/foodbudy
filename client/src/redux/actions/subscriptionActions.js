import axios from "../../config/axios"


export const INITIAL_UPDATE_SUBSCRIPTIONS = "INITIAL_UPDATE_SUBSCRIPTIONS"
export const ADD_NEW_SUBSCRIPTION = "ADD_NEW_SUBSCRIPTION"
export const UPDATE_SUBSCRIPTION_PAYMENT_STATUS = "UPDATE_SUBSCRIPTION_PAYMENT_STATUS"

export const initialUpdateSubscriptions = (data) => {
    return {
        type: INITIAL_UPDATE_SUBSCRIPTIONS,
        payload: data
    }
}

export const asyncGetSubscriptions = () => {
    return (dispatch) => {
        axios.get("/user/subscriptions", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                dispatch(initialUpdateSubscriptions(result.subscriptions ? result.subscriptions : []))
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const addNewSubscription = (data) => {
    return {
        type: ADD_NEW_SUBSCRIPTION,
        payload: data
    }
}

export const asyncCreateSubscription = (data, displayRazorpay) => {

    return (dispatch) => {
        axios.post("/user/subscription", data, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                //on success 
                if (result.message === "subscription created") {
                    const subscription = result.subscription
                    dispatch(addNewSubscription(subscription))
                    displayRazorpay(subscription.orderAmountInPaisa, subscription.orderId, subscription._id)
                } else {
                    //handle error here
                    console.log(result)
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }
}

export const updatePayemntStatus = (subscriptionId) => {
    return {
        type: UPDATE_SUBSCRIPTION_PAYMENT_STATUS,
        payload: subscriptionId
    }
}


export const asyncSubscriptionConfirmation = (data, history, successToast) => {
    return (dispatch) => {
        axios.post("/user/subscription/payment", data, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result.message === "payment created") {
                    //after payment verification and ceration
                    dispatch(updatePayemntStatus(result.payment.subscriptionRef))
                    history.push("/")
                    successToast("Payment Successful")
                } else {
                    //handle other errors here
                    console.log(result)
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }
}