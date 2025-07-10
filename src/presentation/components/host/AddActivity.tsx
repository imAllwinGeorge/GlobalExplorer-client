"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ActivityDTO } from "../../../shared/types/DTO";
import { HostService } from "../../../services/HostService";
import type { Category } from "../../../shared/types/global";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

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

interface Props {
  center: LatLngExpression;
}

type AddActivityProps = {
  onClose: () => void
}

export default function AddActivity({onClose}: AddActivityProps) {
  const user = useSelector((state: RootState) => state.host.host)
  const [formData, setFormData] = useState<ActivityDTO>({
    activityName: "",
    itenary: "",
    maxCapacity: 0,
    categoryId: "",
    pricePerHead: 0,
    userId: user?._id || "",
    street: "",
    city: "",
    district: "",
    state: "",
    postalCode: "",
    country: "",
    location: [0, 0],
    images: [],
    reportingPlace: "",
    reportingTime: "",
  });

  const [categories, setCategories] = useState<Category[] | null>(null);
  const hostService = new HostService();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "maxCapacity" || name === "pricePerHead"
          ? Number(value)
          : value,
    }));
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Activity Data:", formData);
    // Handle form submission here
    const data = new FormData();

  // Append text fields
  data.append("activityName", formData.activityName);
  data.append("itenary", formData.itenary);
  data.append("maxCapacity", formData.maxCapacity.toString());
  data.append("categoryId", formData.categoryId);
  data.append("pricePerHead", formData.pricePerHead.toString());
  data.append("userId", formData.userId);
  data.append("street", formData.street);
  data.append("city", formData.city);
  data.append("district", formData.district);
  data.append("state", formData.state);
  data.append("postalCode", formData.postalCode);
  data.append("country", formData.country);
  data.append("reportingPlace", formData.reportingPlace);
  data.append("reportingTime", formData.reportingTime);

  // Append location (as JSON or individual fields)
  data.append("location", JSON.stringify(formData.location));

  // Append images
  formData.images.forEach((file) => {
    data.append("images", file); // backend should use multer or similar
  });

  try {
    const response = await hostService.addActivity(data); // Ensure this sends FormData
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await hostService.getCategories();
        if (response.status === 200) {
          setCategories(response.data.categories as Category[]);
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("Latitude:", pos.coords.latitude);
          console.log("Longitude:", pos.coords.longitude);
          // setPosition([pos.coords.latitude, pos.coords.longitude])
          setFormData((prev) => ({
            ...prev,
            location: [pos.coords.latitude, pos.coords.longitude],
          }));
        },
        (err) => {
          console.error("Geolocation error:", err.message);
        }
      );
    } else {
      console.warn("Geolocation not supported");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Add New Activity
              </h1>
              <p className="text-gray-600">
                Create a new activity for your guests to explore
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Name *
                    </label>
                    <input
                      type="text"
                      name="activityName"
                      value={formData.activityName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Enter activity name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category ID *
                    </label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select category</option>
                      {categories &&
                        categories.map((category) => (
                          <option value={category._id} key={category._id}>
                            {category.categoryName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Capacity *
                    </label>
                    <input
                      type="number"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Maximum participants"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Per Head *
                    </label>
                    <input
                      type="number"
                      name="pricePerHead"
                      value={formData.pricePerHead}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Price in USD"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Itinerary *
                  </label>
                  <textarea
                    name="itenary"
                    value={formData.itenary}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Describe the activity itinerary..."
                    required
                  />
                </div>
              </motion.section>

              {/* Location Information */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Location Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      onBlur={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      onBlur={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="District"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="State"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      onBlur={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Postal code"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      onBlur={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <MapContainer
                    center={formData.location}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "300px", width: "100%" }}
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
              </motion.section>

              {/* Meeting Information */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Meeting Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reporting Place *
                    </label>
                    <input
                      type="text"
                      name="reportingPlace"
                      value={formData.reportingPlace}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Where participants should meet"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reporting Time *
                    </label>
                    <input
                      type="time"
                      name="reportingTime"
                      value={formData.reportingTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </motion.section>

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
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Activity ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end space-x-4 pt-6 border-t"
              >
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all transform hover:scale-105"
                >
                  Create Activity
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
