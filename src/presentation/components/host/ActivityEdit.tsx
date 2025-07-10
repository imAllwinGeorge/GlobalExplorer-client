"use client";

import type React from "react";

import { useState } from "react";
import { easeOut, motion } from "framer-motion";
import {
  Save,
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  ImageIcon,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import Input from "../Input";
import { Textarea } from "../../../components/ui/textarea";
import { Separator } from "../../../components/ui/separator";
import { Switch } from "../../../components/ui/switch";
import type { Activity } from "../../../shared/types/global";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import toast from "react-hot-toast";
import { HostService } from "../../../services/HostService";

interface ActivityEditProps {
  activity: Activity;
  onSave?: (activity: Activity, images: File[]) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface Props {
  center: LatLngExpression;
}

// Placeholder function for getting coordinates from address
const getLocationFromAddress = async (
  address: string
): Promise<[number, number]> => {
  // This is a placeholder function - you can integrate with your preferred geocoding API
  // For example: Google Maps Geocoding API, Mapbox, or OpenStreetMap Nominatim
  try {
    // Simulated API call
    console.log("Getting location for address:", address);
    // Return default coordinates for now
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${import.meta.env.VITE_MAP_API}`
    );
    const result = await response.json();
    // console.log(result);
    const { lat, lng } = result.results[0].geometry;
    // setPosition([lat, lng])

    return [lat, lng];
  } catch (error) {
    console.error("Error getting location:", error);
    return [0, 0];
  }
};

export default function ActivityEdit({
  activity,
  onSave,
  onCancel,
  isLoading = false,
}: ActivityEditProps) {
  const [formData, setFormData] = useState<Activity>({
    ...activity,
    updatedAt: new Date(),
  });
  const [images, setImages] = useState<File[]>([]);
  const [statusChange, setStatusChange] = useState(activity.isActive)
  const hostService = new HostService();

  const handleInputChange = (
    field: keyof Activity,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "maxCapacity" || field === "pricePerHead"
          ? Number(value)
          : value,
    }));
  };

  const handleLocationChange = (index: 0 | 1, value: string) => {
    const newLocation = [...formData.location] as [number, number];
    newLocation[index] = Number.parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      location: newLocation,
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData, images);
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

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: easeOut },
    },
  };

  const ChangeView = ({ center }: Props) => {
    const map = useMap();
    map.setView(center); // This moves the map to the new center
    return null;
  };

  const handleAddressChange = async () => {
    const address = `${formData.street}, ${formData.city}, ${formData.district}, ${formData.state}, ${formData.postalCode}, ${formData.country}`;
    if (address.trim().length > 10) {
      try {
        const coordinates = await getLocationFromAddress(address);
        setFormData((prev) => ({
          ...prev,
          location: coordinates,
        }));
      } catch (error) {
        console.error("Failed to get location:", error);
      }
    }
  };

  const updateStatus = async (id: string, status: boolean) => {
    try {
      const response = await hostService.updateStatus(id, {isActive: status})
      if(response.status === 200){
        toast.success(response.data.message || "status changed successfull")
        setStatusChange(status)
        setFormData((prev) => ({...prev, isActive: status}))
      }
    } catch (error) {
      if(error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            {onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Edit Activity
              </h1>
              <p className="text-gray-600 mt-1">
                Activity Name: {activity.activityName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="active-status"
                checked={statusChange}
                onCheckedChange={(checked: boolean) =>
                  updateStatus(activity._id, checked)
                }
              />
              <label htmlFor="active-status">
                {formData.isActive ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Basic Information */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="activityName">Activity Name *</label>
                      <Input
                        id="activityName"
                        value={formData.activityName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("activityName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="categoryId">Category ID *</label>
                      <Input
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("categoryId", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="itenary">Activity Description</label>
                    <Textarea
                      id="itenary"
                      value={formData.itenary}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("itenary", e.target.value)
                      }
                      rows={4}
                      placeholder="Describe the activity, what's included, and what guests can expect..."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pricing & Capacity */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing & Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pricePerHead">
                        Price per Head (USD) *
                      </label>
                      <Input
                        id="pricePerHead"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.pricePerHead}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            "pricePerHead",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="maxCapacity">Maximum Capacity *</label>
                      <Input
                        id="maxCapacity"
                        type="number"
                        min="1"
                        value={formData.maxCapacity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            "maxCapacity",
                            Number.parseInt(e.target.value) || 1
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Location Information */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="street">Street Address *</label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("street", e.target.value)
                        }
                        onBlur={handleAddressChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="city">City *</label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("city", e.target.value)
                        }
                        onBlur={handleAddressChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="district">District</label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("district", e.target.value)
                        }
                        onBlur={handleAddressChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="state">State *</label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("state", e.target.value)
                        }
                        onBlur={handleAddressChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode">Postal Code</label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("postalCode", e.target.value)
                        }
                        onBlur={handleAddressChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="country">Country *</label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("country", e.target.value)
                        }
                        onBlur={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="w-full bg-gray-50 p-4 rounded-lg">
                      <MapContainer
                        center={formData.location}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: "300px", width: "200%" }}
                      >
                        <ChangeView center={formData.location} />
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={formData.location}>
                          <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="latitude">Latitude</label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.location[0]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleLocationChange(0, e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="longitude">Longitude</label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.location[1]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleLocationChange(1, e.target.value)
                        }
                      />
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="reportingPlace">Reporting Place *</label>
                      <Input
                        id="reportingPlace"
                        value={formData.reportingPlace}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("reportingPlace", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="reportingTime">Reporting Time *</label>
                      <Input
                        id="reportingTime"
                        value={formData.reportingTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("reportingTime", e.target.value)
                        }
                        placeholder="e.g., 2:00 PM"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Images */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Activity Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Images */}
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <label>Current Images</label>
                      <div className="space-y-2">
                        {formData.images.map((image, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 border rounded"
                          >
                            <motion.div
                              variants={imageVariants}
                              className="h-full p-5"
                            >
                              <img
                                src={`${import.meta.env.VITE_IMG_URL}${image}`}
                                alt={image as string}
                                width={400}
                                height={300}
                                className="w-full h-64 lg:h-full object-cover rounded-3xl"
                              />
                            </motion.div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-500"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-4 h-4 " />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* images */}
                  <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Activity images
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          setImages((prev) => [...prev, ...files]);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img
                            src={URL.createObjectURL(image as File)}
                            alt={`Activity ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-end gap-4 pt-6"
            >
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
