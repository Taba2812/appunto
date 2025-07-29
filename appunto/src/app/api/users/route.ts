import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/middleware';

export async function GET(request: NextRequest) {
    try {
        const { user, errorResponse } = getUserFromRequest(request);
        if(errorResponse){ return errorResponse; }

        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');

        const getUsers = await users.find({}, { projection: { _id: 1, username: 1 } }).toArray();

        return NextResponse.json(getUsers, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}
