import { cloneDeep } from "lodash"
import { INITIAL_UPDATE_CUSINES } from "../actions/cuisineActions";
const initialValue = {
    cuisinesList: [],
    isLoading: true,
    error: {
        message: ""
    }
}

const cuisineReducer = (state = initialValue, action) => {
    switch (action.type) {
        case INITIAL_UPDATE_CUSINES: {
            return cloneDeep({ ...state, ...action.payload })
        }

        default:
            return cloneDeep(state)
    }
}


export default cuisineReducer