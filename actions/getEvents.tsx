'use server';
import axios from 'axios';
import type { IEvent } from '@/types/aws';
import { sortEventsByTimestamp } from '@/lib/aws';

export async function getEvents(
    accessToken: string,
    applicationId: string
): Promise<IEvent[] | []> {
    try {
        const response = await axios.get(
            `${process.env.AWS_API_URL}/application/event?ApplicationId=${applicationId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const events: IEvent[] = response.data;
        sortEventsByTimestamp(events)
        return events;
    } catch (error) {
        console.log(error);
        return [];
    }
}