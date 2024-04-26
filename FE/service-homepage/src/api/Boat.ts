import clientAxios from '@/lib/client-axios';
import { IBoat } from '@/types/boat';

export async function postCreateBoat(data: IBoat) {
    return clientAxios.post('/api/boat/create', data);
}
