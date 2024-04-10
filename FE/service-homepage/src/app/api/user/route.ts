import getSession from '@/lib/session';
import {NextResponse} from 'next/server';


export async function GET() {
  const session = await getSession();
  return NextResponse.json({result: true, message: 'success', data: session.token});
}