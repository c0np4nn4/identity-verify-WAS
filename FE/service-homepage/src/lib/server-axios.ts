import axios from 'axios';
import getSession from '@/lib/session';
import logger from '@/lib/pino-logger';
import { NextRequest, NextResponse } from 'next/server';

const serverAxios = axios.create({
    baseURL: process.env.SERVICE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

serverAxios.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        console.log(config.url);
        if (
            !session.token &&
            config.url?.includes('/logout') &&
            config.url?.includes('/login') &&
            config.url?.includes('/register')
        ) {
            console.log('유저 토큰의 세션이 만료되었습니다.');
            throw new Error('유저 토큰의 세션이 만료되었습니다.');
        } else {
            // console.log('유저 토큰의 세션이 유효합니다.');
            // console.log(session.token);
            config.headers.token = session.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default serverAxios;

export function apiHandler(
    fn: (req: NextRequest, res: NextResponse) => Promise<void | Response>
) {
    return async function (req: NextRequest, res: NextResponse) {
        try {
            return await fn(req, res);
        } catch (error: any) {
            logger.error(
                { err: error, responseData: error.message },
                error.message
            );
            console.log('Error Response');
            console.log(error.message);
            console.log(error.code);
            return NextResponse.json({
                result: error.code,
                message: error.message,
            });
        }
    };
}
