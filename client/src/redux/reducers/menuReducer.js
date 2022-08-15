import { cloneDeep } from "lodash";
import { INITIAL_MENU_UDPATE } from "../actions/menuActions";


const initialValue = {
    dates: [],
    newMenuList: [],
    isLoading: true,
    error: {
        message: ""
    }
}

const menuReducer = (state = initialValue, action) => {
    switch (action.type) {
        case INITIAL_MENU_UDPATE: {
            return cloneDeep({ ...state, isLoading: false, dates: action.payload.dates, newMenuList: action.payload.newMenuList, error: { message: "" } })
        }
        default:
            return cloneDeep(state)
    }
}


export default menuReducer