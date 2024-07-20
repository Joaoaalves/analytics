import { GetServerSidePropsContext } from 'next';
import { getActions } from '@/actions/getActions';
import { getAccessToken } from '@/actions/getAccessToken';
import ActionTable from '@/components/ActionTable';
import type { IAction } from '@/types/aws';

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

            return {
                props: {
                    data: actions,
                }
            };
        }
    } catch (error) {
        return {
            props: {
                data: []
            }
        };
    }
}

export default function Page({ data }: { data: IAction[] }) {
    return <ActionTable data={data} />;
}