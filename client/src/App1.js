// import { useEffect, useState } from "react"
// import axios from "axios"
// function App() {
//   const [amount, setAmount] = useState("")
//   const [orderId, setOrderId] = useState("")

//   useEffect(() => {
//     axios.post("http://localhost:3040/test")
//       .then((response) => {
//         const data = response.data
//         console.log(data)
//         setAmount(data.amount)
//         setOrderId(data.id)
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }, [])


//   const loadScript = () => {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script')
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       document.body.appendChild(script)
//       script.onload = () => {

//         resolve(true)
//       }
//       script.onerror = () => {

//         resolve(false)
//       }
//     })
//   }

//   const displayRazorpay = async () => {

//     const res = await loadScript()

//     if (!res) {
//       console.log("razorpay load error")
//     } else {
//       const options = {
//         "key": "rzp_test_bcd97RFqdrtZ09", // Enter the Key ID generated from the Dashboard
//         "amount": `${amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//         "currency": "INR",
//         "name": "Acme Corp",
//         "description": "Test Transactiondsffffffffffffffffffffffffffffffffffffffffffffffff",
//         "image": "https://play-lh.googleusercontent.com/iwGG0ojU1j43ZEEGiibNmLqd4Ha6eRtAjFlG2WE7uV8vUZTsrP1GDRwvA_aPJghkCqc=w480-h960-rw",
//         "order_id": `${orderId}`, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//         "handler": function (response) {
//           alert(response.razorpay_payment_id);
//           alert(response.razorpay_order_id);
//           alert(response.razorpay_signature)
//         },
//         "prefill": {
//           "name": "Gaurav Kumar",
//           "email": "gaurav.kumar@example.com",
//           "contact": "7887878787"
//         },
//         "notes": {
//           "address": "Razorpay Corporate Office"
//         },
//         "theme": {
//           "color": "#4AD154"
//         }
//       };
//       var rzp1 = new window.Razorpay(options);
//       rzp1.on('payment.failed', function (response) {
//         alert(response.error.code);
//         alert(response.error.description);
//         alert(response.error.source);
//         alert(response.error.step);
//         alert(response.error.reason);
//         alert(response.error.metadata.order_id);
//         alert(response.error.metadata.payment_id);
//       });
//     }
//     rzp1.open();

//   }
//   return (
//     <div className="App">
//       <button onClick={displayRazorpay}>Make Payment</button>
//       <h3>{amount}</h3>
//       <h3>{orderId}</h3>
//       <div>
//         <img src="images/1656041375038-north-indian-cuisine.jpg" alt="Image" />
//       </div>
//     </div>
//   );
// }


import React, { useCallback, useEffect, useState, useMemo } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };


  // useEffect(() => {
  //   console.log("parent rendered");
  // }, [count])
  const eventHandler = useCallback(() => {
    console.log("1");
  }, [])

  // if name = [1], 
  const name = useMemo(() => {
    return [1]
  }, [])
  const handleClick1 = async () => {
    setCount(Math.random());
  };

  console.log("parent rendered")


  return (
    <div className="App" style={{ margin: "0 300px" }}>
      <h1>Parent - {count}</h1>
      <h1>Parent - {Math.random()}</h1>
      <button onClick={handleClick}> + </button>
      <button onClick={handleClick1}> ++ </button>
      <Child name={name} />
    </div>
  );
}

// primitive data types are compare by value
const Child = React.memo(({ name }) => {
  console.log("child rendered");
  return (
    <div className="App" >
      <h1>Child - {name}</h1>

      {/* <button onClick={eventHandler}> + </button> */}
    </div>
  );
})
