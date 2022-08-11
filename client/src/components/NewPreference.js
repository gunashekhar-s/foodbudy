import { Button, Divider, Grid, Toolbar, Typography, useMediaQuery } from "@mui/material"
import { Box } from "@mui/system"
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { asyncCreateNewPreference, asyncUpdatePreference } from "../redux/actions/preferenceAction";




const NewPreference = (props) => {
    const { isEdit, handleClose } = props

    const preference = useSelector((state) => {
        return state.preferenceDetails.preference
    })
    const cuisines = useSelector((state) => {
        return state.cuisines.cuisinesList
    })
    const dispatch = useDispatch()
    const userRef = useSelector((state) => {
        return state.userDetails.user._id
    })
    useEffect(() => {
        //if cuisnes has only one, select this by default
        if (cuisines.length === 1) {
            setSelectedCuisine(cuisines[0])
        }
    }, [cuisines])

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const style = {
        internalBox: {
            display: "flex",
            flexGrow: 1,
            maxWidth: "md",
            align: "center",
            width: "100%",
            boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            borderRadius: "6px",
            minHeight: "400px",
            p: 5,
            m: "auto"

        },
        button: {
            px: 2,
            py: 1,
            minHeight: "30px",
            minWidth: "140px",
            borderRadius: "25px",
            "&:hover": {
                //effects should be disabled on touch devices
                backgroundColor: "#DDDDDD",
                color: "text.primary",
                boxShadow: "none"
            },
            mt: 1,
            boxShadow: "none",
            ":disabled": {
                backgroundColor: "warning.light",
                color: "white"
            }
            // ...(isMobile && { mt: 1 })
        }
    }

    const mealSessions = useSelector((state) => {
        const meals = state.restaurantDetails.mealSessions
        if (meals) {
            const newMeals = []
            for (let meal in meals) {
                if (meals[meal].accepting === true) {
                    newMeals.push(meal)
                }
            }
            return newMeals


        } else {
            return []
        }
    })

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const [selectedMealSessions, setSelectedMealSessions] = useState(isEdit ? preference.mealSessions : [])
    const [isVeg, setIsVeg] = useState(isEdit ? preference.isVeg : false)
    const [vegDays, setVegDays] = useState(isEdit ? preference.vegDays : [])
    const [selectedCuisine, setSelectedCuisine] = useState(isEdit ? preference.cuisineRef : {})
    const [errors, setErrors] = useState({ meal: "", cuisine: "" })

    const handleMealsSessionChange = (e) => {
        const value = e.target.value
        setErrors({ meal: "" })
        if (selectedMealSessions.includes(value)) {
            const newSessions = selectedMealSessions.filter(meal => meal !== value)
            setSelectedMealSessions(newSessions)
        } else {
            const newSessions = [...selectedMealSessions, value]
            setSelectedMealSessions(newSessions)
        }
    }
    const handleVegDaysChange = (e) => {
        const value = e.target.value
        if (vegDays.includes(value)) {
            const newVegDays = vegDays.filter(day => day !== value)
            setVegDays(newVegDays)
        } else {
            const newVegDays = [...vegDays, value]
            setVegDays(newVegDays)
        }
    }
    const handleProteinPreferenceChange = (e) => {
        if (e.target.value === "Vegetarian") {
            setIsVeg(true)
            setVegDays([...weekDays])

        } else {
            setIsVeg(false)
            setVegDays([])
        }
    }
    const handleCuisineChange = (e) => {
        setErrors({ cuisine: "" })
        const newCuisine = cuisines.filter(cuisine => cuisine.title === e.target.value)
        setSelectedCuisine(newCuisine[0])
    }

    const handleSubmit = () => {
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
        if (selectedMealSessions.length === 0) {
            setErrors({ meal: "error" })
            errorToast("Select Meal")
        } else if (Object.keys(selectedCuisine).length === 0) {
            setErrors({ cuisine: "error" })
            errorToast("Select Cuisine")
        } else {

            const data = {
                mealSessions: selectedMealSessions,
                isVeg,
                vegDays,
                cuisineRef: selectedCuisine._id,
                userRef
            }
            //dispatch here
            if (isEdit) {
                dispatch(asyncUpdatePreference(preference._id, data, successToast, handleClose))
            } else {
                dispatch(asyncCreateNewPreference(data, successToast))
            }


        }
    }
    return (
        <>
            <Toolbar />
            <Box sx={{ display: "flex", width: "100%", height: "80vh", p: 2 }}>
                <Grid sx={style.internalBox}
                    direction="column"
                    container
                >
                    <Grid display="flex" direction="row" container justifyContent="space-around" alignItems="center" color="text-primary" mb={3} >
                        <Grid item>
                            <Typography variant="h4" align={isMobile ? "center" : "inherit"} >Food Preferences</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Grid display="flex" direction="row" container justifyContent="space-around" alignItems="center" sx={{ mt: 2, mb: 2 }} >
                        <Grid item xs={10} md={6}  >
                            <Typography variant="h6" align={isMobile ? "center" : "inherit"} alignItems="center">
                                Food Delivery Session
                            </Typography>
                        </Grid>
                        <Grid item m="auto" xs={10} md={6} sx={{ borderRadius: "8px", border: errors.meal ? "1px red solid" : "none" }} >
                            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                                {
                                    mealSessions.map((ele, index) => {
                                        return (
                                            < Grid item key={index} > <Button variant="contained" sx={{ ...style.button, color: selectedMealSessions.includes(ele) ? "white" : "text.primary", backgroundColor: selectedMealSessions.includes(ele) ? "warning.light" : "#F0F0F0" }} onClick={handleMealsSessionChange} value={ele}> {ele}</Button></Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2, mb: 2 }} />

                    <Grid display="flex" direction="row" container justifyContent="space-around" alignItems="center" sx={{ mt: 2, mb: 2 }} >
                        <Grid item xs={10} md={6}  >
                            <Typography variant="h6" align={isMobile ? "center" : "inherit"}>
                                Protein Preference
                            </Typography>
                        </Grid>
                        <Grid item m="auto" xs={10} md={6} >
                            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                                < Grid item > <Button variant="contained" sx={{ ...style.button, color: isVeg ? "text.primary" : "white", backgroundColor: isVeg ? "#F0F0F0" : "#F04F5F" }} onClick={handleProteinPreferenceChange} value="Non Vegetarian"> Non Vegetarian</Button></Grid>
                                < Grid item > <Button variant="contained" sx={{ ...style.button, color: isVeg ? "white" : "text.primary", backgroundColor: isVeg ? "#3AB757" : "#F0F0F0" }} onClick={handleProteinPreferenceChange} value="Vegetarian"> Vegetarian</Button></Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2, mb: 2 }} />

                    {!isVeg && (
                        <>
                            <Grid display="flex" direction="row" container justifyContent="space-around" alignItems="center" sx={{ mt: 2, mb: 2 }} >
                                <Grid item xs={10} md={6}  >
                                    <Typography variant="h6" align={isMobile ? "center" : "inherit"}>
                                        Vegetarian Days
                                    </Typography>
                                </Grid>
                                <Grid item m="auto" xs={10} md={6} >
                                    <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                                        {
                                            weekDays.map((ele, index) => {
                                                return (
                                                    < Grid item key={index} > <Button variant="contained" sx={{ ...style.button, color: vegDays.includes(ele) ? "white" : "text.primary", backgroundColor: vegDays.includes(ele) ? "#3AB757" : "#F0F0F0" }} onClick={handleVegDaysChange} value={ele} disabled={isVeg ? true : false}> {ele}</Button></Grid>
                                                )
                                            })
                                        }

                                    </Grid>

                                </Grid>

                            </Grid>
                            <Divider sx={{ mt: 2, mb: 2 }} />
                        </>
                    )}

                    <Grid display="flex" direction="row" container justifyContent="space-around" alignItems="center" sx={{ mt: 2, mb: 2 }} >
                        <Grid item xs={10} md={6}  >
                            <Typography variant="h6" align={isMobile ? "center" : "inherit"}>
                                Cuisine Preference
                            </Typography>
                        </Grid>
                        <Grid item m="auto" xs={10} md={6} sx={{ borderRadius: "8px", border: errors.cuisine ? "1px red solid" : "none" }}>
                            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                                {
                                    cuisines.map((ele, index) => {
                                        return (
                                            < Grid item key={index} > <Button variant="contained" sx={{ ...style.button, color: selectedCuisine.title === ele.title ? "white" : "text.primary", backgroundColor: selectedCuisine.title === ele.title ? "warning.light" : "#F0F0F0" }} onClick={handleCuisineChange} value={ele.title}> {ele.title}</Button></Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid display="flex" direction="row" container mt={4}>
                        <Box m="auto" sx={{ width: "200px", mt: 3 }}>
                            <Button variant="contained" sx={{ minHeight: "45px", backgroundColor: "primary.main" }} fullWidth onClick={handleSubmit}> Continue </Button>
                        </Box>
                    </Grid>

                </Grid>
            </Box >
        </>



    )
}

export default NewPreference