export interface IToken extends Document {
    accessToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}