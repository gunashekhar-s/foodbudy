import { cloneDeep } from "lodash"
import { UPDATE_CUSTOM_PLANS, UPDATE_PLAN_START_DATES, UPDATE_SELECTED_PLAN_ID } from "../actions/planActions"



const initialValue = {
    plans: [],
    selectedPlanId: "",
    startDates: {}
}

const planReducer = (state = initialValue, action) => {
    switch (action.type) {
        case UPDATE_CUSTOM_PLANS: {
            return cloneDeep({ ...state, ...action.payload })
        }
        case UPDATE_SELECTED_PLAN_ID: {
            return cloneDeep({ ...state, selectedPlanId: action.payload })
        }
        case UPDATE_PLAN_START_DATES: {
            //no cloneDeep since it'll cause useEffect infinite loop (api call) in OrderDetails
            return { ...state, startDates: action.payload }
        }
        default: {
            return cloneDeep(state)
        }
    }
}

export default planReducer