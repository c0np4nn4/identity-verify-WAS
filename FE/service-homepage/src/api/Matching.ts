import clientAxios from '@/lib/client-axios';

export async function postSendIsItMe({ targetPk }: { targetPk: string }) {
    return clientAxios.post('/api/matching/sendIsItMe', {
        targetPk,
    });
}

export async function postSendRejectSign({ targetPk }: { targetPk: string }) {
    return clientAxios.post('/api/matching/sendRejectSign', {
        targetPk,
    });
}

export async function postSendMyLabel({
    targetPk,
    label1,
    label2,
    label3,
}: {
    targetPk: string;
    label1: string;
    label2: string;
    label3: string;
}) {
    return clientAxios.post('/api/matching/sendMyLabel', {
        targetPk,
        label1,
        label2,
        label3,
    });
}
