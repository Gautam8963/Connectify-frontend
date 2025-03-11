import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { Crown, Check, Star, Sparkles, Home, Shield, MessageSquare, Users, Zap } from "lucide-react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [premiumType, setPremiumType] = useState(null);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isPremium) {
        setIsUserPremium(true);
        setPremiumType(res.data.membershipType || "premium");
      }
    } catch (err) {
      console.error("Premium Verification Error:", err?.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyClick = async (type) => {
    try {
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
        name: "DevMate Premium",
        description: type === "silver" ? "Silver Membership - 3 Months" : "Gold Membership - 6 Months",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: type === "silver" ? "#9CA3AF" : "#F59E0B",
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error?.response?.data || error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-base-100 to-base-200">
        <div className="loading loading-dots loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70 font-medium">Checking membership status...</p>
      </div>
    );
  }

  if (isUserPremium) {
    return (
      <div className="bg-base-100 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden shadow-xl border border-primary/20">
          <div className="relative">
            <div className="h-40 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
            <div className="absolute top-0 left-0 w-full h-40 flex flex-col justify-center items-center text-white">
              <Crown size={48} className="mb-2" />
              <h2 className="text-2xl font-bold">Premium Member</h2>
              <p className="opacity-90 text-sm">{premiumType === "gold" ? "Gold Membership" : "Silver Membership"}</p>
            </div>
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 bg-base-100 rounded-full flex items-center justify-center border-4 border-base-100">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles size={40} className="text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-base-content mb-2">Congratulations!</h2>
            <p className="text-base-content/80 mb-8">
              You're currently enjoying all premium features and benefits. Your status unlocks exclusive capabilities.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-base-100 p-3 rounded-lg shadow-sm flex flex-col items-center">
                <MessageSquare size={20} className="text-primary mb-2" />
                <p className="text-sm font-medium">Unlimited Chats</p>
              </div>
              <div className="bg-base-100 p-3 rounded-lg shadow-sm flex flex-col items-center">
                <Users size={20} className="text-primary mb-2" />
                <p className="text-sm font-medium">Priority Matching</p>
              </div>
              <div className="bg-base-100 p-3 rounded-lg shadow-sm flex flex-col items-center">
                <Shield size={20} className="text-primary mb-2" />
                <p className="text-sm font-medium">Verified Badge</p>
              </div>
              <div className="bg-base-100 p-3 rounded-lg shadow-sm flex flex-col items-center">
                <Zap size={20} className="text-primary mb-2" />
                <p className="text-sm font-medium">Advanced Filters</p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/'} 
              className="btn btn-primary btn-md gap-2"
            >
              <Home size={18} />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <Crown size={20} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">Upgrade Your Experience</h1>
        </div>
        
        <p className="text-center text-base-content/70 mb-12 max-w-xl mx-auto">
          Unlock premium features and connect with more developers. Choose the plan that works best for you.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 justify-center max-w-5xl mx-auto">
          {/* Silver Plan */}
          <div className="flex-1 bg-base-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 group relative">
            <div className="absolute top-6 right-6">
              <Star size={24} className="text-secondary" />
            </div>
            
            <div className="p-8 pb-6 text-center border-b border-base-200">
              <h2 className="text-xl font-bold text-base-content mb-1">Silver Membership</h2>
              <div className="flex justify-center items-baseline mt-4 mb-1">
                <span className="text-4xl font-extrabold text-secondary">₹499</span>
                <span className="text-base-content/60 ml-1">/3 months</span>
              </div>
              <p className="text-sm text-base-content/70">Perfect for casual networking</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check size={20} className="text-secondary mr-3 flex-shrink-0" />
                  <span className="text-base-content">Chat with other developers</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-secondary mr-3 flex-shrink-0" />
                  <span className="text-base-content"><span className="font-medium">100</span> Connection Requests/day</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-secondary mr-3 flex-shrink-0" />
                  <span className="text-base-content">Blue Tick Verification</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-secondary mr-3 flex-shrink-0" />
                  <span className="text-base-content"><span className="font-medium">3 Months</span> Access</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <button
                  onClick={() => handleBuyClick("silver")}
                  className="btn btn-secondary w-full gap-2 group-hover:scale-105 transition-transform duration-300"
                >
                  <Star size={18} />
                  Get Silver
                </button>
              </div>
            </div>
          </div>
          
          {/* Gold Plan */}
          <div className="flex-1 bg-base-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20 group relative p-2">
            <div className="absolute top-0 right-6 transform translate-y-[-50%] bg-primary text-white px-4 py-1 rounded-b-lg">
              <span className="text-sm font-bold">MOST POPULAR</span>
            </div>
            
            <div className="absolute top-6 right-6">
              <Crown size={24} className="text-primary" />
            </div>
            
            <div className="p-8 pb-6 text-center border-b border-base-200">
              <h2 className="text-xl font-bold text-base-content mb-1">Gold Membership</h2>
              <div className="flex justify-center items-baseline mt-4 mb-1">
                <span className="text-4xl font-extrabold text-primary">₹899</span>
                <span className="text-base-content/60 ml-1">/6 months</span>
              </div>
              <p className="text-sm text-base-content/70">For serious networking professionals</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-base-content">Chat with other developers</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-base-content"><span className="font-medium">Unlimited</span> Connection Requests</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-base-content">Blue Tick Verification</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-base-content"><span className="font-medium">6 Months</span> Access</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-base-content">Priority Profile Visibility</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <button
                  onClick={() => handleBuyClick("gold")}
                  className="btn btn-primary w-full gap-2 group-hover:scale-105 transition-transform duration-300"
                >
                  <Crown size={18} />
                  Get Gold
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;