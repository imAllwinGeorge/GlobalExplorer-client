export function formateDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
    }).format(date);
}
export function averageRating(reviews) {
    if (reviews.length === 0)
        return 0;
    const total = reviews.reduce((acc, curr) => (acc += curr.rating), 0);
    return Math.round((total / reviews.length) * 100) / 100;
}
export function totalRatings(reivews) {
    return reivews.reduce((acc, curr) => (acc += curr.rating), 0);
}
export function calculateGrowth(salesData) {
    const totalCurrent = salesData.current.reduce((sum, m) => sum + m.totalSales, 0);
    const totalPrevious = salesData.previous.reduce((sum, m) => sum + m.totalSales, 0);
    const growth = totalPrevious === 0
        ? 100
        : ((totalCurrent - totalPrevious) / totalPrevious) * 100;
    return { growth: Math.round(growth), currentTotalSales: totalCurrent, previousTotalSales: totalPrevious };
}
