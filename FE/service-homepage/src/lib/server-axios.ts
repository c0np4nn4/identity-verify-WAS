import axios from 'axios';
import getSession from '@/lib/session';

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
            console.log('세션이 만료되었습니다.');
            throw new Error('세션이 만료되었습니다.');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default serverAxios;
