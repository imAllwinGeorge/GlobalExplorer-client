import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthAPI } from "../../../../services/AuthAPI";
import { useDispatch } from "react-redux";
import { hostRegister } from "../../../store/slices/hostSlice";
import Input from "../../../components/Input";

const HostOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isActive, setIsActive] = useState(true);

  // forgot password time it will be usefull...............
  // const [email, setEmail] = useState("");

  const authAPI = new AuthAPI();

  type Timer = ReturnType<typeof setInterval> | null;

  useEffect(() => {
    const storedExpiry = localStorage.getItem("otp_expiry");
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const now = Date.now();
      const remaining = Math.floor((expiryTime - now) / 1000);

      if (remaining > 0) {
        setTimeLeft(remaining);
        setIsActive(true);
      } else {
        setTimeLeft(0);
        setIsActive(false);
        localStorage.removeItem("otp_expiry");
      }
    } else {
      // If no expiry time is stored, set default (optional)
      const newExpiry = Date.now() + 120000;
      localStorage.setItem("otp_expiry", newExpiry.toString());
    }
  }, []);

  useEffect(() => {
    let timer: Timer = null;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer !== null) clearInterval(timer);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isActive) {
      alert("Time expired! Please resend OTP");
      return;
    }

    try {
      const response = await authAPI.verify(otp)
      console.log("dispatch response: ",response);
     
      if(response.status === 201){
        dispatch(hostRegister(response.data.user));
        console.log(response)
        navigate("/host/home")
      }
      // need to check at the time of forgot password.....................................

      // else if (response.status === 200) {
      //   setEmail(response.data.user?.email);
      //   navigate("/new-password", { state: { email: email } });
      // }
    } catch (error) {
      console.error("verifyOtp error:", error);
      if(error instanceof Error){
        toast.error(error.message)
      }else{
        toast.error("unexpected error occured")
      }
    }
  };

  const handleResendOtp = async () => {
    if (isActive) {
      alert("Please wait for timer to expire");
      return;
    }

    try {
      const response = await authAPI.resendOtp();
      if (response.status === 200) {
        const newExpiry = Date.now() + 120000; // 2 minutes from now
        localStorage.setItem("otp_expiry", newExpiry.toString());
        // Reset timer and states
        setTimeLeft(120);
        setIsActive(true);
      }
    } catch (error) {
      console.error("resendOtp error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">OTP Verification</h2>

      <form onSubmit={(e) => handleVerify(e)} className="space-y-6">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter OTP
          </label>
          <Input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your OTP"
          />
        </div>

        {/* Timer Display */}
        <div className="bg-gray-700 text-white p-4 rounded-md text-center">
          <p className="text-sm font-medium mb-1">Time Remaining</p>
          <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={!isActive}
          className={`w-full py-3 px-4 rounded-md text-white font-medium
            ${
              isActive
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition duration-150 ease-in-out`}
        >
          Verify OTP
        </button>

        {/* Resend Button */}
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isActive}
          className={`w-full py-3 px-4 rounded-md text-white font-medium
            ${
              !isActive
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition duration-150 ease-in-out`}
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default HostOtp;
