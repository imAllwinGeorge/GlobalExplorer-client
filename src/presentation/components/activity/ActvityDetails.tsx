"use client";

import {
  MapPin,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Edit,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Activity } from "../../../shared/types/global";
import { Button } from "../ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "@radix-ui/react-select";
import {  useState } from "react";
import { adminService } from "../../../services/AdminService";
import { Switch } from "../../../components/ui/switch";
import toast from "react-hot-toast";
import ConfirmModal from "../ReusableComponents/ConfirmModal";

interface ActivityViewProps {
  role: string;
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onBack?: () => void;
}

export default function ActivityDetails({
  role,
  activity,
  onEdit,
  onBack,
}: ActivityViewProps) {
  const [statusChange, setStatusChange] = useState(activity.isActive);
  const [selectedActvity, setSelectedActivity] = useState<{activityId: string, status: boolean} | null>(null)
  const [isModalOpen, setIsModelOpen] = useState(false);

  const formatDate = (date: Date | string | null | undefined) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const updateStatus = async () => {
    if(!selectedActvity) return;
    try {
      const response = await adminService.updateActivityStatus(selectedActvity?.activityId, {
        isActive: selectedActvity?.status,
      });
      if (response.status === 200) {
        setStatusChange(selectedActvity.status);
        
        toast.success("Activity Status Changed")
      }
    } catch (error) {
      console.log(error);
      if(error instanceof Error) {
        toast.error(error.message)
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {activity.activityName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === "host" ? (
              <Badge variant={activity.isActive ? "default" : "secondary"}>
                {activity.isActive ? "Active" : "Inactive"}
              </Badge>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active-status"
                    checked={statusChange}
                    onCheckedChange={(checked: boolean) =>{
                      setSelectedActivity({activityId: activity._id, status: checked});
                      setIsModelOpen(true)
                    }
                    }
                  />
                  <label htmlFor="active-status">
                    {statusChange ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>
            )}
            {(onEdit&& role === "host") && (
              <Button
                onClick={() => onEdit(activity)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Activity
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Activity Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activity.images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activity.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden"
                        >
                          <img
                            src={`${import.meta.env.VITE_IMG_URL}${image}`}
                            alt={`${activity.activityName} - Image ${
                              index + 1
                            }`}
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>No images available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Activity Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {activity.itenary || "No description available."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Location Details */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Street Address
                      </label>
                      <p className="text-gray-900">{activity.street}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        City
                      </label>
                      <p className="text-gray-900">{activity.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        District
                      </label>
                      <p className="text-gray-900">{activity.district}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        State
                      </label>
                      <p className="text-gray-900">{activity.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Postal Code
                      </label>
                      <p className="text-gray-900">{activity.postalCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Country
                      </label>
                      <p className="text-gray-900">{activity.country}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Coordinates
                    </label>
                    <p className="text-gray-900">
                      Latitude: {activity.location.coordinates[1]}, Longitude:{" "}
                      {activity.location.coordinates[0]}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Price per Head</p>
                      <p className="font-semibold text-lg">
                        {formatPrice(activity.pricePerHead)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Max Capacity</p>
                      <p className="font-semibold">
                        {activity.maxCapacity} people
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reporting Details */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Reporting Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Reporting Place</p>
                    <p className="font-medium">{activity.reportingPlace}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reporting Time</p>
                    <p className="font-medium">{activity.reportingTime}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timestamps */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-sm font-medium">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium">
                      {formatDate(activity.updatedAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModelOpen(false)}
        onConfirm={updateStatus}
        title={`${selectedActvity?.status ? "Unblock" : "Block"} User`}
        message={`Are you sure you want to ${
          selectedActvity?.status ? "Unblock" : "Block"
        } This Activity?`}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
}
