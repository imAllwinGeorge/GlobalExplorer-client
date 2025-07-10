import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../../services/AdminService";
import type { Activity } from "../../../shared/types/global";
import AcitivityList from "../../components/host/AcitivityList";
import Pagination from "../../components/common/Pagination";

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await adminService.getActivities(page, 6);
        if (response.status === 200) {
          setActivities(response.data.activities as Activity[]);
          setTotalPages(response.data.totalPages as number);
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchActivities();
  }, [page]);
  return (
    <div>
      {activities && <AcitivityList activities={activities} role="admin" />}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => {
          setPage((prev) => Math.min(prev + 1, totalPages));
        }}
      />
    </div>
  );
};

export default ActivityPage;
