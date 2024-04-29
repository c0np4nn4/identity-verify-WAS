import clientAxios from '@/lib/client-axios';

export async function postLogin(id: string, password: string) {
    return clientAxios.post('/api/user/login', {
        id,
        password,
    });
}

export async function postLogout() {
    return clientAxios.post('/api/user/logout');
}

export async function postRegister(
    nickname: string,
    id: string,
    password: string
) {
    return clientAxios.post('/api/user/register', {
        nickname,
        id,
        password,
    });
}

export async function getUserInfo() {
    return clientAxios.get('/api/user/info');
}

export async function getCheckLogin() {
    return clientAxios.get('/api/user/me');
}
