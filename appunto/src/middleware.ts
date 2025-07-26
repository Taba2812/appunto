import {NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export function getUserFromRequest(request: NextRequest){
    const userHeader = request.headers.get('x-user-payload');
    if(!userHeader){
        return { user: null, errorResponse: NextResponse.json(
            { error: 'Permission denied' },
            { status: 401 }
        ) };
    }

    try {
        const user = JSON.parse(userHeader);
        return { user, errorResponse: null };
    } catch {
        return { user: null, errorResponse: NextResponse.json({ error: 'Invalid user header' }, { status: 400 }) };
    }
}

export async function middleware(req: NextRequest) {

    if(req.nextUrl.pathname.endsWith('/auth/login') || req.nextUrl.pathname.endsWith('/auth/signup')) {
        return NextResponse.next();
    }

    const authHeader = req.headers.get('authorization');

    if(!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } );
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = await jwtVerify(token, JWT_SECRET);

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-payload', JSON.stringify(payload));

        return NextResponse.next( { request: { headers: requestHeaders } } );
    } catch(error) {
        console.error('Invalid token', error);
        return NextResponse.json( { error: 'Invalid token' }, { status: 403 } );
    }
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};