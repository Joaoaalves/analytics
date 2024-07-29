import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import Layout from '@/components/Layout';
import { IApplication, IEvent } from '@/types/aws';

import { getAccessToken } from '@/actions/getAccessToken';
import { getApplications } from '@/actions/getApplications';

import Applications from '@/components/Applications';


import { getSession } from "next-auth/react";
import LastErrors from '@/components/LastErrors';
import { getErrors } from '@/actions/getErrors';
import { getPageViews } from '@/actions/getPageviews';
import PageViewsChart from '@/components/PageViewsChart';
import { processActionsForChart } from '@/lib/chart';
import ApplicationsDetails from '@/components/ApplicationsDetails';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getSession(ctx);
    
    if (!session){
        return {
            
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const cookies = nookies.get(ctx);
    let accessToken = cookies.accessToken;
    let tokenExpiration = cookies.tokenExpiration;

    const now = new Date();

    if (accessToken && tokenExpiration && new Date(tokenExpiration) > now) {
    } else {
        const result = await getAccessToken();
        if (result) {
            const { accessToken: newAccessToken, expiresAt } = result;
            accessToken = newAccessToken;
            
            const maxAge = Math.floor(
                (expiresAt.getTime() - now.getTime()) / 1000
            );

            nookies.set(ctx, 'accessToken', newAccessToken, {
                maxAge: maxAge,
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });
            
            nookies.set(ctx, 'tokenExpiration', expiresAt.toISOString(), {
                maxAge: maxAge,
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });
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

interface DashboardProps {
    applications: IApplication[] | [];
    errors: IEvent[] | [];
    pageViews: IEvent[] | [];
}

function DashBoard({ applications, errors, pageViews }: DashboardProps) {
    const chartData = processActionsForChart(pageViews, 'thisMonth')
    
    return (
        <Layout>
        <section className='bg-black p-8 grid grid-cols-2 grid-rows-[28px_384px_384px] gap-x-6'>
            <h1 className='text-white text-2xl font-bold col-span-2'>Dashboard</h1>
            <Applications applications={applications} />
            <LastErrors errors={errors}/>

            <div className='col-span-2 gap-x-6 grid grid-cols-[480px_1fr] grid-rows-1 max-h-96 items-end'>
                <ApplicationsDetails apps={applications.length} errors={errors.length} pageviews={pageViews.length} />

                <PageViewsChart chartData={chartData}/>
            </div>

        </section>
        </Layout>
    );
}

export default DashBoard;