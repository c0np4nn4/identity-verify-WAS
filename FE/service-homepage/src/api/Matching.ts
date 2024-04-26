import clientAxios from '@/lib/client-axios';

export default async function postSendIsItMe({
    targetPk,
}: {
    targetPk: string;
}) {
    return clientAxios.post('/api/matching/sendIsItMe', {
        targetPk,
    });
}
