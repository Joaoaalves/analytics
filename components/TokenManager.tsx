import React, { useEffect, useState } from 'react';
import { useAuth0Token } from '../contexts/Auth0TokenProvider';
import { useAWS } from '@/contexts/AWSProvider';
import { IApplication } from '@/types/aws';
import Application from './Application';

const TokenManager = () => {
  const { getAccessToken } = useAuth0Token();
  const {getApplications} = useAWS()

  const [accessToken, setAccessToken] = useState<string | null>("")
  const [applications, setApplications] = useState<IApplication[]>()

  useEffect(() => {
    if(!accessToken)
      setAccessToken(getAccessToken())

  }, [])

  useEffect(() => {
    const handleApplications = async () => {
      const apps = await getApplications(accessToken as string)
      setApplications(apps)
    }

    if(!applications && accessToken)
      handleApplications()
  }, [accessToken])

  if(!accessToken)
    return <span>Loading...</span>

  return (
    <div className='grid grid-cols-3 gap-4'>
      {applications && applications.map(app => <Application key={app.ApplicationId} name={app.ApplicationName} />)}
    </div>
  );
};

export default TokenManager;