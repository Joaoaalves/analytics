import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { IApplication } from '@/types/aws';
import { getAccessToken } from '@/actions/getAccessToken';
import { getApplications } from '@/actions/getApplications';
import TokenManager from '@/components/TokenManager';
import CreateNewApplication from '@/components/CreateNewApplication';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
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
            applications
        }
    };
}

interface HomeProps {
    applications: IApplication[] | [];
}

function Home({ applications }: HomeProps) {
    return (
        <div>
            <TokenManager applications={applications} />
            <CreateNewApplication />
        </div>
    );
}

export default Home;
