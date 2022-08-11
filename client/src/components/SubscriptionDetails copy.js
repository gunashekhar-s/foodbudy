import { Toolbar, Box, Grid, Typography } from "@mui/material"


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
    dateElement: {
        // display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "70px",
        height: "70px",
        backgroundColor: "warning.light",
        color: "white",
        borderRadius: "8px"
    },
    dateGridContainer: {
        maxWidth: "100%",
        overflow: "auto",
        mt: 2,
    }
}
const SubscriptionDetails = () => {
    return (
        <div>
            <Toolbar />
            <Box>
                <Grid container direction="column" sx={style.internalBox}>
                    <Grid display="flex" direction="row" container align="center" item>
                        <Typography variant="h5" align="center">
                            Here is your Next Seven Days Of Chef-Curated Menu.
                        </Typography>
                        <Grid p={2} display="flex" direction="row" container wrap="nowrap" spacing={2} align="center" justifyContent="space-around" sx={style.dateGridContainer} >
                            <Grid item sx={style.dateElement} display="flex" direction="column" container >
                                <Grid item xs={12}><Typography variant="h6" >27</Typography></Grid>
                                <Grid item xs={12}><Typography>Fri</Typography></Grid>
                            </Grid>
                            <Grid item sx={style.dateElement} display="flex" direction="column" container >
                                <Grid item xs={12}><Typography variant="h6" >27</Typography></Grid>
                                <Grid item xs={12}><Typography>Fri</Typography></Grid>
                            </Grid>
                            <Grid item sx={style.dateElement} display="flex" direction="column" container >
                                <Grid item xs={12}><Typography variant="h6" >27</Typography></Grid>
                                <Grid item xs={12}><Typography>Fri</Typography></Grid>
                            </Grid>
                            <Grid item sx={style.dateElement} display="flex" direction="column" container >
                                <Grid item xs={12}><Typography variant="h6" >27</Typography></Grid>
                                <Grid item xs={12}><Typography>Fri</Typography></Grid>
                            </Grid>
                            <Grid item sx={style.dateElement} display="flex" direction="column" container >
                                <Grid item xs={12}><Typography variant="h6" >27</Typography></Grid>
                                <Grid item xs={12}><Typography>Fri</Typography></Grid>
                            </Grid>
                            <Grid item sx={style.dateElement} display="flex" direction="column" container >
                                <Grid item xs={12}><Typography variant="h6" >27</Typography></Grid>
                                <Grid item xs={12}><Typography>Fri</Typography></Grid>
                            </Grid>
                            <Grid item sx={style.dateElement} display="flex" direction="column" container >
                                <Grid item xs={12}><Typography variant="h6" >27</Typography></Grid>
                                <Grid item xs={12}><Typography>Fri</Typography></Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Box>
        </div>
    )
}

export default SubscriptionDetails



// import { Toolbar, Box, Grid, Typography } from "@mui/material"


// const style = {
//     internalBox: {
//         display: "flex",
//         flexGrow: 1,
//         maxWidth: "md",
//         align: "center",
//         width: "100%",
//         boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
//         borderRadius: "6px",
//         p: 5,
//         m: "auto",
//         mt: 1
//     },
//     dateElement: {
//         // display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: "70px",
//         height: "70px",
//         backgroundColor: "warning.light",
//         color: "white",
//         borderRadius: "8px",
//         p: 0

//     },
//     dateGridContainer: {
//         minWidth: "md",
//         maxWidth: "md",
//         overflowX: "auto !important",
//         mt: 2,
//     }
// }
// const SubscriptionDetails = () => {
//     return (
//         <div>
//             <Toolbar />
//             <Box>
//                 <Grid container direction="column" sx={style.internalBox}>
//                     <Grid display="flex" direction="row" container align="center" item>
//                         <Typography variant="h5" align="center">
//                             Here is your Next Seven Days Of Chef-Curated Menu.
//                         </Typography>
//                         <Grid p={2} display="flex" direction="row" container wrap="nowrap" align="center" justifyContent="space-around" sx={style.dateGridContainer}  >
//                             <Grid item sx={style.dateElement} display="flex" direction="row" container align="center" p={0} m={0}>
//                                 <Grid item xs={12} mt={1}><Typography variant="h6" >27</Typography></Grid>
//                                 <Grid item xs={12} mb={1}><Typography>Fri</Typography></Grid>
//                             </Grid>
//                             <Grid item sx={style.dateElement} display="flex" direction="row" container align="center" p={0} m={0}>
//                                 <Grid item xs={12} mt={1}><Typography variant="h6" >27</Typography></Grid>
//                                 <Grid item xs={12} mb={1}><Typography>Fri</Typography></Grid>
//                             </Grid>
//                             <Grid item sx={style.dateElement} display="flex" direction="row" container align="center" p={0} m={0}>
//                                 <Grid item xs={12} mt={1}><Typography variant="h6" >27</Typography></Grid>
//                                 <Grid item xs={12} mb={1}><Typography>Fri</Typography></Grid>
//                             </Grid>
//                             <Grid item sx={style.dateElement} display="flex" direction="row" container align="center" p={0} m={0}>
//                                 <Grid item xs={12} mt={1}><Typography variant="h6" >27</Typography></Grid>
//                                 <Grid item xs={12} mb={1}><Typography>Fri</Typography></Grid>
//                             </Grid>
//                             <Grid item sx={style.dateElement} display="flex" direction="row" container align="center" p={0} m={0}>
//                                 <Grid item xs={12} mt={1}><Typography variant="h6" >27</Typography></Grid>
//                                 <Grid item xs={12} mb={1}><Typography>Fri</Typography></Grid>
//                             </Grid>
//                             <Grid item sx={style.dateElement} display="flex" direction="row" container align="center" p={0} m={0}>
//                                 <Grid item xs={12} mt={1}><Typography variant="h6" >27</Typography></Grid>
//                                 <Grid item xs={12} mb={1}><Typography>Fri</Typography></Grid>
//                             </Grid>
//                             <Grid item sx={style.dateElement} display="flex" direction="row" container align="center" p={0} m={0}>
//                                 <Grid item xs={12} mt={1}><Typography variant="h6" >27</Typography></Grid>
//                                 <Grid item xs={12} mb={1}><Typography>Fri</Typography></Grid>
//                             </Grid>
//                         </Grid>
//                     </Grid>

//                 </Grid>
//             </Box>
//         </div>
//     )
// }

// export default SubscriptionDetails