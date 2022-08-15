import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { asyncGetUserPreference } from "../redux/actions/preferenceAction"
import LoadingSpinner from "./LoadingSpinner"
import NewPreference from "./NewPreference"
import SubscriptionDetails from "./SubscriptionDetails"


const SubscriptionConatiner = (props) => {
    const dispatch = useDispatch()

    const preference = useSelector((state) => {
        return state.preferenceDetails
    })
    const userId = useSelector((state) => {
        return state.userDetails.user._id
    })

    useEffect(() => {
        if (preference.isLoading) {
            dispatch(asyncGetUserPreference(userId))
        }
    }, [])


    return (
        <>
            {
                !preference.isLoading ? (
                    <>
                        {
                            preference.error.message ? (
                                <NewPreference />
                            ) : (
                                <SubscriptionDetails />
                            )
                        }

                    </>
                )
                    : (
                        <LoadingSpinner />
                    )
            }
        </>
    )
}

export default SubscriptionConatiner