'use server';
import axios from 'axios';
import type { IEvent } from '@/types/aws';
import { sortEventsByTimestamp } from '@/lib/aws';

export async function getErrors(
    accessToken: string,
): Promise<IEvent[] | []> {
    try {
        const response = await axios.get(
            `${process.env.AWS_API_URL}/errors`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const errors: IEvent[] = response.data;
        sortEventsByTimestamp(errors)
        return errors;
    } catch (error) {
        console.log(error);
        return [];
    }
}