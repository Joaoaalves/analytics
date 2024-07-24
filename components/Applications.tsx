import React from 'react';
import { IApplication } from '@/types/aws';
import Application from './Application';

export default function Applications({
    applications
}: {
    applications: IApplication[] | [];
}) {
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {applications &&
                applications.map((app) => (
                    <Application
                        id={app.ApplicationId}
                        name={app.ApplicationName}
                        key={app.ApplicationId}
                    />
                ))}
        </div>
    );
}
