import axios from "../../config/axios"

export const UPDATE_CUSTOM_PLANS = "UPDATE_CUSTOM_PLANS"
export const UPDATE_SELECTED_PLAN_ID = "UPDATE_SELECTED_PLAN_ID"
export const UPDATE_PLAN_START_DATES = "UPDATE_PLAN_START_DATES"

export const updateCustomPlans = (data) => {
    return {
        type: UPDATE_CUSTOM_PLANS,
        payload: data
    }
}

export const asyncGetCustomPlanDetails = (preferenceId, setIsLoading) => {
    return (dispatch) => {
        axios.get(`/user/plans/${preferenceId}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result.plans?.length > 0) {
                    const sortedPlans = result.plans.sort((x, y) => {
                        if (x.days < y.days) {
                            return -1
                        }
                        if (x.days > y.days) {
                            return 1
                        }
                        return 0
                    })
                    dispatch(updateCustomPlans({ plans: sortedPlans }))
                    setIsLoading && setIsLoading(false)
                } else {
                    console.log(result)
                    setIsLoading && setIsLoading(false)
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const updateSelectedPlanId = (id) => {
    return {
        type: UPDATE_SELECTED_PLAN_ID,
        payload: id
    }
}
export const updateStartDates = (dates) => {
    return {
        type: UPDATE_PLAN_START_DATES,
        payload: dates
    }
}

export const asyncGetStartDateForSelectedPlan = (data) => {
    return (dispatch) => {
        axios.post("/user/startDates", data, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then((response) => {
                const result = response.data
                if (result.message === "dates created") {
                    dispatch(updateStartDates(result.dates))
                } else {
                    console.log(result)
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }
}


