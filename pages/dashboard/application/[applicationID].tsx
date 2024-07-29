import { GetServerSidePropsContext } from 'next';
import { getEvents } from '@/actions/getEvents';
import { getAccessToken } from '@/actions/getAccessToken';
import EventTable from '@/components/EventTable';
import DefaultChart from '@/components/DefaultChart';
import { useState } from 'react';
import { type IEvent } from '@/types/aws';

import { processActionsForChart } from '@/lib/chart';
import Layout from '@/components/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';

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



export default function Page({ data }: { data: IEvent[] }) {
    const [timeRange, setTimeRange] = useState('last3Months');
    const [chartData, setChartData] = useState(() => processActionsForChart(data, timeRange));

    const handleTimeRangeChange = (newRange: string) => {
        setTimeRange(newRange);
        setChartData(processActionsForChart(data, newRange));
        console.log(chartData)
    };

    return (
        <Layout>
            <ScrollArea className='bg-black p-8 space-y-8'>
                <DefaultChart chartData={chartData} onTimeRangeChange={handleTimeRangeChange}/>
                <EventTable data={data} />
            </ScrollArea>
        </Layout>

    );
}