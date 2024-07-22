import React from 'react';
import axios from 'axios';
function Paymentpage() {
    const handlePayment = () => {
        const options = {
          key: 'rzp_test_rZaWARvDVQrglw', // Replace with your Razorpay Key ID
          amount: '50000', // Amount in paise (e.g., 50000 paise = INR 500)
          currency: 'INR',
          name: 'Perfect Resume',
          description: 'Test Transaction',
          image: 'https://example.com/your_logo.png',
           // Your logo or any image
          handler: function (response) {
            alert('Payment Successful');
            console.log(response);
            // You can send the payment response to your backend here for verification if needed
          },
          prefill: {
            name: 'John Doe',
            email: 'john@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#3399cc'
          }
        };
    
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };
    
      return (
        <button onClick={handlePayment} className="btn btn-primary">
          Pay with Razorpay
        </button>
      );
    };

export default Paymentpage;