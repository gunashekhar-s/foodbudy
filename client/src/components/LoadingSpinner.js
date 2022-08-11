
import { SyncLoader } from "react-spinners"


// import { CSSProperties } from 'react';
//* not required for now - add cssOverride={override} to Loader
// const override: CSSProperties = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };

function LoadingSpinner(props) {
    return (
        <div style={{ display: "flex", margin: "auto", height: "100vh", width: "100%", justifyContent: 'center', alignItems: 'center' }}><div>
            <SyncLoader color={"purple"} loading={true} size={15} />
        </div></div>
    );
}

export default LoadingSpinner;