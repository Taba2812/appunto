import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Roles } from '@/lib/User';
import { getUserFromRequest } from '@/middleware';

export async function GET(request: NextRequest) {
    try {
        const { user, errorResponse } = getUserFromRequest(request);
        if(errorResponse){ return errorResponse; }

        if(user.payload.role == Roles.User){
            return NextResponse.json(
                { message: 'Access forbidden'},
                { status: 403 }
            )
        }

        const client = await clientPromise;
        const db = client.db('appunto');
        const users = await db.collection('users').find({}, { projection: { _id: 1, username: 1 } }).toArray();

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}
