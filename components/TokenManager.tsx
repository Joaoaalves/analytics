import React from 'react';
import { IApplication } from '@/types/aws';
import Application from './Application';

export default function TokenManager({applications}:{applications: IApplication[] | []}) {  
  return (
    <div className='grid grid-cols-3 gap-4'>
      {applications && applications.map(app => <Application name={app.ApplicationName} key={app.ApplicationId}/>)}
    </div>
  );
};