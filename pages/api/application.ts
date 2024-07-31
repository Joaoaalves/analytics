import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = process.env.AWS_API_URL;
import { getAccessToken } from '@/actions/fetchAccessToken';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed!' });
    }
    const data = req.body.data;
    const { name } = data;
    try {
        const result = await getAccessToken();
        if (result) {
            const { accessToken } = result;
            const response = await axios.post(
                `${API_URL}/application`,
                {
                    ApplicationName: name
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            const applicationId = response.data;
            return res.status(200).json({
                message: 'Application created successfully!',
                applicationId
            });
        }
    } catch (error) {
        console.log(`Error occurred on /application: ${error}`);
        console.log(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
