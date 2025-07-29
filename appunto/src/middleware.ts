import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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

    const isApiRoute = pathname.startsWith('/api');

    //API Routes
    if(isApiRoute){
        const authHeader = request.headers.get('authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = await jwtVerify(token, JWT_SECRET);

            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-payload', JSON.stringify(payload));

            return NextResponse.next({ request: { headers: requestHeaders } });
        } catch (error) {
            console.error('Invalid token', error);
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
        }
    }

    //Pages Route
    const publicPaths = ['/', '/login', '/signup'];
    const isPublicPath = publicPaths.includes(pathname);

    if (isPublicPath) {
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