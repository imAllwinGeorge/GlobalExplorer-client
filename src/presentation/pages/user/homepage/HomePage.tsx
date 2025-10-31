import PrivateHeader from "../../../components/mainComponents/PrivateHeader";
import { userService } from "../../../../services/UserService";
import { useEffect, useState } from "react";
import { HttpStatusCode } from "../../../../shared/constants/constants";
import ImageGallery from "../../../components/home/ImageGallery";
import type{ Activity, GalleryImages } from "../../../../shared/types/global";
import Pagination from "@/presentation/components/common/Pagination";
import ActivityCard from "@/presentation/components/common/ActivityCard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImages[]>();
  const [activities, setActivities] = useState<Activity[] >()
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const getHomePageData = async () => {
      try {
        const response = await userService.getHomeData(page, 6);
        console.log(response);
        if (response.status === HttpStatusCode.OK) {
          setImages(response.data.images as GalleryImages[]);
          setActivities(response.data.activities )
          setTotalPages(response.data.totalPages as number)
        }
      } catch (error) {
        console.log(error);
      }
    };
    getHomePageData();
  }, [page]);
  return (
    <div>
      <PrivateHeader />

      <div className="container mx-auto px-8 md:px-10 lg:px-14">
        <h1 className="text-3xl font-bold text-center mb-8">Activities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities?.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onEdit={() =>
                navigate(`/activity-details/${activity._id}`)
              }
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

      {images && <ImageGallery images={images} />}
    </div>
  );
};

export default HomePage;
