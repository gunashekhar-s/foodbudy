import React, { useState } from "react";
import {
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";

import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import NavigationMenu from "./NavigationMenu";
const styles = {
    link: {
        textDecoration: "none",
        color: "#541554",
        fontSize: "15px"
    },
    icon: {
        color: "white",
    },
    drawer: {
        width: "240px"
    }
}

function DrawerComponent(props) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isUserLoggedIn = useSelector((state) => {
        return state.userDetails.isUserLoggedIn
    })
    const closeDrawer = () => setOpenDrawer(false)
    return (
        <>
            <Drawer
                open={openDrawer}
                anchor={"left"}
                onClose={() => setOpenDrawer(false)}
                sx={{ width: "240px" }}
            >
                <Toolbar />

                {!isUserLoggedIn ? (
                    <List>
                        <ListItem onClick={closeDrawer}>
                            <ListItemText>
                                <Link to="/" style={styles.link}>Home</Link>
                            </ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem onClick={closeDrawer}>
                            <ListItemText>
                                <Link to="/login" style={styles.link}>Sign In</Link>
                            </ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem onClick={closeDrawer}>
                            <ListItemText>
                                <Link to="/register" style={styles.link}>Sign Up</Link>
                            </ListItemText>
                        </ListItem>
                        <Divider />
                    </List>

                ) : (

                    <NavigationMenu closeDrawer={closeDrawer} />


                )}

            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)} sx={styles.icon}>
                <MenuIcon />
            </IconButton>
        </>
    );
}
export default DrawerComponent;