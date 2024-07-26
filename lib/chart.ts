import { IEvent } from "@/types/aws";
import { type IChartData } from "@/types/chart";

export function processActionsForChart(actions: IEvent[], timeRange: string):IChartData[] {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2)

    let startDate = new Date(endDate);
    if (timeRange === 'last3Months') {
        startDate.setMonth(startDate.getMonth() - 3);
    } else if (timeRange === 'thisMonth') {
        startDate.setDate(1);
    } else if (timeRange === 'thisWeek') {
        startDate.setDate(startDate.getDate() - startDate.getDay());
    }

    const dateCounts: { [key: string]: { desktop: number, mobile: number } } = {};

    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1 )) {
        const dateString = d.toISOString().split('T')[0];
        dateCounts[dateString] = { desktop: 0, mobile: 0 };
    }

    actions.forEach(action => {
        if (action.EventType === 'pageView') {
            const actionDate = new Date(action.Timestamp);
            actionDate.setDate(actionDate.getDate() + 1)
            if (actionDate >= startDate && actionDate <= endDate) {
                const dateString = actionDate.toISOString().split('T')[0];
                const device = action.Details.device;
                if (dateCounts[dateString]) {
                    if (device === 'desktop') {
                        dateCounts[dateString].desktop += 1;
                    } else if (device === 'mobile') {
                        dateCounts[dateString].mobile += 1;
                    }
                }
            }
        }
    });

    return Object.entries(dateCounts)
        .map(([date, counts]) => ({
            date,
            desktop: counts.desktop,
            mobile: counts.mobile,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}