import RadioGroup from "@/components/ui/RadioGroup";
import ActivityEdit from "@/presentation/components/activity/ActivityEdit";
import { PriceManagement } from "@/presentation/components/activity/PriceManagement";
import { OPTIONS, ROLE } from "@/shared/constants/constants";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SalesReportPage from "@/presentation/components/sales/Sales.report";

const ActivityDashboard = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const [selected, setSelected] = useState<string | boolean>(
    OPTIONS.activityPage[0].value
  );
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
        {selected === OPTIONS.activityPage[3].value && (
          <SalesReportPage activityId={activityId} role={ROLE.HOST} />
        )}
      </div>
    </div>
  );
};

export default ActivityDashboard;
