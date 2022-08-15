import { Route } from "react-router-dom"
import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"
import Home from "../components/Home"
import Reset from "../components/Reset"
import MainContainer from "../components/MainContainer"
import SubscriptionConatiner from "../components/SubscriptionContainer"
import ViewPlans from "../components/ViewPlans"
import OrderDetails from "../components/OrderDetails";

const AppRouter = () => {
    return (
        <>
            <Route path="/" component={Home} exact />
            <Route path="/login" component={SignIn} />
            <Route path="/register" component={SignUp} />
            <Route path="/reset" component={Reset} />
            <Route path="/user" component={MainContainer} />
            <Route path="/new_subscription" component={SubscriptionConatiner} />
            <Route path="/plans" component={ViewPlans} />
            <Route path="/order_summary" component={OrderDetails} />
        </>
    )

}


export default AppRouter