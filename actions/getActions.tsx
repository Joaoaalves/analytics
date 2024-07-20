'use server';
import axios from 'axios';
import type { IAction } from '@/types/aws';

export async function getActions(
    accessToken: string,
    applicationId: string
): Promise<IAction[] | []> {
    try {
        const response = await axios.get(
            `${process.env.AWS_API_URL}/application/action?ApplicationId=${applicationId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const actions: IAction[] = response.data;
        return actions;
    } catch (error) {
        console.log(error);
        return [];
    }
}
