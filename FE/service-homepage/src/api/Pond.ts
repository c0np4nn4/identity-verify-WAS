import clientAxios from '@/lib/client-axios';

export async function getBoatList() {
    return clientAxios.get('/api/pond/list');
}

export async function getBoatSingle(boatPk: number) {
    return clientAxios.get(`/api/pond/single?boatPk=${boatPk}`);
}
