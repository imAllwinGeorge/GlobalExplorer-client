// import { Button } from '../../components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
// import { Separator } from '@radix-ui/react-select'
// import { Calendar, CheckCircle, Package } from 'lucide-react'
// import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import toast from 'react-hot-toast'
// import { UserService } from '@/services/UserService'
// import { HttpStatusCode } from '@/shared/constants/constants'
// import { useState } from 'react'
// import type { Booking } from '@/shared/types/global'

// const OrderSuccess = () => {
//   const [order, setOrder] = useState<Booking | null>(null);
//     const location = useLocation();
//     const { orderId } = useParams<{orderId: string}>();
//     const navigate = useNavigate();
//     const userService = new UserService();

//     const fetchOrder = async () => {
//       try {
//         const response = await userService.getOrder(orderId as string);

//         if(response.status === HttpStatusCode.OK){
//           setOrder(response.data.booking as Booking)
//         }
//       } catch (error) {
//         if(error instanceof Error){
//           toast.error(error.message)
//         }
//       }
//     }

//     if(!order){
//       fetchOrder();
//     }else{
//       setOrder(location.state)
//     }
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         {/* Success Header */}
//         <div className="text-center mb-8">
//           <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
//           <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
//         </div>

//         {/* Order Details Card */}
//         { order && (
//           <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Package className="h-5 w-5" />
//               Order Details
//             </CardTitle>
//             <CardDescription>{order._id}</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-600">Order Date</span>
//               </div>
//               <span className="text-sm font-medium">{order.date}</span>
//             </div>

//             {/* <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <CreditCard className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-600">Payment Method</span>
//               </div>
//               <span className="text-sm font-medium">•••• •••• •••• 4242</span>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-600">Delivery Address</span>
//               </div>
//               <span className="text-sm font-medium">123 Main St, City, State</span>
//             </div> */}

//             <Separator />

//             {/* Order Items */}
//             <div className="space-y-3">
//               <h4 className="font-medium">Items Ordered</h4>
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-sm font-medium">{order.activityTitle}</p>
//                     <p className="text-xs text-gray-500">{order.participantCount}</p>
//                   </div>
//                   <span className="text-sm font-medium">{order.participantCount * order.pricePerParticipant}</span>
//                 </div>
//               </div>

//               <Separator />


//               <div className="flex justify-between items-center font-medium">
//                 <span>Total</span>
//                 <span>{order.participantCount * order.pricePerParticipant}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         )}

//         {/* Delivery Information */}
//         {/* <Card className="mb-8">
//           <CardHeader>
//             <CardTitle>Delivery Information</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               <p className="text-sm">
//                 <strong>Estimated Delivery:</strong> January 20-22, 2025
//               </p>
//               <p className="text-sm">
//                 <strong>Tracking Number:</strong> TRK123456789
//               </p>
//               <p className="text-sm text-gray-600">
//                 You will receive an email with tracking details once your order ships.
//               </p>
//             </div>
//           </CardContent>
//         </Card> */}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Button variant="outline" size="lg" className="flex-1 sm:flex-none bg-transparent">
//             Track Order
//           </Button>
//           <Button variant="destructive" size="lg" className="flex-1 sm:flex-none">
//             Cancel Order
//           </Button>
//           <Button onClick={() => navigate("/home")} variant="default" size="lg" className="flex-1 sm:flex-none">
//             Continue Shopping
//           </Button>
//         </div>

//         {/* Support Information */}
//         <div className="mt-8 text-center text-sm text-gray-600">
//           <p>
//             Need help? Contact our support team at{" "}
//             <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
//               support@example.com
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default OrderSuccess

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '@radix-ui/react-select';
import { Calendar, CheckCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Booking } from '../../../shared/types/global';
import { UserService } from '../../../services/UserService';
import { HttpStatusCode } from '../../../shared/constants/constants';
import Loader from '@/presentation/components/mainComponents/Loader';


const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  

  const [order, setOrder] = useState<Booking | null>(
    location.state || null // ✅ use location.state if available
  );
  const [loading, setLoading] = useState(!location.state);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userService = new UserService();
        const response = await userService.getOrder(orderId as string);
        if (response.status === HttpStatusCode.OK) {
          setOrder(response.data.booking as Booking);
        } else {
          toast.error('Failed to fetch order details');
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if order was not passed via navigation state
    if (!location.state) {
      fetchOrder();
    }
  }, [orderId, location.state]);

  if (loading) {
    return <Loader isLoading={loading} />
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Order not found or invalid order ID.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* ✅ Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* ✅ Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
            <CardDescription>{order._id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Order Date</span>
              </div>
              <span className="text-sm font-medium">{order.date}</span>
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="font-medium">Items Ordered</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{order.activityTitle}</p>
                    <p className="text-xs text-gray-500">{order.participantCount} participants</p>
                  </div>
                  <span className="text-sm font-medium">
                    {order.participantCount * order.pricePerParticipant}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span>{order.participantCount * order.pricePerParticipant}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ✅ Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" className="flex-1 sm:flex-none bg-transparent">
            Track Order
          </Button>
          <Button variant="destructive" size="lg" className="flex-1 sm:flex-none">
            Cancel Order
          </Button>
          <Button onClick={() => navigate('/home')} variant="default" size="lg" className="flex-1 sm:flex-none">
            Continue Shopping
          </Button>
        </div>

        {/* ✅ Support Info
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default OrderSuccess;
