import clientAxios from '@/lib/client-axios';

export async function postSendIsItMe({ targetPk }: { targetPk: string }) {
    return clientAxios.post('/api/matching/sendIsItMe', {
        targetPk,
    });
}

export async function postSendWrongPerson({ targetPk }: { targetPk: string }) {
    return clientAxios.post('/api/matching/wrongPerson', {
        targetPk,
    });
}

export async function postSendRejectSign({ targetPk }: { targetPk: string }) {
    return clientAxios.post('/api/matching/sendRejectSign', {
        targetPk,
    });
}

export async function postSendCorrectSign({ targetPk }: { targetPk: string }) {
    return clientAxios.post('/api/matching/sendCorrectSign', {
        targetPk,
        answer: 'YES',
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

export async function postSendRealName({
    targetPk,
    name,
}: {
    targetPk: string;
    name: string;
}) {
    return clientAxios.post('/api/matching/sendRealName', {
        targetPk,
        name,
    });
}
