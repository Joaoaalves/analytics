import React from 'react';
import { IApplication } from '@/types/aws';
import Application from './Application';
import CreateNewApplication from './CreateNewApplication';

export default function Applications({
    applications
}: {
    applications: IApplication[] | [];
}) {
    return (
        <div className="grid grid-cols-3 grid-rows-3 gap-4 bg-primary p-8 rounded-lg">
            {applications &&
                applications.map((app) => (
                    <Application
                        id={app.ApplicationId}
                        name={app.ApplicationName}
                        key={app.ApplicationId}
                    />
                ))}

            <CreateNewApplication />
        </div>
    );
}
