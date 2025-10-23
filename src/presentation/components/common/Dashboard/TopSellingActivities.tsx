import type { DashboardData } from '../../../../shared/types/global';
import ReusableTable from '../../sharedElements/SharedTable'

type TopSellingActivitiesPropsType = {
    topSellingProducts: DashboardData[]
}

const column = ["index", "activityName", "categoryName", "pricePerHead", "count", "participantCount"];
const columnHeaders = {
  index: "#",
  activityName: "Activity Name",
  categoryName: "Category",
  pricePerHead: "Price / Head",
  count: "Total Bookings",
  participantCount: "Total Participants"
};

const TopSellingActivities = ({topSellingProducts}: TopSellingActivitiesPropsType) => {
    const formattedData = topSellingProducts.map((item, index) => ({
  index: index + 1,
  activityName: item.activity.activityName,
  categoryName: item.category.categoryName,
  pricePerHead: item.activity.pricePerHead,
  count: item.count,
  participantCount: item.totalParticipants,
}));
  return (
    <>
    <ReusableTable data={formattedData} columns={column} columnHeaders={columnHeaders} />
    </>
  )
}

export default TopSellingActivities