import { useTheme } from "@emotion/react"
import { Divider, Drawer, Toolbar, useMediaQuery } from "@mui/material"
import { Box } from "@mui/system"
import { useSelector } from "react-redux"
import { Route } from "react-router-dom"
import AddressContainer from "./AddressContainer"
import NavigationMenu from "./NavigationMenu"


const MainContainer = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const drawerWidth = 212;
    const isUserLoggedIn = useSelector((state) => {
        return state.userDetails.isUserLoggedIn
    })
    return (
        <Box>
            {(!isMobile && isUserLoggedIn) && (
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar />
                    <Divider />

                    <NavigationMenu />
                </Drawer>
            )
            }

            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', ml: !isMobile && `${drawerWidth}px`, pl: 2 }}>

                <Toolbar />
                <Route path="/user/address" component={AddressContainer} />


            </Box>

        </Box >

    )
}


export default MainContainer