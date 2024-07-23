'use server';
import axios from 'axios';
import type { IEvent } from '@/types/aws';

function sortEventsByTimestamp(events:IEvent[]){
    events.sort((a, b) => {
        const dateA = new Date(a.Timestamp).getTime();
        const dateB = new Date(b.Timestamp).getTime();
        return dateB - dateA;
    });
}

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
