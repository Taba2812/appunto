import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserFromCookies } from '@/middleware';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: NextRequest) {
    try {
        const { user, errorResponse } = await getUserFromCookies(request);
        if(errorResponse){ return errorResponse; }
        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users')
        
        const userId = user.payload.userId as string;
        const _user = await users.findOne({ _id: new ObjectId(userId) })

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