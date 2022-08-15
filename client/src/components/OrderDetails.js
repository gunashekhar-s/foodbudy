import { useTheme } from '@emotion/react';
import moment from "moment"
import { Grid, TextField, FormControl, Divider, Toolbar, Typography, useMediaQuery, MenuItem, InputLabel, Select, Modal, Button } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded';
import DinnerDiningRoundedIcon from '@mui/icons-material/DinnerDiningRounded';
import BreakfastDiningRoundedIcon from '@mui/icons-material/BreakfastDiningRounded';
import { asyncGetCustomPlanDetails, asyncGetStartDateForSelectedPlan } from '../redux/actions/planActions';
import LoadingSpinner from './LoadingSpinner';
import AddressCard from './AddressCard';
import { asyncGetAddress } from '../redux/actions/addressAction';
import AddressForm from './AddressForm';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CustomBreadCrumbs from './CustomBreadCrumbs';
import { cloneDeep } from 'lodash';
import { asyncUpdatePreference } from '../redux/actions/preferenceAction';
import Swal from 'sweetalert2';
import { asyncCreateSubscription, asyncSubscriptionConfirmation } from '../redux/actions/subscriptionActions';
import Logo from "../images/logo.png"
import { toast } from 'react-toastify';
const style = {
    internalBox: {
        display: "flex",
        flexGrow: 1,
        maxWidth: "md",
        align: "center",
        width: "100%",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "6px",
        py: 4,
        px: 3,
        m: "auto",
        mt: 3
    },
    mealItem: {
        mt: 2,
        py: 3,
        px: 3,
        width: "100%",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "6px",
        minHeight: "200px",
        alignItems: "center",
        backgroundColor: "#F6F6F6"
    },
    totalContainer: {
        mt: 2,
        py: 3,
        px: 3,
        width: "100%",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "6px",
        minHeight: "40px",
        alignItems: "center",
        backgroundColor: "#F6F6F6"
    },
    modal: {
        overflow: "auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "md",
        width: "100%",
        bgcolor: "background.paper",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "6px",
        p: 4,
        my: 3
    }
}

