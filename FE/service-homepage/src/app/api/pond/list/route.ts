import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios from '@/lib/server-axios';

export const GET = async (req: NextRequest) => {
    const session = await getSession();

    const res = await serverAxios.get(`/boat/v1/list?userPk=${session.userPk}`);

    return NextResponse.json({
        result: res.data.statusCode,
        message: res.data.message,
        data: res.data.data,
    });
};
