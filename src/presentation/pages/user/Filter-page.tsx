"use client";

import { useState, useCallback, useEffect } from "react";
// import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../../../shared/constants/localStoragekeys";
import type { Activity, Category } from "../../../shared/types/global";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import SearchBox from "../../components/ReusableComponents/Search-box";
import ActivityCard from "../../components/common/ActivityCard";
import { useNavigate } from "react-router-dom";

// interface Category {
//   id: string;
//   categoryName: string;
// }

// interface Activity {
//   id: number;
//   name: string;
//   location: string;
//   category: string;
//   distance: number;
//   price: number;
//   currency: string;
//   maxCapacity: number;
//   duration: string;
//   rating: number;
//   image: string;
// }

interface FilterPageProps {
  onFiltersChange?: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  search: string;
  category: string;
  distance: string;
  priceRange: string;
  lat: number;
  lng: number;
}

const distanceOptions = [
  { value: "", label: "Any distance" },
  { value: "5000", label: "Within 5km" },
  { value: "15000", label: "5km - 15km" },
  { value: "30000", label: "15km - 30km" },
  { value: "50000", label: "30km - 50km" },
  { value: "50000+", label: "50km+" },
];

// const priceRanges = [
//   { value: "", label: "Any price" },
//   { value: "0-50", label: "Under $50" },
//   { value: "50-100", label: "$50 - $100" },
//   { value: "100-200", label: "$100 - $200" },
//   { value: "200-500", label: "$200 - $500" },
//   { value: "500+", label: "$500+" },
// ];

// // Placeholder function for fetching filtered activities - replace with your API call
// async function fetchFilteredActivities(
//   filters: FilterState
// ): Promise<Activity[]> {
//   // Replace this with your actual API call
//   console.log("Fetching activities with filters:", filters);
//   return [];
// }

export default function FilterPage({
  onFiltersChange,
  className = "",
}: FilterPageProps) {
  //   const router = useRouter()
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useLocalStorage(
    LOCAL_STORAGE_KEYS.USER_FILTER_PAGE,
    1
  );
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useLocalStorage<FilterState>(
    LOCAL_STORAGE_KEYS.FILTERS,
    {
      search: "",
      category: "",
      distance: "",
      priceRange: "",
      lat: 0,
      lng: 0,
    }
  );

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(true);

  // Load categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await userService.getCategories();
        if (response.status === 200) {
          setCategories(response.data.categories as Category[]);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchActivities() {
      try {
        setIsLoading(true);
        console.log(filters)
        const response = await userService.filterSearch(page, 9, filters);
        if (response.status === 200) {
          setActivities(response.data.activities as Activity[]);
          setTotalPages(response.data.totalPages as number);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();

    return () => {
      controller.abort(); // abort on dependency change or unmount
    };
  }, [filters, page, triggerFetch]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("Latitude:", pos.coords.latitude);
          console.log("Longitude:", pos.coords.longitude);
          // setPosition([pos.coords.latitude, pos.coords.longitude])
          // setFormData((prev) => ({
          //   ...prev,
          //   location: {
          //     ...prev.location, coordinates: [pos.coords.latitude, pos.coords.longitude]
          //   },
          // }));
          setFilters((prev) => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
        },
        (err) => {
          console.error("Geolocation error:", err.message);
        },
    {
      enableHighAccuracy: true,  // ✅ Request high accuracy (uses GPS when available)
      timeout: 10000,            // ✅ Wait up to 10 seconds
      maximumAge: 0              // ✅ Don't use cached position
    }
      );
    } else {
      console.warn("Geolocation not supported");
    }
  }, [setFilters]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.FILTERS);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_FILTER_PAGE);
    };
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      setFilters((prev) => ({ ...prev, search: query }));
    },
    [setFilters]
  );

  //   const applyFilters = useCallback(async () => {
  //     setIsLoading(true);
  //     try {
  //       const filteredActivities = await fetchFilteredActivities(filters);
  //       setActivities(filteredActivities);
  //       onFiltersChange?.(filters);
  //     } catch (error) {
  //       console.error("Error fetching activities:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }, [filters, onFiltersChange]);

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      distance: "",
      priceRange: "",
      lat: filters.lat,
      lng: filters.lng,
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`space-y-6 px-4 md:px-6 lg:px-12 xl:px-20 ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-orange-700 text-xs px-2 py-1 rounded-full">
              {Object.values(filters).filter((v) => v !== "").length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Controls */}
      <AnimatePresence>
        {(showMobileFilters || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filter Activities
                  </h2>
                </div>
                <div className="lg:hidden">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Search Box */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Activities
                  </label>
                  <SearchBox
                    placeholder="Search by name, location, or description..."
                    onSearch={handleSearch}
                    initialValue={filters.search}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => updateFilter("category", e.target.value)}
                      className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Distance Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance
                    </label>
                    <select
                      value={filters.distance}
                      onChange={(e) => updateFilter("distance", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      {distanceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) =>
                        updateFilter("priceRange", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      {priceRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>

                {/* Filter Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTriggerFetch((prev) => !prev)}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? "Searching..." : "Apply Filters"}
                  </motion.button>

                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearFilters}
                      className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Clear All
                    </motion.button>
                  )}
                </div>

                {/* Active Filters Display */}
                {/* {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 pt-4 border-t border-gray-100"
                  >
                    <span className="text-sm text-gray-600 font-medium">
                      Active filters:
                    </span>
                    {filters.search && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        Search: "{filters.search}"
                        <button
                          onClick={() => updateFilter("search", "")}
                          className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        {
                          categories.find((c) => c._id === filters.category)
                            ?.categoryName
                        }
                        <button
                          onClick={() => updateFilter("category", "")}
                          className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.distance && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        {
                          distanceOptions.find(
                            (d) => d.value === filters.distance
                          )?.label
                        }
                        <button
                          onClick={() => updateFilter("distance", "")}
                          className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.priceRange && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        {
                          priceRanges.find(
                            (p) => p.value === filters.priceRange
                          )?.label
                        }
                        <button
                          onClick={() => updateFilter("priceRange", "")}
                          className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </motion.div>
                )} */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Tour Activities
            {activities.length > 0 && (
              <span className="text-gray-500 font-normal ml-2">
                ({activities.length} found)
              </span>
            )}
          </h2>
        </div>

        {/* Activity Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TODO: Replace this comment with your ActivityCard components */}
          {/* Example: {activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)} */}
          {activities?.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onEdit={() =>
                navigate("/activity-details", { state: activity._id })
              }
              onViewDetails={() =>
                navigate("/activity-details", { state: activity._id })
              }
              currencySymbol="$"
              exchangeRate={83.5}
              secondaryCurrency="INR"
              buttonTitle={"Details"}
            />
          ))}

          {isLoading && (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span>Loading activities...</span>
              </div>
            </div>
          )}

          {!isLoading && activities.length === 0 && hasActiveFilters && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 space-y-2">
                <p className="text-lg">
                  No activities found matching your criteria
                </p>
                <p className="text-sm">
                  Try adjusting your filters or search terms
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear all filters
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      />
    </div>
  );
}
