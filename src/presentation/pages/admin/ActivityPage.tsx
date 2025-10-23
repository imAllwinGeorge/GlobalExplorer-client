import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../../services/AdminService";
import type { Activity } from "../../../shared/types/global";
import AcitivityList from "../../components/activity/AcitivityList";
import Pagination from "../../components/common/Pagination";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  HttpStatusCode,
  LOCAL_STORAGE_KEYS,
  ROLE,
} from "../../../shared/constants/constants";
import SearchBox from "@/presentation/components/sharedElements/Search-box";
import RadioGroup from "@/components/ui/RadioGroup";

const options = [
  { label: "Active", value: true },
  { label: "InActive", value: false },
];

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [selected, setSelected] = useState<string | boolean>(options[0].value);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [page, setPage] = useLocalStorage(
    LOCAL_STORAGE_KEYS.ADMIN_ACTIVITY_PAGE,
    1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await adminService.getActivities(page, 6, searchQuery, selected);
        console.log(response);
        if (response.status === HttpStatusCode.OK) {
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
  }, [page, triggerFetch, searchQuery, selected]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_ACTIVITY_PAGE);
    };
  }, []);
  return (
    <div>
      <SearchBox
        placeholder="Search for activities...."
        onSearch={(query) => setSearchQuery(query)}
      />
      <RadioGroup
        name="activities"
        value={selected}
        options={options}
        onChange={setSelected}
      />
      {activities && (
        <AcitivityList
          activities={activities}
          role={ROLE.ADMIN}
          refetch={() => setTriggerFetch((prev) => !prev)}
        />
      )}
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
