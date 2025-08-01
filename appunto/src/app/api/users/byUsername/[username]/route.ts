import clientPromise from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { Roles } from '@/lib/User';
import { getUserFromCookies } from '@/middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> },) {
    try {
        const { user, errorResponse } = await getUserFromCookies(request);
        if(errorResponse){ return errorResponse; }

        const username = (await params).username.toUpperCase();

        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users')
        const _user = await users.findOne({ username: username })

        if (!_user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(_user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}