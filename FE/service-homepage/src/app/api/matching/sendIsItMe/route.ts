import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios from '@/lib/server-axios';

export async function POST(req: NextRequest) {
    const session = await getSession();
    const userPk = session.userPk;
    const { targetPk } = await req.json();

    try {
        const res = await serverAxios.post(
            `/match-log/v1/send/is-it-me`,
            {
                userPk,
                targetPk,
            },
            {
                headers: {
                    token: session.token,
                },
            }
        );
        console.log(res.data);
        if (res.data.statusCode >= 400) {
            console.error(res.data.data);
            throw new Error(res.data.data);
        }
        console.log(res.data);
        return NextResponse.json({
            result: true,
            message: '종이배 생성 성공!',
            data: res.data.data.message,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { result: false, message: '종이배 생성 실패', data: error },
            { status: 400 }
        );
    }
}
