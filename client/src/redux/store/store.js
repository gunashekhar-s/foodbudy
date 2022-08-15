import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import addressReducer from "../reducers/addressReducer"
import cuisineReducer from "../reducers/cuisineReducer"
import menuReducer from "../reducers/menuReducer"
import planReducer from "../reducers/planReducer"
import preferenceReducer from "../reducers/preferenceReducer"
import restaurantReducer from "../reducers/restaurantReducer"
import subscriptionReducer from "../reducers/subscriptionReducer"
import userReducer from "../reducers/userReducer"

const configureStore = () => {
    const store = createStore(combineReducers({
        userDetails: userReducer,
        cuisines: cuisineReducer,
        restaurantDetails: restaurantReducer,
        preferenceDetails: preferenceReducer,
        menuDetails: menuReducer,
        planDetails: planReducer,
        addressDetails: addressReducer,
        subscriptionsDetails: subscriptionReducer
    }), applyMiddleware(thunk))
    return store
}


export default configureStore