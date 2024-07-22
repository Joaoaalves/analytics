import { GetServerSidePropsContext } from 'next';
import { getActions } from '@/actions/getActions';
import { getAccessToken } from '@/actions/getAccessToken';
import ActionTable from '@/components/ActionTable';
import DefaultChart from '@/components/DefaultChart';

export interface IAction {
    EventId: string;
    EventType: string;
    Timestamp: Date;
    Details: {
        device?: 'desktop' | 'mobile';
        [key: string]: any;
    };
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    try {
        const { applicationID } = ctx.query;
        const result = await getAccessToken();
        if (result) {
            const { accessToken } = result;
            const actions = await getActions(
                accessToken,
                applicationID as string
            );
            
            const chartData = processActionsForChart(actions);
            
            return {
                props: {
                    data: actions,
                    chartData,
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

function processActionsForChart(actions: IAction[]) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1)

    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 3);

    const dateCounts: { [key: string]: { desktop: number, mobile: number } } = {};

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1 )) {
        const dateString = d.toISOString().split('T')[0];
        dateCounts[dateString] = { desktop: 0, mobile: 0 };
    }

    actions.forEach(action => {
        if (action.EventType === 'pageView') {
            const date = new Date(action.Timestamp).toISOString().split('T')[0];
            const device = action.Details.device;

            if (dateCounts[date]) {
                if (device === 'desktop') {
                    dateCounts[date].desktop += 1;
                } else if (device === 'mobile') {
                    dateCounts[date].mobile += 1;
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

export default function Page({ data, chartData }: { data: IAction[], chartData: any[] }) {
    return (
        <section>
            <DefaultChart chartData={chartData} />
            <ActionTable data={data} />
        </section>
    );
}