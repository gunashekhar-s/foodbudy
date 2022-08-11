import { Breadcrumbs, Button, CardActions, CardContent, Grid, Toolbar, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useHistory, useLocation } from "react-router-dom"
import { asyncGetCustomPlanDetails, updateSelectedPlanId } from "../redux/actions/planActions"
import { asyncGetUserPreference } from "../redux/actions/preferenceAction"
import HomeIcon from '@mui/icons-material/Home';
import CustomBreadCrumbs from "./CustomBreadCrumbs"


const style = {
    internalBox: {
        display: "flex",
        flexGrow: 1,
        maxWidth: "md",
        align: "center",
        width: "100%",
        p: 5,
        m: "auto",
        mt: 2
    },
    card: {
        width: "100%",
        minHeight: "340px",
        border: "1px solid #541554",
        borderRadius: "18px",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        backgroundColor: "#F6F6F6",
        color: "black",
    },
    button: {
        minHeight: "40px",
        mt: 2,
        alignItems: "center",

        backgroundColor: "primary.main",
        color: "white",
        "&:hover": {
            backgroundColor: "primary.main",
            color: "white",


        },
        mx: 2
    },

}
const ViewPlans = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const history = useHistory()
    const dispatch = useDispatch()
    const userId = useSelector((state) => {
        return state.userDetails.user._id
    })
    const preference = useSelector((state) => {
        return state.preferenceDetails.preference
    })

    const plans = useSelector((state) => {
        return state.planDetails.plans
    })


    //fetch preference if not found and plans based on preference
    useEffect(() => {
        if (preference._id) {
            dispatch(asyncGetCustomPlanDetails(preference._id, setIsLoading))
        } else {
            dispatch(asyncGetUserPreference(userId))
        }
    }, [preference, dispatch])


    const handlePlanSelect = (id) => {
        dispatch(updateSelectedPlanId(id))
        history.push("/order_summary")
    }

    const pathsBreadCrumb = [{ title: "Home", to: "/" }, { title: "Subscription & Preference", to: "/new_subscription" }, { title: "Plans", to: "/plans" }]

    return (
        <Box>
            {
                !isLoading && (
                    <>
                        <Toolbar />
                        <Grid>
                            <CustomBreadCrumbs paths={pathsBreadCrumb} />
                            <Grid display="flex" direction="row" container sx={style.internalBox} align="center" item >
                                {
                                    plans.map((plan, index) => {
                                        return (
                                            <Grid item xs={12} md={4} key={index} p={1} >
                                                <Grid sx={style.card}>
                                                    <CardContent >
                                                        <Typography sx={{ fontSize: 14 }} gutterBottom mt={3} align="left" ml={3} color="text.primary" >
                                                            Per Day
                                                        </Typography>
                                                        <Typography variant="h3" fontWeight="bold" component="div" mt={2} mb={1} >
                                                            &#x20B9;{plan.pricePerDay}
                                                        </Typography>
                                                        <Typography fontSize={20} fontWeight="bold" mb={1} color="text.secondary">
                                                            {`for ${plan.days} Days`}
                                                        </Typography>
                                                        <Typography fontSize={16} fontWeight="bold" color="text.primary">
                                                            {plan.description}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions display="flex" direction="row" align="center" mt={2} >
                                                        <Button sx={style.button} fullWidth fontSize={18} fontWeight="bold" onClick={() => { handlePlanSelect(plan._id) }}>Select Plan</Button>
                                                    </CardActions>
                                                </Grid>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>
                    </>
                )
            }
        </Box >
    )
}

export default ViewPlans