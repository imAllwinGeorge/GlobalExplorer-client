import { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import type { Activity } from "../../../shared/types/global";
import Carousel from "../../components/common/Carousel";
import ActivityCard from "../../components/common/ActivityCard";
import { useNavigate } from "react-router-dom";
import { HttpStatusCode } from "../../../shared/constants/constants";
import SearchBox from "../../components/sharedElements/Search-box";
import Loader from "@/presentation/components/mainComponents/Loader";
const ActivityPageUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleCardClick = (activity: Activity) => {
    console.log("Card clicked:", activity.activityName);
    // Handle card click - navigate to details page, etc.
    navigate(`/activity-details/${activity._id}`);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getAllActivities(
          page,
          6,
          searchQuery
        );
        if (response.status === HttpStatusCode.OK) {
          setActivities(response.data.activities as Activity[]);
          setTotalPages(response.data.totalPages as number);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error("error fetching data...");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [page, searchQuery]);

  if (isLoading) {
    <Loader isLoading={isLoading} />;
  }
  return (
    <div>
      <SearchBox
        placeholder="Search for activities....."
        onSearch={(query) => setSearchQuery(query)}
      />
      {activities && (
        <div className="min-h-screen bg-gray-50 py-8">
          <Carousel
            activities={activities}
            onCardClick={handleCardClick}
            title="Popular Activities"
          />
        </div>
      )}

      <div className="container mx-auto px-8 md:px-10 lg:px-14">
        <h1 className="text-3xl font-bold text-center mb-8">Activities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities?.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onEdit={() => navigate(`/activity-details/${activity._id}`)}
              onViewDetails={() =>
                navigate(`/activity-details/${activity._id}`)
              }
              currencySymbol="$"
              exchangeRate={83.5}
              secondaryCurrency="INR"
              buttonTitle={"Details"}
            />
          ))}
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
};

export default ActivityPageUser;
