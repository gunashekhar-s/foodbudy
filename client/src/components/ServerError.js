

import React, { useEffect } from 'react';
// in CRA image relative path not working here, so importing image
import errorImage from "../images/server_error1.jpg"
import { toast } from "react-toastify"
import { ToastContainer } from 'react-toastify';
function ServerError(props) {

    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
            />
            <img src={errorImage} width="100%" height="auto" />

        </div>
    );
}

export default ServerError;