function OrderDetails(props) {
    const history = useHistory()
    const theme = useTheme()
    const dispatch = useDispatch()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [startDates, setStartDates] = useState({})
    const [quantities, setQuantities] = useState({})
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
    const [selectedPlanDetails, setSelectedPlanDetails] = useState({})
    const [total, setTotal] = useState("")
    const [buttonClicked, setButtonClicked] = useState(false)

    // calculate total
    useEffect(() => {
        if (selectedPlanDetails._id && Object.keys(quantities).length > 0) {
            setTotal(selectedPlanDetails.days * (selectedPlanDetails.pricePerDay / selectedPlanDetails.mealSessions.length) * Object.values(quantities).reduce((a, b) => a + b))
        }
    }, [quantities, selectedPlanDetails.mealSessions])


    const preferenceDetails = useSelector((state) => {
        return state.preferenceDetails
    })
    const addressDetails = useSelector((state) => {
        return state.addressDetails
    })

    const planDetails = useSelector((state) => {
        return state.planDetails
    })

    const userId = useSelector((state) => {
        return state.userDetails.user._id
    })

    const mealSessions = useSelector((state) => {
        return state.restaurantDetails.mealSessions
    })

    const restaurantId = useSelector((state) => {
        return state.restaurantDetails._id
    })

    const preferenceId = useSelector((state) => {
        return state.preferenceDetails.preference._id
    })
    const userData = useSelector((state) => {
        return state.userDetails.user
    })

    useEffect(() => {
        dispatch(asyncGetCustomPlanDetails(preferenceId))
    }, [preferenceDetails])

    // selected plan changes, updating its data
    useEffect(() => {
        if (planDetails.plans.length > 0) {
            setSelectedPlanDetails(cloneDeep(planDetails.plans?.filter(plan => plan._id === planDetails.selectedPlanId)[0]))
        }
    }, [planDetails.plans])


    //fetch user address
    useEffect(() => {
        if (addressDetails.isLoading) {
            dispatch(asyncGetAddress(userId))
        }
    }, [addressDetails])

    // redirect to plans page on refresh
    useEffect(() => {
        if (!planDetails.selectedPlanId) {
            history.push("/plans")
        }
    }, [planDetails, history])

    // initial quantities for each meal
    useEffect(() => {
        if (Object.keys(selectedPlanDetails).length > 0) {
            let newQuantities = {}
            selectedPlanDetails?.mealSessions.forEach(meal => {
                newQuantities = { ...newQuantities, [meal]: 1 }
            })
            setQuantities(newQuantities)
        }
    }, [selectedPlanDetails])

    //start dates for each meal
    useEffect(() => {
        setStartDates({ ...planDetails.startDates })
    }, [planDetails.startDates])

    //fetch start dates for all meal sessions
    useEffect(() => {

        if (Object.keys(selectedPlanDetails).length > 0) {
            dispatch(asyncGetStartDateForSelectedPlan({ meals: selectedPlanDetails.mealSessions, restaurantId }))
        }
    }, [selectedPlanDetails.mealSessions])


    const handleMealDelete = (meal) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You'll be removing this meal from your plan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#541554',
            cancelButtonColor: '#626262',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const newMeals = selectedPlanDetails.mealSessions.filter(ele => ele !== meal)
                dispatch(asyncUpdatePreference(preferenceId, { mealSessions: newMeals }))
            }
        })

    }

    const handleChange = (value, meal) => {
        setStartDates({ ...startDates, [meal]: value.format("MM/DD/yyyy") })
    }

    const handleQuantityChange = (e, meal) => {
        const value = e.target.value
        setQuantities({ ...quantities, [meal]: value })
    }

    const handleAddressFormClick = () => {
        setIsAddressFormOpen(!isAddressFormOpen)
    }

    const handlePaymentClick = () => {
        setButtonClicked(true)
        const data = {
            selectedPlanId: planDetails.selectedPlanId,
            quantities,
            startDates,
            preferenceId,
            restaurantId,
            addressId: addressDetails.address._id
        }
        dispatch(asyncCreateSubscription(data, displayRazorpay))
    }

    //adding razorpay checkout script tag by creating element 
    const loadScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            document.body.appendChild(script)
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
        })
    }
    useEffect(() => {
        loadScript()
    }, [])
    const displayRazorpay = async (orderAmountInPaisa, order_id, subscriptionRef) => {
        const errorToast = (string) => {
            toast.error(string, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                width: "200"
            })
        }
        const successToast = (string) => {
            toast.success(string, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                width: "200"
            })
        }

        const res = await loadScript()

        if (!res) {
            console.log("razorpay load error")
        } else {
            const options = {
                "key": "",
                "amount": `${orderAmountInPaisa}`,
                "currency": "INR",
                "name": "FoodBuddy Inc.",
                "description": "New Subscription on FoodBuddy",
                "image": Logo,
                "order_id": `${order_id}`,
                "modal": {
                    "ondismiss": function () {
                        // on cancellation/failure redirect
                        history.push("/user/subscriptions")
                        errorToast("Payment Failed, Try Again")
                    }
                },
                "handler": function (response) {
                    //handle payment success
                    dispatch(asyncSubscriptionConfirmation({ subscriptionRef, orderAmountInPaisa, payment_id: response.razorpay_payment_id, order_id: response.razorpay_order_id, signature: response.razorpay_signature }, history, successToast))

                },
                "prefill": {
                    "name": userData.username,
                    "email": userData.email,
                },
                "notes": {
                    "address": "Head Office - Bangalore"
                },
                "theme": {
                    "color": "#541554"
                }
            };
            var rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                //handle payment failure
                // errorToast("Payment Failed, Try Again")
                // history.push("/user/subscriptions")
                // rzp1.close()
                // alert(response.error.code);
                // alert(response.error.description);
                // alert(response.error.source);
                // alert(response.error.step);
                // alert(response.error.reason);
                // alert(response.error.metadata.order_id);
                // alert(response.error.metadata.payment_id);
            });
        }
        rzp1.open();

    }


    const pathsBreadCrumb = [{ title: "Home", to: "/" }, { title: "Subscription & Preference", to: "/new_subscription" }, { title: "Plans", to: "/plans" }, { title: "Order Details", to: "/order_summary" }]

    // sorting meals based on time
    const sortedMeal = () => {
        const newArray = selectedPlanDetails.mealSessions.sort((a, b) => {
            const aTime = moment(mealSessions[a].start, 'HH:mm')
            const bTime = moment(mealSessions[b].start, 'HH:mm')
            if (aTime.isBefore(bTime)) {
                return -1
            }
            if (aTime.isAfter(bTime)) {
                return 1
            }
            return 0
        })
        return newArray
    }
    return (
        <Box>
            {
                (Object.keys(selectedPlanDetails).length > 0 && Object.keys(startDates).length > 0 && Object.keys(quantities).length > 0) ? (
                    <>
                        { }
                        <Toolbar />
                        <CustomBreadCrumbs paths={pathsBreadCrumb} />
                        <Grid>
                            <Grid item display="flex" direction="row" container sx={style.internalBox}>
                                <Grid item xs={12} >
                                    <Typography variant='h5' fontWeight="bold" color="text.primary" mb={2}>Order Details</Typography>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12} mt={3}>
                                    <Typography variant='h6' fontWeight="regular" color="text.secondary">Your Subscriptions</Typography>
                                </Grid>
                                {
                                    sortedMeal().map((meal, index) => {
                                        return (
                                            <Grid item xs={12} display="flex" direction="row" container sx={style.mealItem} align="center" key={index}>
                                                <Grid item xs={12} mb={2} >
                                                    <Grid display="flex" direction="row" container alignItems="center">
                                                        <Grid item><Typography variant='h5' mb={1}>{meal}</Typography></Grid>
                                                        <Grid item ml={1} > {meal === "Breakfast" ? <BreakfastDiningRoundedIcon sx={{ color: "text.secondary" }} /> : meal === "Lunch" ? <LunchDiningRoundedIcon sx={{ color: "text.secondary" }} /> : <DinnerDiningRoundedIcon sx={{ color: "text.secondary" }} />}
                                                        </Grid>
                                                    </Grid>

                                                    <Divider />
                                                </Grid>
                                                <Grid item xs={12} md={8} align="left">
                                                    <Typography variant='h6' fontWeight="regular">Subscription for {selectedPlanDetails.days} days | &#x20B9;{(selectedPlanDetails.pricePerDay / selectedPlanDetails.mealSessions.length) * quantities[meal] * selectedPlanDetails.days}</Typography>
                                                    <Typography variant='h6' fontWeight="regular">Starting from </Typography>
                                                    <Grid item my={2}>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            {isMobile ? (
                                                                <MobileDatePicker
                                                                    label="Date mobile"
                                                                    inputFormat="MM/DD/yyyy"
                                                                    minDate={moment(planDetails.startDates[meal])}
                                                                    value={moment(startDates[meal])}
                                                                    onChange={(value) => { handleChange(value, meal) }}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                />
                                                            ) : (
                                                                <DesktopDatePicker
                                                                    label="Date desktop"
                                                                    inputFormat="MM/DD/yyyy"
                                                                    minDate={moment(planDetails.startDates[meal])}
                                                                    value={moment(startDates[meal])}
                                                                    onChange={(value) => { handleChange(value, meal) }}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                />
                                                            )}
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} md={4} align="left" display="flex" direction="row" container alignItems="center" >
                                                    <Grid item xs={9}>
                                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                                            <InputLabel id="demo-select-small">Quantity</InputLabel>
                                                            <Select
                                                                labelId="demo-select-small"
                                                                id="demo-select-small"
                                                                value={quantities[meal]}
                                                                label="Quantity"
                                                                onChange={(e) => {
                                                                    handleQuantityChange(e, meal)
                                                                }}
                                                            >
                                                                <MenuItem value={1}>1</MenuItem>
                                                                <MenuItem value={2}>2</MenuItem>
                                                                <MenuItem value={3}>3</MenuItem>
                                                                <MenuItem value={4}>4</MenuItem>
                                                                <MenuItem value={5}>5</MenuItem>
                                                            </Select>

                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={3} align="right">{
                                                        selectedPlanDetails.mealSessions.length > 1 && (< DeleteRoundedIcon sx={{ color: "text.secondary", p: 0, m: 0, cursor: "pointer" }} onClick={() => { handleMealDelete(meal) }} />)
                                                    }</Grid>
                                                </Grid>
                                            </Grid>
                                        )
                                    })
                                }



                                {
                                    (addressDetails.error.message === "address doesn't exist") ? (
                                        <>
                                            {!isAddressFormOpen ? (
                                                <>
                                                    <Grid item xs={12} display="flex" direction="row" container sx={style.mealItem} align="center">
                                                        <Grid item xs={12} ><Typography>No Address Found</Typography></Grid>
                                                        <Grid item xs={12}>
                                                            <Button variant="contained" onClick={handleAddressFormClick}>Create Address</Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            ) : (
                                                <Modal open={isAddressFormOpen} onClose={handleAddressFormClick}>
                                                    <Box sx={style.modal}>
                                                        <AddressForm handleClose={handleAddressFormClick} />
                                                    </Box>
                                                </Modal>

                                            )}
                                        </>

                                    ) : (addressDetails.address._id && !isAddressFormOpen) ? (
                                        <Grid item xs={12} display="flex" direction="row" container sx={style.mealItem} align="center">
                                            <AddressCard handleClick={handleAddressFormClick} />
                                        </Grid>
                                    ) : isAddressFormOpen ? (
                                        <Modal open={isAddressFormOpen} onClose={handleAddressFormClick}>
                                            <Box sx={style.modal}>
                                                <AddressForm handleClose={handleAddressFormClick} />
                                            </Box>
                                        </Modal>

                                    ) : null
                                }
                                <Grid item xs={12} display="flex" direction="row" container sx={style.totalContainer} align="center">
                                    <Grid item xs={12} ><Typography variant='h5'>Total : {total} </Typography></Grid>
                                </Grid>

                                <Grid item xs={12} display="flex" direction="row" container align="center" alignItems="center" sx={{ mt: 3 }}>
                                    <Grid item xs={12}>
                                        <Button variant="contained" size="large" sx={{ width: "100%", maxWidth: "240px" }} onClick={handlePaymentClick} disabled={buttonClicked}>Make Payment</Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </>
                ) : (
                    <LoadingSpinner />
                )
            }


        </Box >
    )
}

export default OrderDetails;



