"use client"

import { easeOut, motion } from "framer-motion"
import { MapPin, Clock, Users, Calendar, Pencil } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../ui/button"
import { Badge } from "../../../components/ui/badge"
import type { Activity } from "../../../shared/types/global"



interface ActivityCardProps {
  activity: Activity
  onEdit?: (activity: Activity) => void
  onViewDetails?: (activity: Activity) => void
  showDates?: boolean
  currencySymbol?: string
  exchangeRate?: number
  secondaryCurrency?: string
  buttonTitle?: string
}

export default function ActivityCard({
  activity,
  onEdit,
  onViewDetails,
  showDates = true,
  currencySymbol = "$",
  exchangeRate = 83.5,
  secondaryCurrency = "INR",
  buttonTitle,
}: ActivityCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price)
  }

  const getSecondaryPrice = (price: number) => {
    return Math.round(price * exchangeRate)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2, ease: easeOut },
    },
  }

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: easeOut },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="w-full max-w-4xl m-4"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-2/5 relative overflow-hidden ml-3">
              <motion.div variants={imageVariants} className="w-full h-full relative">
                <img
                  src={`${import.meta.env.VITE_IMG_URL}${activity.images[0]}`}
                  alt={activity.activityName}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
              {!activity.isActive && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-white bg-red-600">
                    Currently Unavailable
                  </Badge>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="lg:w-3/5 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Title and Location */}
                <div>
                  <motion.h3
                    className="text-xl lg:text-2xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {activity.activityName}
                  </motion.h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {activity.city}, {activity.state}, {activity.country}
                    </span>
                  </div>
                </div>

                {/* Activity Details */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Max Capacity: {activity.maxCapacity} people</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Reporting Time: {activity.reportingTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Meeting Point: {activity.reportingPlace}</span>
                  </div>
                </motion.div>

                {/* Itinerary Preview */}
                {activity.itenary && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                      onClick={() => onViewDetails?.(activity)}
                    >
                      {"What's Included in this Activity? >"}
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Pricing and Action Section */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mt-6 space-y-4 lg:space-y-0">
                {/* Price Information */}
                <motion.div
                  className="text-right lg:text-left"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-sm text-gray-500 mb-1">Price from</div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {currencySymbol}
                    {formatPrice(activity.pricePerHead)} USD
                  </div>
                  <div className="text-lg text-gray-600">
                    ₹{formatPrice(getSecondaryPrice(activity.pricePerHead))} {secondaryCurrency}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{activity.maxCapacity} bookings are left</div>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 p-0 h-auto"
                    onClick={() => onViewDetails?.(activity)}
                  >
                    Rate Details
                  </Button>
                </motion.div>

                {/* Action Button */}
                {showDates && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {buttonTitle === "EDIT" ?<Button
                      className="w-full lg:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg font-semibold"
                      onClick={() => onEdit?.(activity)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      {buttonTitle}
                    </Button>: <Button
                      className="w-full lg:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg font-semibold"
                      onClick={() => onViewDetails?.(activity)}
                      disabled={!activity.isActive}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {buttonTitle}
                    </Button>}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
