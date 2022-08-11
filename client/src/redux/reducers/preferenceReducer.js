import { cloneDeep } from "lodash";
import { INITIAL_UPDATE_PREFERENCE, UPDATE_PREFERENCE_ERROR } from "../actions/preferenceAction";
import { LOGOUT_RESET } from "../actions/userActions";
const initialValue = {
    preference: {},
    isLoading: true,
    error: {
        message: ""
    }
}

const preferenceReducer = (state = initialValue, action) => {
    switch (action.type) {
        case INITIAL_UPDATE_PREFERENCE: {
            return cloneDeep({ ...state, preference: action.payload, isLoading: false, error: { message: "" } })
        }
        case UPDATE_PREFERENCE_ERROR: {
            return cloneDeep({ ...state, error: action.payload, isLoading: false })
        }
        case LOGOUT_RESET: {
            return cloneDeep(initialValue)
        }

        default:
            return state
    }
}

export default preferenceReducer