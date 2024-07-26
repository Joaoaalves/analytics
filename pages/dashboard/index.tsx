import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import Layout from '@/components/Layout';
import { IApplication, IEvent } from '@/types/aws';

import { getAccessToken } from '@/actions/getAccessToken';
import { getApplications } from '@/actions/getApplications';

import Applications from '@/components/Applications';
import CreateNewApplication from '@/components/CreateNewApplication';

import Sidepanel from '@/components/SidePanel';

import { getSession } from "next-auth/react";
import LastErrors from '@/components/LastErrors';
import { getEvents } from '@/actions/getEvents';

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

    return {
        props: {
            applications,
            errors: [
                {
                    EventId: '123',
                    EventType: 'error',
                    Timestamp:  Date.now(),
                    Details: {
                        message: "Placeholder error"
                    }
                }
            ]
        }
    };
}

interface DashboardProps {
    applications: IApplication[] | [];
    errors: IEvent[] | [];
}

function DashBoard({ applications, errors }: DashboardProps) {
    return (
        <Layout>
        <section className='bg-black p-8 grid grid-cols-2 grid-rows-[32px_1fr_1fr] gap-6'>
            <h1 className='text-white text-2xl font-bold text-neutral-300 col-span-2'>Dashboard</h1>
            <Applications applications={applications} />
            <LastErrors errors={errors}/>
            <div className='flex flex-col items-center justify-center w-full mt-8'>
                <CreateNewApplication />
            </div>
        </section>
        </Layout>
    );
}

export default DashBoard;