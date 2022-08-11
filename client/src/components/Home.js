import { Button, Grid, Toolbar, Typography } from "@mui/material"
import { Box, } from "@mui/system"
import { Link } from "react-router-dom"
import banner from "../images/home_banner.png"
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

    return (
        <Box>
            <Toolbar />
            <Grid>
                <div >
                    <img src={banner} width="100%" />
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

        </Box >

    )
}


export default Home