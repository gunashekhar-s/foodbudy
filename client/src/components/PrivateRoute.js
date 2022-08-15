
import { Redirect, Route } from "react-router-dom"
const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        < Route
            {...rest}
            render={(props) => {
                return localStorage.getItem("token") ? (
                    <Component {...rest} {...props} />
                ) : (
                    <Redirect
                        to={
                            { pathname: "/login" }
                        }
                    />
                )
            }
            }
        />
    )
}

export default PrivateRoute