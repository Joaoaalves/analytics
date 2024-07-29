export interface IApplication {
    ApplicationId: string;
    ApplicationName: string;
    ApplicationURL: string;
}

export interface AWSGateway {
    getApplications: (accessToken: string) => Promise<IApplication[] | []>;
}

export interface IEvent {
    EventId: string;
    EventType: string;
    Timestamp: Date;
    Details: {
        device?: 'desktop' | 'mobile';
        [key: string]: any;
    };
}
