import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import dbConnect from '@/lib/db';
import  Token  from '@/models/Token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const storedToken = await Token.findOne({});

    if (storedToken && new Date(storedToken.expiresAt) > new Date()) {
      return res.status(200).json({ accessToken: storedToken.accessToken });
    }

    const response = await axios.post(
      `${process.env.AUTH0_AUTH_DOMAIN}`,
      {
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
      },
      {
        headers: { 'content-type': 'application/json' },
      }
    );

    const { access_token, expires_in, scope } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await Token.findOneAndUpdate(
      {},
      { accessToken: access_token, expiresAt, scope },
      { upsert: true, new: true }
    );

    res.status(200).json({ accessToken: access_token });
  } catch (error) {
    console.error('Error in auth0token API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}