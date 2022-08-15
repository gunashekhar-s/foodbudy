import { Button, Grid, Toolbar } from "@mui/material"
import { Box, } from "@mui/system"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import banner from "../images/home_banner.png"
import { asyncGetSubscriptions } from "../redux/actions/subscriptionActions"
import LoadingSpinner from "./LoadingSpinner"
import SubscriptionViewer from "./SubscriptionsViewer"
const style = {
    img: {
        maxWidth: "100%",
        height: "auto",
        padding: "0",
        margin: "0"
    },
    button: {
        backgroundColor: "warning.dark",
        color: "white",
        minWidth: "250px",
        '&:hover': {
            backgroundColor: 'warning.dark',
        }
    },
    link: {
        color: "inherit",
        textDecoration: "none"
    }
}


const Home = (props) => {
    const isUserLoggedin = useSelector((state) => {
        return state.userDetails.isUserLoggedIn
    })
    const isLoading = useSelector((state) => {
        return state.subscriptionsDetails.isLoading
    })
    const subscriptions = useSelector((state) => {
        return state.subscriptionsDetails.subscriptions
    })
    const dispatch = useDispatch()
    useEffect(() => {

        if (isUserLoggedin) {
            dispatch(asyncGetSubscriptions())
        }
    }, [dispatch, isUserLoggedin])

    return (
        <Box>
            <Toolbar />
            {
                isUserLoggedin ? (<>
                    {
                        !isLoading ? (
                            subscriptions.length > 0 ? (<SubscriptionViewer />)
                                : (<Grid>
                                    <div >
                                        <img src={banner} alt="banner" width="100%" />
                                        <Grid
                                            container
                                            spacing={0}
                                            direction="column"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Link to="/new_subscription" style={style.link}>
                                                <Button variant="contained" sx={style.button}>
                                                    GET STARTED
                                                </Button>
                                            </Link>
                                            <Grid item >

                                            </Grid>

                                        </Grid>
                                    </div>
                                </Grid>)
                        ) : (
                            <LoadingSpinner />
                        )
                    }
                </>
                )
                    : (
                        <Grid>
                            <div >
                                <img src={banner} alt="banner" width="100%" />
                                <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Link to="/new_subscription" style={style.link}>
                                        <Button variant="contained" sx={style.button}>
                                            GET STARTED
                                        </Button>
                                    </Link>
                                    <Grid item >

                                    </Grid>

                                </Grid>
                            </div>
                        </Grid>
                    )
            }

        </Box >

    )
}


export default Home