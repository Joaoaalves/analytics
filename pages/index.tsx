import { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { IApplication } from '@/types/aws';
import { getAccessToken } from '@/actions/getAccessToken';
import { getApplications } from '@/actions/getApplications';
import TokenManager from '@/components/TokenManager';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookies = nookies.get(ctx);
  let accessToken = cookies.accessToken;

  if (!accessToken) {
    accessToken = await getAccessToken();
    nookies.set(ctx, 'accessToken', accessToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  }

  const applications = await getApplications(accessToken);

  return {
    props: {
      applications,
    },
  };
}

interface HomeProps {
  applications: IApplication[] | []
}

function Home({applications} : HomeProps ) {
    return (
      <div>
        <TokenManager applications={applications}/>
      </div>
   );
};

export default Home;