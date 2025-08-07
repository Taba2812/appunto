import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import path from 'path';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getUserFromCookies(request: NextRequest){
    const token = request.cookies.get('authToken')?.value;

    if(!token){
        return {
            user: null,
            errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }

    try {
        const user = await jwtVerify(token, JWT_SECRET);
        return { user, errorResponse: null };
    } catch {
        return {
            user: null,
            errorResponse: NextResponse.json({ error: 'Invalid token' }, { status: 401 }),
        };
    }
}

export function getUserFromRequest(request: NextRequest) {
    const userHeader = request.headers.get('x-user-payload');
    if (!userHeader) {
        return {
            user: null,
            errorResponse: NextResponse.json(
                { error: 'Permission denied' },
                { status: 401 }
            )
        };
    }

    try {
        const user = JSON.parse(userHeader);
        return { user, errorResponse: null };
    } catch {
        return { user: null, errorResponse: NextResponse.json({ error: 'Invalid user header' }, { status: 400 }) };
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // const publicPaths = ['/'];
    // const isPublicPath = publicPaths.includes(pathname);

    // if (isPublicPath) {
    //     return NextResponse.next();
    // }

    if(pathname === '/'){
        const token = request.cookies.get('authToken')?.value;

        if(token){
            try {
                await jwtVerify(token, JWT_SECRET);
                return NextResponse.redirect(new URL('/front', request.url));
            } catch(error) {
                return NextResponse.next();
            }
        }

        return NextResponse.next();
    }

    if(pathname.endsWith('/login') || pathname.endsWith('/register') || pathname.endsWith('/logout')){
        return NextResponse.next();
    }

    const token = request.cookies.get('authToken')?.value;
    if(!token){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const payload = await jwtVerify(token, JWT_SECRET);
        const headers = new Headers(request.headers);
        headers.set('x-user-payload', JSON.stringify(payload));
        return NextResponse.next({ request: { headers } });
    } catch(error){
        console.error('Invalid or expired token from cookie', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/', '/((?!_next|favicon.ico|static|api/auth).*)', '/api/:path*'],
};