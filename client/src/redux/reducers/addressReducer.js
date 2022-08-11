import { cloneDeep } from "lodash";
import { UPDATE_ADDRESS_ERROR, UPDATE_NEW_ADDRESS } from "../actions/addressAction";
import { LOGOUT_RESET } from "../actions/userActions";


const initialValue = {
    //error required* - based on its value making api call in address component
    error: {
        message: ""
    },
    isLoading: true,
    address: {}
}


const addressReducer = (state = initialValue, action) => {
    switch (action.type) {
        case UPDATE_NEW_ADDRESS: {
            return cloneDeep({ ...state, address: action.payload, error: { message: "" }, isLoading: false })
        }
        case UPDATE_ADDRESS_ERROR: {
            return cloneDeep({ ...state, error: { message: action.payload }, isLoading: false })
        }
        case LOGOUT_RESET: {
            return cloneDeep(initialValue)
        }
        default:
            return cloneDeep(state)
    }
}

export default addressReducer