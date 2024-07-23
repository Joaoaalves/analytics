import { deleteApplication } from '@/actions/deleteApplication';
import { NextApiRequest, NextApiResponse } from 'next';
import nookies from "nookies";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'DELETE') {
        const { ApplicationId } = req.query;

        const cookies = nookies.get({req});
        const accessToken = cookies.accessToken || ""
        
        if(accessToken && ApplicationId && typeof ApplicationId === "string")
          {
            try {
              await deleteApplication(accessToken, ApplicationId);
              res.status(200).json({ message: 'Application and related events deleted successfully' });
            } catch (error) {
              if(error instanceof Error)
                res.status(500).json({ error: error.message });
          }
          }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
