import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev Tinder",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return isUserPremium ? (
    "You're are already a premium user"
  ) : (
    <div className="m-4 sm:m-10">
      <div className="flex flex-col md:flex-row w-full gap-6">
        <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center p-6">
          <h1 className="font-bold text-2xl md:text-3xl">Silver Membership</h1>
          <ul className="text-sm md:text-base">
            <li>- Chat with other people</li>
            <li>- 100 connection Requests per day</li>
            <li>- Blue Tick</li>
            <li>- 3 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("silver")}
            className="btn btn-secondary px-6 py-2 text-sm md:text-base"
          >
            Buy Silver
          </button>
        </div>
        <div className="divider md:divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center p-6">
          <h1 className="font-bold text-2xl md:text-3xl">Gold Membership</h1>
          <ul className="text-sm md:text-base">
            <li>- Chat with other people</li>
            <li>- Infinite connection Requests per day</li>
            <li>- Blue Tick</li>
            <li>- 6 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("gold")}
            className="btn btn-primary px-6 py-2 text-sm md:text-base"
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};
export default Premium;