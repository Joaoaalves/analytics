// Types
import { IEvent } from "@/types/aws";
import { GetServerSidePropsContext } from "next";

// Components
import EventTable from "@/components/EventTable"
import Layout from "@/components/Layout"
import { ScrollArea } from '@/components/ui/scroll-area';

// Server Actions
import { getErrors } from "@/actions/getErrors";
import { fetchAccessToken } from "@/actions/fetchAccessToken";
import { getSession } from "next-auth/react";

// Lib
import { getAccessTokenFromCookie } from "@/lib/cookies";
import { setAccessTokenCookie } from "@/lib/aws";

// Custom Type
interface ErrorsProps {
    errors: IEvent[]
}

export default function Errors({errors} : ErrorsProps){    
    return (
        <Layout>
            <ScrollArea className='bg-black p-8 space-y-8'>
                    <h1 className='text-white text-2xl font-bold'>Errors</h1>
                    <EventTable data={errors}/>
            </ScrollArea>
        </Layout>
    )
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


    const errors = await getErrors(accessToken);

    return {
        props: {
            errors: errors,
        }
    };
}