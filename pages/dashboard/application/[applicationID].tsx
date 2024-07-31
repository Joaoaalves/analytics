// React Imports
import { useState } from 'react';

// Types
import { GetServerSidePropsContext } from 'next';
import { type IEvent } from '@/types/aws';

// Components
import Layout from '@/components/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import EventTable from '@/components/EventTable';
import DefaultChart from '@/components/DefaultChart';

// Server Actions
import { getEvents } from '@/actions/getEvents';
import { getSession } from 'next-auth/react';
import { fetchAccessToken } from '@/actions/fetchAccessToken';

// Lib
import { processActionsForChart } from '@/lib/chart';
import { getAccessTokenFromCookie } from '@/lib/cookies';
import { setAccessTokenCookie } from '@/lib/aws';

// Custom Type
interface IApplicationProps{
    data: IEvent[]
}

export default function Page({ data }: IApplicationProps) {
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) { 
    const session = await getSession(ctx)
    if(!session)
        return { redirect: { destination: "/", permanent: false } };

    const {accessToken, tokenExpiration} = getAccessTokenFromCookie(ctx)

    const now = new Date();

    if (!(accessToken && tokenExpiration && new Date(tokenExpiration) > now)) {
        const result = await fetchAccessToken();
        if (result) {
            const { accessToken: newAccessToken, expiresAt } = result;
            
            setAccessTokenCookie(newAccessToken, expiresAt, ctx)
        } else {
            return {
                props: {
                    data: []
                }
            };
        }
    }

    const { applicationID } = ctx.query;
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