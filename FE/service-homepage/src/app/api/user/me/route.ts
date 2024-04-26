import getSession from '@/lib/session';
import { NextResponse } from 'next/server';
import serverAxios from '@/lib/server-axios';

export async function GET() {
    const session = await getSession();
    console.log(session);
    if (!session.id) {
        return NextResponse.json({
            result: false,
            message: '로그인한 유저가 없다.',
        });
    }
    console.log('유저의 정보를 가져오기');
    try {
        const res = await serverAxios.get(`/service/v1/get-user-info`, {
            headers: {
                token: session.token,
            },
        });

        if (res.data.statusCode >= 400) {
            console.error(res.data.data.message);
            throw new Error(res.data.data.message);
        }
        console.log(res.data);
        return NextResponse.json({
            result: true,
            message: '현재 로그인한 유저 정보 조회 성공!',
            data: res.data.userInfo,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { result: false, message: '현재 로그인한 유저 정보 조회 실패' },
            { status: 400 }
        );
    }
}
