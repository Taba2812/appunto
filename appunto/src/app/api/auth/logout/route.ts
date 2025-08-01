import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({ message: 'Logged out successfully' });

        response.cookies.set('authToken', '', {
            path: '/',
            maxAge: 0,
        });

        return response;
    } catch(error){
        return NextResponse.json(
            { message: 'Error', error },
            { status: 500 }
        );
    }

}
