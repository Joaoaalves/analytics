import { IEvent } from "@/types/aws";
import nookies from "nookies"
import { GetServerSidePropsContext } from "next";

export function sortEventsByTimestamp(events:IEvent[]){
    events.sort((a, b) => {
        const dateA = new Date(a.Timestamp).getTime();
        const dateB = new Date(b.Timestamp).getTime();
        return dateB - dateA;
    });
}

export function setAccessTokenCookie(newAccessToken:string, expiresAt: Date, ctx:GetServerSidePropsContext ){
    const now = new Date()
    const maxAge = Math.floor(
        (expiresAt.getTime() - now.getTime()) / 1000
    );

    nookies.set(ctx, 'accessToken', newAccessToken, {
        maxAge: maxAge,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    
    nookies.set(ctx, 'tokenExpiration', expiresAt.toISOString(), {
        maxAge: maxAge,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
}