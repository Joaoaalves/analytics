export interface IApplication {
  ApplicationId: string,
  ApplicationName: string
}

export interface AWSGateway {
  getApplications: (accessToken: string) => Promise<IApplication[] | []>;
}