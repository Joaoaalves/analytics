import nookies from "nookies"
import { GetServerSidePropsContext } from "next";

export function getAccessTokenFromCookie(ctx:GetServerSidePropsContext){
    const cookies = nookies.get(ctx);
    let accessToken = cookies.accessToken;
    let tokenExpiration = cookies.tokenExpiration;
    return {accessToken, tokenExpiration}
}