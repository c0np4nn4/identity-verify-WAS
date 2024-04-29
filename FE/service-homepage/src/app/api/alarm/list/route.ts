import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const GET = apiHandler(async (req: NextRequest) => {
    const session = await getSession();
    console.log('api call');
    const res = await serverAxios.get(
        `/alarm/v1/list?userPk=${session.userPk}`,
        {
            headers: {
                token: session.token,
            },
        }
    );
    return NextResponse.json({
        result: true,
        data: res.data.data,
    });
});
