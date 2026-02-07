import { axiosInstance } from "@/api/axiosInstance";
import { config } from "@/shared/constants/config";
import type {
  Activity,
  AuthResponse,
  Booking,
  Host,
  ResponseType,
  User,
} from "@/shared/types/global";
import axios from "axios";
import toast from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";

interface RazorpayResponse {
  amount: number;
  currency: string;
  id: string;
}

interface RazorpayVerifyResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const razorpay_api_keyId = config.VITE_RAZORPAY_KEY_ID;

export const initiateCheckout = async (
  activity: Activity | null,
  selectedDate: Date | undefined,
  user: User | Host | null | undefined,
  formattedDate: string | undefined,
  razorpayAccountId: string,
  count: number,
  navigate: NavigateFunction,
) => {
  if (!activity || !selectedDate || !user) {
    toast.error("Please complete all booking details");
    return;
  }

  const originalDate = new Date(selectedDate);
  const millisecondInOneDay = 24 * 60 * 60 * 100;
  const expiryDate = new Date(originalDate.getTime() - millisecondInOneDay);

  const razorpayData = {
    amount: activity.pricePerHead * count,
    currency: "INR",
    activityId: activity._id,
    activityTitle: activity.activityName,
    participantCount: count,
    userId: user._id,
    hostId: activity.userId,
    holdUntilDate: expiryDate,
    date: formattedDate,
    razorpayAccountId,
    pricePerParticipant: activity.pricePerHead,
  };
  console.log("razorpay data: ", razorpayData);
  try {
    const res = await axiosInstance.post(
      "/api/user/activity/booking",
      razorpayData,
    );
    const data = res.data as RazorpayResponse;
    console.log("razorpay response  : ", razorpay_api_keyId);
    const options: RazorpayOptions = {
      key: razorpay_api_keyId,
      amount: data.amount,
      currency: data.currency,
      name: activity.activityName,
      order_id: data.id,
      handler: async (response: RazorpayVerifyResponse) => {
        console.log("handler response:   ", response);
        try {
          const verifyRes: ResponseType<AuthResponse> =
            await axiosInstance.post("/api/user/payment/verify", {
              ...response,
              ...data,
              ...razorpayData,
            });
          console.log(verifyRes);
          if (verifyRes.status === 201) {
            toast.success("Booking successful!");
            navigate(
              `/order-success/${(verifyRes.data.booking as Booking)._id}`,
              {
                state: verifyRes.data.booking as Booking,
              },
            );
          }
        } catch (err) {
          console.log(err);
          toast.error("Payment verification failed");
        }
      },

      modal: {
        ondismiss: async () => {
          toast.error("Payment cancelled");
        },
      },
      prefill: {
        name: user.firstName,
        email: user.email,
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error: unknown) {
    console.error("Booking error:", error);

    if (axios.isAxiosError(error)) {
      // Extract a message from backend response if it exists
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred.");
    }
  }
};
