
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SubscriptionsRoundedIcon from '@mui/icons-material/SubscriptionsRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { logoutToggle } from "../redux/actions/userActions"
import { Link, useHistory, useLocation, withRouter } from "react-router-dom"
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';


const style = {
    icon: {
        minWidth: "40px"
    },
    link: {
        color: "inherit",
        textDecoration: "none"
    }
}




const NavigationMenu = (props) => {
    const history = useHistory()
    const { closeDrawer } = props
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const handleClick = () => {
        setOpen(!open);
    }
    const handleClickClose = () => {
        isMobile && closeDrawer()
    }
    const handleSignOutClick = () => {

        localStorage.removeItem("token")
        dispatch(logoutToggle())
        history.push("/")
        isMobile && closeDrawer()
    }

    return (

        <List>
            <Link to="/" style={style.link} onClick={handleClickClose}>
                <ListItemButton>
                    <ListItemIcon sx={style.icon}>
                        <HomeRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItemButton>
            </Link>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon sx={style.icon}>
                    <AccountCircleRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="My Account" />
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Link to="/user/account" style={style.link} >
                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickClose}>
                            <ListItemIcon sx={style.icon}>
                                <BadgeRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Personal Details" />
                        </ListItemButton>
                    </Link>
                    <Link to="/user/address" style={style.link}>
                        <ListItemButton sx={{ pl: 4 }} onClick={handleClickClose}>
                            <ListItemIcon sx={style.icon}>
                                <LocationOnRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Saved Address" />
                        </ListItemButton>
                    </Link>
                </List>
            </Collapse>
            <Link to="/menu" style={style.link} onClick={handleClickClose}>
                <ListItemButton>
                    <ListItemIcon sx={style.icon}>
                        <MenuBookRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Menu" />
                </ListItemButton>
            </Link>
            <Link to="/new_subscription" style={style.link} onClick={handleClickClose}>
                <ListItemButton>
                    <ListItemIcon sx={style.icon}>
                        <HomeRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Start Subscriptions" />
                </ListItemButton>
            </Link>
            <Link to="/user/subscriptions" style={style.link} onClick={handleClickClose}>
                {/* sx={{ backgroundColor: location.pathname == "/user/subscriptions" && "#541554", color: location.pathname == "/user/subscriptions" && "white" }} */}
                <ListItemButton >
                    <ListItemIcon sx={style.icon}>
                        <SubscriptionsRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Subscriptions" />
                </ListItemButton>
            </Link>
            <ListItemButton onClick={handleSignOutClick}>
                <ListItemIcon sx={style.icon}>
                    <HomeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
            </ListItemButton>
        </List>

    )
}

export default NavigationMenu