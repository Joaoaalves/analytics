'use server';
import axios from 'axios';
import type { IEvent } from '@/types/aws';
import { sortEventsByTimestamp } from '@/lib/aws';

export async function getPageViews(
    accessToken: string,
): Promise<IEvent[] | []> {
    try {
        const response = await axios.get(
            `${process.env.AWS_API_URL}/pageview`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const pageViews: IEvent[] = response.data;
        sortEventsByTimestamp(pageViews)
        return pageViews;
    } catch (error) {
        console.log(error);
        return [];
    }
}