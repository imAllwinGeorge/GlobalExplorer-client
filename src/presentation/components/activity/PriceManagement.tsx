"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, DollarSign, TrendingUp, Tag, Info } from "lucide-react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { hostService } from "@/services/HostService";
import { HttpStatusCode } from "@/shared/constants/constants";
import type { Activity } from "@/shared/types/global";

// interface PriceManagementData {
//   pricePerHead: number
//   dynamicPricingEnabled: boolean
//   maxDynamicPercentage: number
//   offerPercentage: number
//   activityName: string
//   maxCapacity: number
// }

interface CommissionBreakdown {
  total: number;
  commission: number;
  hostRevenue: number;
}

const COMMISSION_RATE = 0.1; // 10% commission
interface PriceManagementProps {
  activityId: string;
}

export function PriceManagement({ activityId }: PriceManagementProps) {
  const [formData, setFormData] = useState<Partial<Activity>>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Calculate commission breakdown
  const calculateCommission = (): CommissionBreakdown => {
    const basePrice = formData?.basePrice ?? 0;
    const afterOffer = basePrice * (1 - (formData?.offerPercentage || 0) / 100);
    const commission = afterOffer * COMMISSION_RATE;
    const hostRevenue = afterOffer - commission;

    return {
      total: afterOffer,
      commission,
      hostRevenue,
    };
  };

  const breakdown = calculateCommission();

  // Handle base price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    const offerPercentage = formData?.offerPercentage ?? 0;
    const pricePerHead = value * (offerPercentage / 100);

    setFormData((prev) => ({
      ...prev,
      basePrice: value,
      pricePerHead,
    }));
  };

  // Handle dynamic pricing toggle
  const handleDynamicPricingToggle = (enabled: boolean) => {
    setFormData((prev) => ({ ...prev, dynamicPricingEnabled: enabled }));
  };

  // Handle offer percentage change
  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      0,
      Math.min(100, Number.parseFloat(e.target.value) || 0)
    );
    const basePrice = formData?.basePrice ?? 0
    const pricePerHead = basePrice - (basePrice * (value / 100));
    setFormData((prev) => ({ ...prev, offerPercentage: value, pricePerHead }));
  };

  // Handle max dynamic percentage change
  const handleMaxDynamicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, maxDynamicPercentage: value }));
  };

  // API: Save pricing settings
  const handleSavePrice = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await hostService.updatePricing(activityId, {
        pricePerHead: Number(formData?.pricePerHead),
        offerPercentage: Number(formData?.offerPercentage),
        basePrice: Number(formData?.basePrice),
      });

      if (response.status === HttpStatusCode.OK && response.data.activity) {
        setFormData((prev) => ({
          ...prev,
          pricePerHead: response.data.activity!.pricePerHead,
          offerPercentage: response.data.activity!.offerPercentage,
          basePrice: response.data.activity!.basePrice,
        }));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // API: Update dynamic pricing settings
  const handleUpdateDynamicPricing = async () => {
    setLoading(true);
    setError(null);

    try {
      // API Call Structure:
      // PATCH /api/activities/{activityId}/dynamic-pricing
      const response = await hostService.updateDynamicPricing(activityId, {
        dynamicPricingEnabled: formData?.dynamicPricingEnabled as boolean,
        maxDynamicPercentage: formData?.maxDynamicPercentage as number,
      });

      if (response.status === HttpStatusCode.OK && response.data.activity) {
        setFormData((prev) => ({
          ...prev,
          dynamicPricingEnabled: response.data.activity!.dynamicPricingEnabled,
          maxDynamicPercentage: response.data.activity!.maxDynamicPercentage,
        }));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  //   // API: Validate offer before applying
  //   const validateOffer = async (percentage: number) => {
  //     try {
  //       // API Call Structure:
  //       // POST /api/offers/validate
  //       const response = await fetch("/api/offers/validate", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           offerPercentage: percentage,
  //           basePrice: formData.pricePerHead,
  //           minimumPrice: 100, // Define your minimum acceptable price
  //         }),
  //       })

  //       return response.ok
  //     } catch (err) {
  //       console.error("Offer validation error:", err)
  //       return false
  //     }
  //   }

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await hostService.getActivity(activityId);
        if (response.status === HttpStatusCode.OK) {
          setFormData(response.data.activity as Activity);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchActivity();
  }, [activityId]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Price Management</h1>
        <p className="text-gray-600">
          Manage pricing for{" "}
          <span className="font-semibold">{formData?.activityName}</span>
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 border border-green-300 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">✓ Changes saved successfully</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Pricing Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Price Card */}
          <Card className="border-2 border-black">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-black" />
                <CardTitle className="text-black">
                  Base Price Per Person
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                This is the total price customers will pay per person. The 10%
                commission will be deducted from this amount.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  base Per Head
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={formData?.basePrice}
                    onChange={handlePriceChange}
                    className="w-full pl-8 pr-4 py-3 border-2 border-black rounded-lg text-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter price"
                    min="0"
                    step="1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Set this to the total amount you want to charge per person.
                  The 10% platform commission will be automatically deducted.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Current Price Per Head
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="font-semibold text-black">
                    ₹{formData?.pricePerHead}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Set this to the total amount you want to charge per person.
                  The 10% platform commission will be automatically deducted.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Offer Card */}
          <Card className="border-2 border-black">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-black" />
                <CardTitle className="text-black">Special Offer</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Provide a percentage discount on the base price
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Offer Discount Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData?.offerPercentage}
                    onChange={handleOfferChange}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black font-semibold">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Example: Enter 10 for a 10% discount. The offer is applied
                  to the base price before commission calculation.
                </p>
              </div>

              {/* Offer Preview */}
              {formData &&
                formData.offerPercentage &&
                formData?.offerPercentage > 0 && (
                  <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">
                      Price after offer:
                    </p>
                    <p className="text-lg font-bold text-black">
                      ₹{breakdown.total.toFixed(2)}
                      <span className="text-sm text-gray-600 ml-2">
                        (from ₹{formData?.pricePerHead})
                      </span>
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Dynamic Pricing Card */}
          <Card className="border-2 border-black">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-black" />
                <CardTitle className="text-black">Dynamic Pricing</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Automatically adjust prices based on demand and capacity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <div>
                  <p className="font-medium text-black">
                    Enable Dynamic Pricing
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Prices will increase during rush hours and decrease when
                    bookings are slow. Price will never go below the base price.
                  </p>
                </div>
                <Switch
                  checked={formData?.dynamicPricingEnabled}
                  onCheckedChange={handleDynamicPricingToggle}
                  className="ml-4"
                />
              </div>

              {formData?.dynamicPricingEnabled && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Maximum Price Increase Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.maxDynamicPercentage}
                      onChange={handleMaxDynamicChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-lg text-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="20"
                      min="0"
                      max="100"
                      step="1"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black font-semibold">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Example: If you set 20%, prices can increase up to 20%
                    above the base price during peak times. Minimum price always
                    remains at ₹{formData.pricePerHead}.
                  </p>

                  <div className="mt-3 p-3 bg-blue-50 border border-blue-300 rounded-lg flex gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">
                      Dynamic pricing adjusts automatically based on real-time
                      bookings and rush hours detected by our system.
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpdateDynamicPricing}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white border-2 border-black"
              >
                {loading ? "Updating..." : "Update Dynamic Pricing Settings"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Commission Breakdown */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-black sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-black">Commission Breakdown</CardTitle>
              <CardDescription className="text-gray-600">
                Detailed breakdown of your earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-3 pb-4 border-b-2 border-black">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Price</span>
                  <span className="font-semibold text-black">
                    ₹{breakdown.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Platform Commission (10%)
                  </span>
                  <span className="font-semibold text-red-600">
                    -₹{breakdown.commission.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Host Revenue */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <p className="text-xs text-gray-600 mb-1">
                  You Receive Per Person
                </p>
                <p className="text-2xl font-bold text-black">
                  ₹{breakdown.hostRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {((breakdown.hostRevenue / breakdown.total) * 100).toFixed(0)}
                  % of total price
                </p>
              </div>

              {/* Info */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-300">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <span className="font-semibold">Commission Explained:</span>{" "}
                  The 10% platform commission is calculated on the final price
                  (after any offers) and helps us maintain the platform and
                  provide customer support.
                </p>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSavePrice}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white border-2 border-black font-semibold py-3"
              >
                {loading ? "Saving..." : "Save Base Price & Offer"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
