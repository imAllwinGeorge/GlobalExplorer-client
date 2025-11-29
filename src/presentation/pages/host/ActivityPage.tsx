import { useEffect, useState } from "react";
import AddActivity from "../../components/activity/AddActivity";
// import AcitivityList from "../../components/activity/AcitivityList";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { hostService } from "../../../services/HostService";
import type { Activity } from "../../../shared/types/global";
import Pagination from "../../components/common/Pagination";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { HttpStatusCode, LOCAL_STORAGE_KEYS, OPTIONS } from "../../../shared/constants/constants";
import SearchBox from "../../components/sharedElements/Search-box";
import RadioGroup from "../../../components/ui/RadioGroup";
import ReusableTable from "@/presentation/components/sharedElements/SharedTable";
import { useNavigate } from "react-router-dom";

const columns = [
  "index",
  "activityName",
  "pricePerHead",
  "maxCapacity",
  "action"
]

const columnheaders = {
  index: "#",
  activityName: "Activity Name",
  pricePerHead: "Price",
  maxCapacity: "Capacity",
  action: "Action"
}


const ActivityPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [page, setPage] = useLocalStorage(
    LOCAL_STORAGE_KEYS.HOST_ACTIVITY_PAGE,
    1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<string | boolean>(OPTIONS.host[0].value)
  const [triggerFetch, setTriggerFetch] = useState(true);
  const user = useSelector((state: RootState) => state.host.host);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      try {
        const response = await hostService.getActivities(user?._id, page, 6, searchQuery, selected);
        if (response.status === HttpStatusCode.OK) {
          console.log("fetched activities", response);
          setActivities(response.data.activities as Activity[]);
          setTotalPages(response.data.totalPages as number);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchActivity();

    return () => {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.HOST_ACTIVITY_PAGE);
    };

  }, [page, triggerFetch, searchQuery, selected, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Activities
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your activities and create new experiences
              </p>
            </div>

            {/* Add Activity Button */}
            <Button
              onClick={() => setIsOpenModal(true)}
              className="bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Activity</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <SearchBox placeholder="search for activities....." onSearch={(query) => setSearchQuery(query)} />
          <RadioGroup name="activities" value={selected} options={OPTIONS.host} onChange={setSelected} />
        {/* Activity List */}
        {activities && (
          <div className="mb-8">
            {/* <AcitivityList
              activities={activities}
              role={ROLE.HOST}
              refetch={() => setTriggerFetch((prev) => !prev)}
            /> */}

            <ReusableTable title="Activities" data={activities} columnHeaders={columnheaders} columns={columns} renderCell={
              (col, row) => {
                if(col === "index") return activities.indexOf(row) +1
                if(col === "activityName") return <button className="text-blue-600" onClick={() => navigate(`/host/activity/dashboard/${row._id}`)}>{row.activityName}</button>
                if(col === "action") return <button>{row.isActive === true? "Block": "Unblock"}</button>
                return String(row[col as keyof Activity]);
              }
            } />
          </div>
        )}

        {/* Empty State */}
        {(!activities || activities.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No activities yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first activity
            </p>
            <Button
              onClick={() => setIsOpenModal(true)}
              className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Activity</span>
            </Button>
          </div>
        )}

        {/* Pagination */}
        {activities && activities.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((prev: number) => Math.max(prev - 1, 1))}
            onNext={() =>
              setPage((prev: number) => Math.min(prev + 1, totalPages))
            }
          />
        )}
      </div>

      {/* Modal - Full Screen Overlay */}
      {isOpenModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 bg-opacity-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
              <AddActivity
                onClose={() => {
                  setIsOpenModal(false);
                  setTriggerFetch((prev) => !prev);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
