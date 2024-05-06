import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

interface IIronSession {
    isLogin: boolean;
    nickname: string;
    id: string;
    token: string;
    userPk: string;
}

export default function getSession() {
    return getIronSession<IIronSession>(cookies(), {
        password: process.env.SECRET_COOKIE_PASSWORD || 'secret',
        cookieName: '2024-pnu-cookie',
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
            httponly: true,
            maxAge: 60 * 60 * 5,
        },
    });
}
