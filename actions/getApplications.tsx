"use server"
import { IApplication } from "@/types/aws";
import axios from "axios";
export async function getApplications(accessToken:string): Promise<IApplication[] | []> {
    try{
        const response = await axios.get(`${process.env.AWS_API_URL}/application`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        const apps: IApplication[] = response.data
        return apps
    }catch(error){
        return []
    }
}