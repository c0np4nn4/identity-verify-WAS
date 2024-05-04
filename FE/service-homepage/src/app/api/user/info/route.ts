import { NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';
import getSession from '@/lib/session';

export const GET = apiHandler(async () => {
    const session = await getSession();
    console.log('로그인한 유저의 아이디: ', session.nickname);
    console.log('로그인한 유저의 토큰: ', session.token);
    const res = await serverAxios.get(`/service/v1/get-user-info`);
    console.log('로그인한 유저의 정보: ', res.data);
    return NextResponse.json({
        result: res.data.statusCode,
        data: res.data,
    });
});
