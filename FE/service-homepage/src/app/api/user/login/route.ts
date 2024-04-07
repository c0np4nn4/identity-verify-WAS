import getSession from '@/lib/session';
import {NextRequest, NextResponse} from 'next/server';
import serverAxios from '@/lib/server-axios';


export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const res = await serverAxios.post('/login', data);
    if (res.data.statusCode >= 400) {
      console.error(res.data.data.message);
      throw new Error(res.data.data.message);
    }
    const session = await getSession();
    session.nickname = data.nickname;
    session.id = data.id;
    await session.save();
  } catch (error) {
    return NextResponse.json({result: false, message: '로그인 실패'}, {status: 400});
  }

  return NextResponse.json({result: true, message: '로그인 성공!'});
}