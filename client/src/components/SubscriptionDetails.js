import moment from "moment"
import { flattenDeep, cloneDeep } from "lodash";
import { Toolbar, Box, Grid, Typography, Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useEffect, useState } from "react";
import { asyncGetInitialMenu } from "../redux/actions/menuActions";
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import { Modal } from '@mui/material';
import NewPreference from "./NewPreference";
import { useHistory } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner";
import CustomBreadCrumbs from "./CustomBreadCrumbs";

const style = {
    internalBox: {
        display: "flex",
        flexGrow: 1,
        maxWidth: "md",
        align: "center",
        width: "100%",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "6px",
        p: 5,
        m: "auto",
        mt: 1
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
    },
    dateElement: {
        alignItems: "center",
        justifyContent: "center",
        minWidth: "70px",
        minHeight: "70px",
        borderRadius: "8px",
        p: 0,
        mx: 1,
        cursor: "pointer"

    },
    dateGridContainer: {
        maxWidth: "100%",
        overflow: "auto",
        mt: 2,
    },
    foodPreferenceContainer: {
        mt: 2,
        p: 2,
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "6px",
    },
    menuDetailsContainer: {
        mt: 3,
        p: 2,
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "6px",
    },
    time: {
        display: "flex",
        alignItems: "center",
        justifyContent: "right",
        minHeight: "100%"
    },
    plansButton: {
        minWidth: "240px",
        minHeight: "45px",
        mt: 3
    }
}
const SubscriptionDetails = () => {
    const [selectedDate, setSelectedDate] = useState("")
    const [meals, setMeals] = useState([])
    const [items, setItems] = useState({})
    const [isEditOpen, setIsEditOpen] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()

    const preference = useSelector((state) => {
        return state.preferenceDetails.preference
    })

    const mealSessions = useSelector((state) => {
        return state.restaurantDetails.mealSessions
    })
    const menuDetails = useSelector((state) => {
        return state.menuDetails
    })

    //initial menu list fetch and updated menu based on preference
    useEffect(() => {
        dispatch(asyncGetInitialMenu(preference._id))
    }, [preference])

    //set selectedDate to start date of menu 
    useEffect(() => {
        if (menuDetails.dates) {
            setSelectedDate(menuDetails.dates[0])
        }
    }, [menuDetails])

    //filter and set menu list based on selected date
    useEffect(() => {
        if (menuDetails.newMenuList.length > 0 && selectedDate) {
            setMeals(menuDetails.newMenuList.filter(menu => menu.date === selectedDate.date))
        }
    }, [selectedDate, menuDetails.newMenuList])

    // creating object with dish items and nutrition facts  for each meal
    useEffect(() => {
        if (meals.length > 0 && !meals.every(meal => meal.status)) {
            const object = {}
            meals.forEach(meal => {
                if (!meal.status) {
                    const newItems = meal.menuData.comboRef.categories.map(cat => {
                        return cat.items.map(item => {
                            return item.itemRef.title
                        })
                    })
                    object[meal.mealSession] = {
                        items: flattenDeep(newItems).join(", "),
                        nutritionFacts: meal.menuData.comboRef.nutritionFacts
                    }
                }
            })
            setItems(cloneDeep(object))
        }
    }, [meals])

    const handleDateClick = (date) => {
        setSelectedDate(date)
    }
    const handleViewPlansClick = () => {
        history.push("plans")
    }

    const handleEditClick = () => {
        setIsEditOpen(true)
    }
    const handleClose = () => {
        setIsEditOpen(false)
    }


    // sorting meals based on restaurant time 
    const sortedMeal = () => {
        const newArray = meals.sort((a, b) => {
            const aTime = moment(mealSessions[a.mealSession].start, 'HH:mm')
            const bTime = moment(mealSessions[b.mealSession].start, 'HH:mm')
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
    const pathsBreadCrumb = [{ title: "Home", to: "/" }, { title: "Subscription & Preference", to: "/new_subscription" }]
    return (
        <div>
            {
                <>
                    {(!menuDetails.isLoading && selectedDate && meals.length > 0) ? (
                        <>
                            <Toolbar />
                            <CustomBreadCrumbs paths={pathsBreadCrumb} />
                            <Box>

                                <Modal open={isEditOpen} onClose={handleClose}>
                                    <Box sx={style.modal}>
                                        <NewPreference isEdit={true} handleClose={handleClose} />
                                    </Box>
                                </Modal>


                                <Grid container direction="column" sx={style.internalBox}>
                                    <Grid display="flex" direction="row" container align="center" item>
                                        <Typography variant="h5" align="center">
                                            Here is your Next Seven Days Of Chef-Curated Menu.
                                        </Typography>
                                        <Grid p={2} item display="flex" direction="row" container wrap="nowrap" align="center" justifyContent="space-between" sx={style.dateGridContainer}  >
                                            {
                                                menuDetails.dates?.map((item, index) => {
                                                    return (
                                                        <Grid item sx={{
                                                            ...style.dateElement, backgroundColor: selectedDate.date === item.date ? "warning.light" : "#F0F0F0",
                                                            color: selectedDate.date === item.date ? "white" : "text.primary",
                                                        }} display="flex" direction="row" container align="center" key={index} onClick={() => { handleDateClick(item) }}>
                                                            <Grid item xs={12} mt={1}><Typography variant="h6" >{item.date.slice(-2)}</Typography></Grid>
                                                            <Grid item xs={12} mb={1}><Typography>{item.day.slice(0, 3)}</Typography></Grid>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>

                                        <Grid item display="flex" direction="row" container align="left">
                                            <Grid item xs={12} sx={style.foodPreferenceContainer}>
                                                <Grid item display="flex" direction="row" container>
                                                    <Grid item align="left" xs={9} >
                                                        <Typography variant="h6" align="left" mb={1}>Food Preference</Typography>
                                                    </Grid>
                                                    <Grid item align="right" xs={3} >
                                                        <Button sx={{ color: "text.primary" }} onClick={handleEditClick}>
                                                            <EditRoundedIcon fontSize="inherit" />
                                                            Edit
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <Typography color="text.primary"><strong>Cuisine:</strong> {preference.cuisineRef.title}</Typography>
                                                <Typography color="text.primary"><strong>Protein Preference:</strong> {preference.isVeg ? "Vegetarian" : "Non Vegetarian"}</Typography>
                                                <Typography color="text.primary"><strong>Veg Eating Days:</strong> {preference.vegDays.join(", ")}</Typography>
                                                <Typography color="text.primary"><strong>Food Delivery Session:</strong> {preference.mealSessions.join(", ")}</Typography>
                                            </Grid>
                                        </Grid>


                                        <Grid item display="flex" direction="row" container align="left">

                                            {meals.length > 0 && (
                                                sortedMeal().map((meal, index) => {
                                                    return (

                                                        <Grid item xs={12} sx={style.menuDetailsContainer} key={index}>
                                                            <Grid item display="flex" direction="row" container align="center">
                                                                <Grid item xs={4} display="flex" alignItems="center" justifyContent="left" minHeight="100%"  >
                                                                    <Grid item ><Typography variant="h6">{meal.mealSession}</Typography></Grid>
                                                                    <Grid item sx={{ mt: "auto", color: preference.vegDays.includes(selectedDate.day) ? "#0F8A65" : "#E43B4F" }} ><StopRoundedIcon fontSize="small" /></Grid>

                                                                </Grid>
                                                                <Grid item align="right" xs={8} >
                                                                    <Box sx={{ color: "text.primary", minHeight: "100%" }} justifyContent="center">

                                                                        <Box fontSize="small" sx={style.time} gap={1}>
                                                                            <AccessTimeRoundedIcon fontSize="small" />
                                                                            {moment(mealSessions[meal.mealSession].start, "HH:mm").format("h:mm A")} - {moment(mealSessions[meal.mealSession].end, "HH:mm").format("h:mm A")}
                                                                        </Box>

                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                            {
                                                                meal.status ? (
                                                                    <Typography color="warning.main" sx={{ wordWrap: 'break-word' }}> {`Dish is ${preference.cuisineRef.title} -  Menu will be updated soon`}</Typography>
                                                                )
                                                                    : (
                                                                        Object.keys(items).length > 0 && (
                                                                            <>
                                                                                <Typography color="text.primary" sx={{ wordWrap: 'break-word' }}><strong>Food Items:</strong> {items[meal.mealSession]?.items}</Typography>
                                                                                <Typography color="text.primary" fontSize="small" mt={1}><strong>Nutrition Facts:</strong> Carbs: {items[meal.mealSession]?.nutritionFacts.carbs}, Fat: {items[meal.mealSession]?.nutritionFacts.fats}, Protein: {items[meal.mealSession]?.nutritionFacts.protein}</Typography>
                                                                            </>
                                                                        )
                                                                    )
                                                            }
                                                        </Grid>
                                                    )
                                                })
                                            )
                                            }
                                        </Grid>
                                        <Grid item xs={12} display="flex" alignItems="center" justifyContent="center" >

                                            <Button variant="contained" sx={style.plansButton} onClick={handleViewPlansClick}>
                                                View Plans
                                            </Button>

                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                    ) : (
                        <LoadingSpinner />
                    )

                    }
                </>
            }
        </div >
    )
}

export default SubscriptionDetails