
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetUserDetails } from './redux/actions/userActions';
import { asyncGetCuisines } from './redux/actions/cuisineActions';
import { asyncgetRestaurantDetails } from './redux/actions/restaurantActions';
import ServerError from './components/ServerError';
import AppContainer from './components/AppContainer';
import LoadingSpinner from './components/LoadingSpinner';
import { useHistory } from 'react-router-dom';



function App() {
  const [isLoading, setIsLoading] = useState(true)
  const isAuthTokenFound = localStorage.hasOwnProperty("token")
  const dispatch = useDispatch()



  const restaurantDetails = useSelector((state) => {
    return state.restaurantDetails
  })
  const cuisines = useSelector((state) => {
    return state.cuisines
  })



  // to fetch restaurant and cusine data
  useEffect(() => {
    dispatch(asyncgetRestaurantDetails())
    dispatch(asyncGetCuisines())
  }, [dispatch])

  // on successful fetch of data show or show server error
  useEffect(() => {
    if (!restaurantDetails.isLoading && !cuisines.isLoading) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [restaurantDetails, cuisines])

  const userDetails = useSelector((state) => {
    return state.userDetails
  })
  const history = useHistory()
  //if user logged in(redux), get user details
  useEffect(() => {
    if (userDetails.isUserLoggedIn) {
      dispatch(asyncGetUserDetails(history))
    }
  }, [userDetails.isUserLoggedIn])


  // on refresh/reload if token available, fetch userdata
  useEffect(() => {
    if (isAuthTokenFound) {
      dispatch(asyncGetUserDetails(history))
    }
  }, [isAuthTokenFound])


  return (
    <div>
      {(isLoading && restaurantDetails.error.message === "Internal Server Error") ? (<ServerError />)
        : (!isLoading && !userDetails.isUserLoggedIn && !isAuthTokenFound) ? (<AppContainer />)
          : (!isLoading && userDetails.isUserLoggedIn && isAuthTokenFound && !userDetails.isLoading && userDetails.user?._id) ? (<AppContainer />)
            : <LoadingSpinner />
      }

    </div>
  )
}

export default App