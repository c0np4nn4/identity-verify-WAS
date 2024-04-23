import clientAxios from '@/lib/client-axios';

export async function getBoatList() {
    return clientAxios.get('/api/pond/list');
}
