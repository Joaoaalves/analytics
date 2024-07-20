export interface IApplication {
    ApplicationId: string;
    ApplicationName: string;
}

export interface AWSGateway {
    getApplications: (accessToken: string) => Promise<IApplication[] | []>;
}

export interface IAction {
    EventId: string;
    EventType: string;
    Timestamp: Date;
    Details: object;
}
