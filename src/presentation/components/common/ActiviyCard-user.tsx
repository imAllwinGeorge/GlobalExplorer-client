"use client"

import { easeOut, motion } from "framer-motion"
// import { Star } from "lucide-react"
import type { Activity } from "../../../shared/types/global"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"

interface UserActivityCardProps {
  activity: Activity
  onCardClick?: (activity: Activity) => void
  currencySymbol?: string
  exchangeRate?: number
  secondaryCurrency?: string
  discountPercentage?: number
}

export default function ActivtyCardUser({
  activity,
  onCardClick,
  // currencySymbol = "₹",
  // exchangeRate = 83.5,
//   secondaryCurrency = "INR",
  discountPercentage = 20,
}: UserActivityCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price)
  }

  // const getConvertedPrice = (price: number) => {
  //   return Math.round(price * exchangeRate)
  // }

  // const getDiscountedPrice = (price: number) => {
  //   return Math.round(price * (1 - discountPercentage / 100))
  // }

  // Mock duration calculation - you can replace this with actual duration from your data
  const getDuration = () => {
    // This is a placeholder - replace with actual duration logic
    const durations = ["2H", "3H", "6H", "1D", "2D", "3N/4D", "6D/5N", "7N/8D"]
    return durations[Math.floor(Math.random() * durations.length)]
  }

  // Mock rating - replace with actual rating from your data
  // const getRating = () => {
  //   return {
  //     rating: (4.0 + Math.random() * 1).toFixed(1),
  //     reviews: Math.floor(1000 + Math.random() * 5000),
  //   }
  // }

  // const { rating, reviews } = getRating()
  // const convertedPrice = getConvertedPrice(activity.pricePerHead)
  // const discountedPrice = getDiscountedPrice(convertedPrice)

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
}

const imageVariants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
      ease: easeOut,
    },
  },
}

  return (
    <div className="w-full max-w-sm mx-auto p-2">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="cursor-pointer group"
        onClick={() => onCardClick?.(activity)}
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all py-0 duration-500 bg-white rounded-2xl">
          <CardContent className="p-0">
            {/* Image Section - Increased height and improved responsiveness */}
            <div className="relative w-full h-[280px] sm:h-[320px] md:h-[280px] overflow-hidden rounded-t-2xl">
              <motion.div variants={imageVariants} className="w-full h-full relative">
                <img
                  src={`${import.meta.env.VITE_IMG_URL}${activity.images[0]}`}
                  alt={activity.activityName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

                {/* Duration Badge */}
                <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border-0">
                  <span className="flex items-center gap-1">⏱️ {getDuration()}</span>
                </Badge>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                    -{discountPercentage}%
                  </Badge>
                )}

                {/* Unavailable Overlay */}
                {!activity.isActive && (
                  <motion.div
                    className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge
                      variant="secondary"
                      className="text-white bg-red-600 text-sm px-4 py-2 rounded-full font-semibold"
                    >
                      Currently Unavailable
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Content Section - Enhanced spacing and typography */}
            <motion.div variants={contentVariants} className="p-5 sm:p-6 space-y-4">
              {/* Title */}
              <motion.h3
                className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {activity.activityName}
              </motion.h3>

              {/* Rating Section
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-900">{activity.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({formatPrice(activity.reviews)} reviews)</span>
                </div>
              </motion.div> */}

              {/* Pricing Section - Enhanced layout */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {/* Original Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 line-through">
                    ₹
                    {formatPrice(activity.pricePerHead)}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">per person</span>
                </div>

                {/* Discounted Price
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {activity.currencySymbol}
                    {formatPrice(activity.discountedPrice)}
                  </span>
                  <span className="text-base text-gray-600 font-medium">/ person</span>
                </div> */}
              </motion.div>

              {/* Action hint */}
              <motion.div
                className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
              >
                <div className="text-center">
                  <span className="text-sm text-blue-600 font-medium">Click to view details →</span>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
