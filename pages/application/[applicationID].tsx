import { GetServerSidePropsContext } from 'next';
import { getEvents } from '@/actions/getEvents';
import { getAccessToken } from '@/actions/getAccessToken';
import EventTable from '@/components/EventTable';
import DefaultChart from '@/components/DefaultChart';
import { useState } from 'react';
import { type IChartData } from '@/types/chart';
import { type IEvent } from '@/types/aws';

export async function getServerSideProps(ctx: GetServerSidePropsContext) { 
    try {
        const { applicationID } = ctx.query;
        const result = await getAccessToken();
        if (result) {
            const { accessToken } = result;
            const actions = await getEvents(
                accessToken,
                applicationID as string
            );
            
            
            return {
                props: {
                    data: actions,
                }
            };
        }
    } catch (error) {
        return {
            props: {
                data: [],
                chartData: [],
            }
        };
    }
}

function processActionsForChart(actions: IEvent[], timeRange: string):IChartData[] {
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

export default function Page({ data }: { data: IEvent[] }) {
    const [timeRange, setTimeRange] = useState('last3Months');
    const [chartData, setChartData] = useState(() => processActionsForChart(data, timeRange));

    const handleTimeRangeChange = (newRange: string) => {
        setTimeRange(newRange);
        setChartData(processActionsForChart(data, newRange));
        console.log(chartData)
    };

    return (
        <section className='bg-primary'>
            <DefaultChart chartData={chartData} onTimeRangeChange={handleTimeRangeChange}/>
            <EventTable data={data} />
        </section>
    );
}