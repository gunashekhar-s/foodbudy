import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Link, useLocation, withRouter } from "react-router-dom";
import DrawerComponent from "./Drawer";
import { useDispatch, useSelector } from "react-redux";
import { logoutToggle } from "../redux/actions/userActions";
import logo from "../images/logo.png"

const styles = {
    navlinks: {
        marginLeft: "5px",
        display: "flex",
    },
    logo: {
        flexGrow: "1",
        cursor: "pointer",
    },
    link: {
        textDecoration: "none",
        color: "white",
        fontSize: "15px",
        marginLeft: "20px",
        "&:hover": {
            color: "yellow",
            borderBottom: "1px solid white",
        }
    },
    imgSpan: {
        width: "90px",
        verticalAlign: "middle"

    }
}



function Navbar(props) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const dispatch = useDispatch()
    const handleSignOut = () => {
        dispatch(logoutToggle())
        localStorage.removeItem("token")
        props.history.push("/login")
    }
    const user = useSelector((state) => {
        {
            return state.userDetails.user
        }
    })
    const isUserLoggedIn = useSelector((state) => {
        {
            return state.userDetails.isUserLoggedIn
        }
    })
    return (
        //when clicked on profile link should go to another page which will have additional right drawer and pages
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>

            <Toolbar>
                {isMobile ? (
                    <DrawerComponent style={{ order: 1 }} />
                ) : (
                    <div style={{ ...styles.navlinks, order: 2 }} >
                        {
                            !isUserLoggedIn ? (
                                <>
                                    <Link to="/" style={styles.link}>
                                        Home
                                    </Link>
                                    <Link to="/login" style={styles.link}>
                                        Sign In
                                    </Link>
                                    <Link to="/register" style={styles.link}>
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/user/subscriptions" style={styles.link}>
                                        {user.username}
                                    </Link>
                                    <Link to="/login" style={styles.link} onClick={handleSignOut}>
                                        Sign Out
                                    </Link>
                                </>
                            )
                        }

                    </div>
                )}
                <Typography variant="h4" sx={{ ...styles.logo, order: isMobile ? 2 : 1 }}>
                    <img src={logo} alt="logo" style={styles.imgSpan} onClick={() => { props.history.push("/") }} />
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
export default withRouter(Navbar);