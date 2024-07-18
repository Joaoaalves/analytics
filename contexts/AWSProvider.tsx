import React, {createContext, useContext } from 'react';
import axios from 'axios';
import { AWSGateway, IApplication } from '@/types/aws';
import { useLocalStorage } from 'usehooks-ts';

const AWSContext = createContext<AWSGateway | undefined>(undefined);

export const useAWS = () => {
  const context = useContext(AWSContext)

  if(!context){
    throw new Error("useAWS must be used within an AWSProvider");
  }

  return context
}

const API_URL = process.env.NEXT_PUBLIC_AWS_API_URL;
export const AWSProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [applications, setApplications] = useLocalStorage<IApplication[] | null>("applications", null)

  const getApplications = async (accessToken:string) => {
    if(applications)
      return applications

    try{
      const response = await axios.get(`${API_URL}/application`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const apps: IApplication[] = response.data
      setApplications(apps)
      return apps
    }catch(error){
      return []
    }
  }

  return (
    <AWSContext.Provider value={{getApplications}}>
      {children}
    </AWSContext.Provider>
  )
}