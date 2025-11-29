import RadioGroup from "@/components/ui/RadioGroup";
import ActivityEdit from "@/presentation/components/activity/ActivityEdit";
import { PriceManagement } from "@/presentation/components/activity/PriceManagement";
import { HttpStatusCode, OPTIONS, ROLE } from "@/shared/constants/constants";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SalesReportPage from "@/presentation/components/sales/Sales.report";
import { ActivityAvailability } from "@/presentation/components/activity/ActivityAvailability";
import toast from "react-hot-toast";
import { hostService } from "@/services/HostService";
import type { Activity } from "@/shared/types/global";

const ActivityDashboard = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const [activity, setActivity] = useState<Activity>();
  const [selected, setSelected] = useState<string | boolean>(
    OPTIONS.activityPage[0].value
  );

  useEffect(() => {
    async function fetchActivity () {
      try {
        const response = await hostService.getActivity(activityId as string);
        if(response.status === HttpStatusCode.OK) {
          setActivity(response.data.activity);
        }
      } catch (error) {
        if(error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
    fetchActivity()
  }, [activityId])
  return (
    <div>
      <RadioGroup
        name={""}
        options={OPTIONS.activityPage}
        value={selected}
        onChange={setSelected}
      />

      <div>
        {selected === OPTIONS.activityPage[0].value && (
          <ActivityEdit
            activityId={activityId}
            onEditSuccess={() => console.log("soigois")}
          />
        )}
        {selected === OPTIONS.activityPage[1].value && (
          <PriceManagement activityId={activityId as string} />
        )}
        {selected === OPTIONS.activityPage[2].value && (
          <ActivityAvailability activityId={activityId as string} activityName={activity?.activityName} recurrenceDays={activity?.recurrenceDays} />
        )}
        {selected === OPTIONS.activityPage[3].value && (
          <SalesReportPage activityId={activityId} role={ROLE.HOST} />
        )}
      </div>
    </div>
  );
};

export default ActivityDashboard;
