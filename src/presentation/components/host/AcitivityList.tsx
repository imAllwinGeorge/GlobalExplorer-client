import { useState } from "react";
import { HostService } from "../../../services/HostService";
import type { Activity } from "../../../shared/types/global";
import ActivityCard from "../common/ActivityCard";
import ActivityDetails from "./ActvityDetails";
import ActivityEdit from "./ActivityEdit";

type ActivityListProps = {
  activities: Activity[];
  role: string;
};

const AcitivityList = ({ activities, role }: ActivityListProps) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const hostService = new HostService();

  const handleEdit = (activity: Activity) => {
    setEditActivity(activity);
  };

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const updateActivity = async (activity: Activity, images: File[]) => {
    const data = new FormData();

    data.append("activityName", activity.activityName);
    data.append("itenary", activity.itenary);
    data.append("maxCapacity", activity.maxCapacity.toString());
    data.append("categoryId", activity.categoryId);
    data.append("pricePerHead", activity.pricePerHead.toString());
    data.append("userId", activity.userId);
    data.append("street", activity.street);
    data.append("city", activity.city);
    data.append("district", activity.district);
    data.append("state", activity.state);
    data.append("postalCode", activity.postalCode);
    data.append("country", activity.country);
    data.append("reportingPlace", activity.reportingPlace);
    data.append("reportingTime", activity.reportingTime);
    data.append("existingImage", JSON.stringify(activity.images));
    data.append("location", JSON.stringify(activity.location));

    images.forEach((file) => {
      data.append("images", file);
    });

    try {
      const response = await hostService.editActivity(activity._id, data);
      console.log("Activity updated:", response.data);
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  // When either detail or edit is active, hide activity list
  const showOverlay = selectedActivity || editActivity;

  return (
    <div className="container mx-auto px-4">
      {!showOverlay && (
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Activities</h1>
          <div className="space-y-6">
            {activities?.map((activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
                onEdit={handleEdit}
                onViewDetails={handleViewDetails}
                currencySymbol="$"
                exchangeRate={83.5}
                secondaryCurrency="INR"
                buttonTitle={role === "host" ? "EDIT" : "Details"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Activity Details View */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <ActivityDetails
            role={role}
            activity={selectedActivity}
            onEdit={handleEdit}
            onBack={() => setSelectedActivity(null)}
          />
        </div>
      )}

      {/* Fullscreen Activity Edit View */}
      {editActivity && role === "host" && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <ActivityEdit
            activity={editActivity}
            onSave={updateActivity}
            onCancel={() => setEditActivity(null)}
          />
        </div>
      )}
    </div>
  );
};

export default AcitivityList;
