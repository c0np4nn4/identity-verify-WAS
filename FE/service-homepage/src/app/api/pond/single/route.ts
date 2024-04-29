import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const GET = apiHandler(async (req: NextRequest) => {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const boatPk = searchParams.get('boatPk');

    const res = await serverAxios.get(`/boat/v1/single?boatPk=${boatPk}`, {});

    return NextResponse.json({
        result: true,
        data: res.data.data,
    });
});
