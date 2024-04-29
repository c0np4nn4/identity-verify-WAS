import clientAxios from '@/lib/client-axios';
import { IBoat } from '@/types/boat';

export async function postCreateBoat(data: {
    userPk: string;
    labels: string[];
    secreteLabels: string[];
}) {
    return clientAxios.post('/api/boat/create', data);
}
