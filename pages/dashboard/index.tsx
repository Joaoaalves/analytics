// Types
import { GetServerSidePropsContext } from 'next';
import { IApplication, IEvent } from '@/types/aws';

// Components
import Layout from '@/components/Layout';
import Applications from '@/components/Applications';
import LastErrors from '@/components/LastErrors';
import PageViewsChart from '@/components/PageViewsChart';
import ApplicationsDetails from '@/components/ApplicationsDetails';
import { ScrollArea } from "@/components/ui/scroll-area"

// Server Actions
import { fetchAccessToken } from '@/actions/fetchAccessToken';
import { getApplications } from '@/actions/getApplications';
import { getErrors } from '@/actions/getErrors';
import { getPageViews } from '@/actions/getPageviews';
import { getSession } from 'next-auth/react';

// Lib
import { processActionsForChart } from '@/lib/chart';
import { setAccessTokenCookie } from '@/lib/aws';
import { getAccessTokenFromCookie } from '@/lib/cookies';

// Custom Type
interface DashboardProps {
    applications: IApplication[] | [];
    errors: IEvent[] | [];
    pageViews: IEvent[] | [];
}

export default function DashBoard({ applications, errors, pageViews }: DashboardProps) {
    const chartData = processActionsForChart(pageViews, 'thisMonth')
    
    return (
        <Layout>
            <ScrollArea>
                <section className='bg-black p-8 grid grid-cols-2 grid-rows-[28px_1fr_1fr] gap-6'>
                    <h1 className='text-white text-2xl font-bold col-span-2'>Dashboard</h1>
                    <Applications applications={applications} />
                    <LastErrors errors={errors}/>

                    <div className='col-span-2 gap-x-6 grid grid-cols-[480px_1fr] grid-rows-1 max-h-96 items-end'>
                        <ApplicationsDetails apps={applications.length} errors={errors.length} pageviews={pageViews.length} />

                        <PageViewsChart chartData={chartData}/>
                    </div>
                </section>
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
                    applications: []
                }
            };
        }
    }

    const applications = await getApplications(accessToken);
    const errors = await getErrors(accessToken);
    const pageViews = await getPageViews(accessToken);

    return {
        props: {
            applications,
            errors: errors,
            pageViews: pageViews
        }
    };
}