"use server"

import dbConnect from "@/lib/db";
import axios from "axios";
import Token from "@/models/Token";

export async function getAccessToken(): Promise<string>{
    "use server"
    try {
        await dbConnect();
        const storedToken = await Token.findOne({});
    
        if (storedToken && new Date(storedToken.expiresAt) > new Date()) {
          return storedToken.accessToken
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
        return access_token
      } catch (error) {
        console.error('Error in auth0token API:', error);
        return ''
      }
}