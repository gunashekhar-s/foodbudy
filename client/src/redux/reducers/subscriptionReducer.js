const { INITIAL_UPDATE_SUBSCRIPTIONS, ADD_NEW_SUBSCRIPTION, UPDATE_SUBSCRIPTION_PAYMENT_STATUS } = require("../actions/subscriptionActions");




const initialValues = {
    isLoading: true,
    error: {
        message: ""
    },
    subscriptions: []
}


const subscriptionReducer = (state = initialValues, action) => {
    switch (action.type) {
        case INITIAL_UPDATE_SUBSCRIPTIONS: {
            return { ...state, isLoading: false, error: { message: "" }, subscriptions: [...action.payload] }
        }
        case ADD_NEW_SUBSCRIPTION: {
            return { ...state, subscriptions: [{ ...action.payload }, ...state.subscriptions] }
        }
        case UPDATE_SUBSCRIPTION_PAYMENT_STATUS: {
            const newArray = state.subscriptions.map(sub => {
                if (sub._id === action.payload) {
                    sub.paymentStatus = "success"
                    return sub
                }
                return sub
            })
            return { ...state, subscriptions: newArray }
        }

        default:
            return state
    }
}

export default subscriptionReducer