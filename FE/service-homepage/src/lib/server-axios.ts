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
        if (
            !session.token &&
            config.url !== '/logout' &&
            config.url !== '/login' &&
            config.url !== '/register'
        ) {
            throw new Error('세션이 만료되었습니다.');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default serverAxios;
