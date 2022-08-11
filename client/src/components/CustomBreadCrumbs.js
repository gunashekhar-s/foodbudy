import { Breadcrumbs, Typography } from "@mui/material"
import { Link, useLocation } from "react-router-dom"



const CustomBreadCrumbs = (props) => {
    const { paths } = props
    const location = useLocation()
    return (
        <>
            {paths &&
                <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mt: 1, ml: 2 }} >

                    {
                        paths.map((item, i) => {
                            return (

                                <Link to={item.to} style={{ textDecoration: "none" }} key={i}>
                                    <Typography sx={{ color: location.pathname === item.to ? "text.primary" : "text.secondary" }}>
                                        {item.title}
                                    </Typography>
                                </Link>
                            )
                        })
                    }
                </Breadcrumbs>
            }
        </>
    )
}

export default CustomBreadCrumbs