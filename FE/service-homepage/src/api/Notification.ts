import clientAxios from '@/lib/client-axios';
import { IAlarm } from '@/types/alarm';

export async function getAlarmList() {
    return clientAxios.get('/api/alarm/list');
}
