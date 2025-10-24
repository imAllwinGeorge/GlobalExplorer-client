import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import ReusableTable from '../../sharedElements/SharedTable';
const column = ["index", "activityName", "categoryName", "pricePerHead", "count", "participantCount"];
const columnHeaders = {
    index: "#",
    activityName: "Activity Name",
    categoryName: "Category",
    pricePerHead: "Price / Head",
    count: "Total Bookings",
    participantCount: "Total Participants"
};
const TopSellingActivities = ({ topSellingProducts }) => {
    const formattedData = topSellingProducts.map((item, index) => ({
        index: index + 1,
        activityName: item.activity.activityName,
        categoryName: item.category.categoryName,
        pricePerHead: item.activity.pricePerHead,
        count: item.count,
        participantCount: item.totalParticipants,
    }));
    return (_jsx(_Fragment, { children: _jsx(ReusableTable, { data: formattedData, columns: column, columnHeaders: columnHeaders }) }));
};
export default TopSellingActivities;
