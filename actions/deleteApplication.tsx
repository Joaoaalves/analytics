"use server"
import axios from 'axios';

const API_URL = process.env.AWS_API_URL

export async function deleteApplication(accessToken:string, applicationId:string) {
    try {
      if(!API_URL)
        throw new Error("API_URL is not set")

      const response = await axios.delete(`${API_URL}/application`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                ApplicationId: applicationId
            }
        });
        console.log(response);
    } catch (error) {
      throw error;
    }
}