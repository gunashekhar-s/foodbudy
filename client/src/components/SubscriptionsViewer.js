import { Button, Divider, Grid, Toolbar, Typography } from "@mui/material"
import moment from "moment"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { asyncGetSubscriptions } from "../redux/actions/subscriptionActions"
import bgImage from "../images/bg.jpg"
const SubscriptionViewer = (props) => {
    const location = useLocation()
    const subscriptions = useSelector((state) => {
        if (location.pathname === "/") {
            return state.subscriptionsDetails.subscriptions.filter(subscirption => subscirption.paymentStatus === "success")
        } else {
            return state.subscriptionsDetails.subscriptions
        }
    })
    const history = useHistory()
    const styles = {
        internalBox: {
            display: "flex",
            flexGrow: 1,
            maxWidth: "md",
            align: "center",
            width: "100%",
            boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            borderRadius: "6px",
            p: 4,
            m: "auto",
            mt: 1,


        },
        buttonContainer: {
            alignItems: "center",
            justifyContent: "center",
            my: 1
        },
        subscriptionContainer: {
            mt: 2,
            p: 2,
            boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            borderRadius: "6px",
            // backgroundImage: `url(${bgImage})`
            backgroundImage: "linear-gradient(to right top, #e0b7c6, #deb4ce, #d8b3d8, #ceb3e3, #bdb5ee)"
            // backgroundColor: "#BDB5EE"
        },
        sections: {
            alignItems: "center",
            justifyContent: "left",
            mt: 1
        },
        addButton: {
            minWidth: "250px",
            minHeight: "40px",
            backgroundColor: "primary.main",
            '&:hover': {
                backgroundColor: 'primary.dark',
            }
        }
    }
    const dispatch = useDispatch()
    const subscriptionsDetails = useSelector((state) => {
        return state.subscriptionsDetails
    })
    useEffect(() => {
        if (subscriptionsDetails.isLoading) {
            dispatch(asyncGetSubscriptions())
        }
    }, [])

    const handleViewOrdersClick = (id) => {
        //TODO: orders page must be created and route
    }
    return (
        <>
            <Toolbar />
            <Grid container direction="column" sx={styles.internalBox}>
                <Grid display="flex" direction="row" container align="center" item sx={styles.buttonContainer}>
                    <Button variant="contained" size="regular" sx={styles.addButton} onClick={() => { history.push("/new_subscription") }}>Add New Subscription</Button>
                </Grid>
                {subscriptions.map(subscription => {
                    return (
                        <Grid display="flex" direction="row" container align="center" item sx={styles.subscriptionContainer} key={subscription._id}>

                            <Grid display="flex" direction="row" container align="center" item xs={12} md={4} sx={styles.sections}>
                                <Typography variant="h6">Subscription</Typography>
                            </Grid>
                            <Grid display="flex" direction="row" container align="center" item xs={12} md={4} sx={styles.sections}>
                                <Typography variant="">Date : {moment(subscription.createdAt).format("DD-MM-YYYY")} </Typography>
                            </Grid>
                            <Grid display="flex" direction="row" container align="center" item xs={12} md={4} sx={styles.sections}>
                                <Typography variant="">{`Amount : ₹​${subscription.finalAmount}`}</Typography>
                            </Grid>
                            <Divider sx={{ width: '100%', my: 1 }} />

                            <Grid display="flex" direction="row" container align="center" item xs={12} sx={styles.sections}>
                                <Typography >Meals : {subscription.mealsDetails.map(meal => `${meal.meals} x ${meal.quantity}`).join(", ")}</Typography>
                            </Grid>
                            <Grid display="flex" direction="row" container align="center" itemxs={12} sx={styles.sections}>
                                <Grid display="flex" direction="row" container align="center" item xs={12} md={6} >
                                    <Typography>Payment Status : <span style={{ color: subscription.paymentStatus === "success" ? "green" : "red" }}>{subscription.paymentStatus}</span> </Typography>
                                </Grid>
                                <Grid display="flex" direction="row" container item xs={12} md={6} justifyContent="right" sx={{ px: 2 }}>
                                    <Button variant="contained" size="small" onClick={() => { handleViewOrdersClick(subscription._id) }}>View Orders</Button>
                                </Grid>

                            </Grid>
                        </Grid>
                    )
                })}



            </Grid>

        </>
    )
}


export default SubscriptionViewer