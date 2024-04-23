interface IBoatData {
    pk: number;
    userPk: string;
    authorNickname: string;
    label1: string;
    label2: string;
    label3: string;
    label4: string;
    label5: string;
    label6: string;
    label7: string;
    label8: string;
    label9: string;
    label10: string;
    secrete1: string;
    secrete2: string;
    isOccupied: boolean;
    createdAt: string;
}

export const BoatData: IBoatData[] = [
    {
        pk: 1,
        userPk: '1',
        authorNickname: 'user1',
        label1: '1-1',
        label2: '1-2',
        label3: '1-3',
        label4: '1-4',
        label5: '1-5',
        label6: '1-6',
        label7: '1-7',
        label8: '1-8',
        label9: '1-9',
        label10: '1-10',
        secrete1: '1-1',
        secrete2: '1-2',
        isOccupied: false,
        createdAt: '2021-09-16T05:57:16.000Z',
    },
    {
        pk: 2,
        userPk: '2',
        authorNickname: 'user2',
        label1: '2-1',
        label2: '2-2',
        label3: '2-3',
        label4: '2-4',
        label5: '2-5',
        label6: '2-6',
        label7: '2-7',
        label8: '2-8',
        label9: '2-9',
        label10: '2-10',
        secrete1: '2-1',
        secrete2: '2-2',
        isOccupied: false,
        createdAt: '2021-09-16T05:57:16.000Z',
    },
    {
        pk: 3,
        userPk: '3',
        authorNickname: 'user3',
        label1: '3-1',
        label2: '3-2',
        label3: '3-3',
        label4: '3-4',
        label5: '3-5',
        label6: '3-6',
        label7: '3-7',
        label8: '3-8',
        label9: '3-9',
        label10: '3-10',
        secrete1: '3-1',
        secrete2: '3-2',
        isOccupied: false,
        createdAt: '2021-09-16T05:57:16.000Z',
    },
] as const;
