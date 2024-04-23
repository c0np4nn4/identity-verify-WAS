import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios from '@/lib/server-axios';

export async function GET(req: NextRequest) {
    const session = await getSession();

    try {
        const res = await serverAxios.get(
            `/alarm/v1/list?userPk=${session.userPk}`,
            {
                headers: {
                    token: session.token,
                },
            }
        );

        if (res.data.statusCode >= 400) {
            console.error(res.data.data.message);
            throw new Error(res.data.data.message);
        }

        return NextResponse.json({
            result: true,
            message: '알림 조회 성공!',
            data: res.data.data.alarmList,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { result: false, message: '알림 조회 실패' },
            { status: 400 }
        );
    }
}
