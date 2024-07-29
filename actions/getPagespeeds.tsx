'use server';

import Pagespeed from '@/models/Pagespeed';
import { IPageSpeed } from '@/types/models';

export async function getPageSpeeds(): Promise<IPageSpeed[] | []> {
    try {
        const pagespeeds = await Pagespeed.find()

        return pagespeeds;
    } catch (error) {
        console.log(error);
        return [];
    }
}