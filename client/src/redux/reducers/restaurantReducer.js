import { cloneDeep } from "lodash";
import { INITIAL_UPDATE_RESTAURANT_DETAILS } from "../actions/restaurantActions";

const initialValue = {
    isLoading: true,
    error: {
        message: ""
    },


}

const restaurantReducer = (state = initialValue, action) => {
    switch (action.type) {
        case INITIAL_UPDATE_RESTAURANT_DETAILS:
            {
                return cloneDeep({ ...state, ...action.payload })
            }

        default:
            return state
    }
}

export default restaurantReducer