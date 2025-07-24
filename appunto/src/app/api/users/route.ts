import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { Roles } from '@/lib/User';

export async function GET(request: Request) {
    try {
        const userHeader = request.headers.get('x-user-payload');
        if (!userHeader) {
            return NextResponse.json({ error: 'Permission denied' }, { status: 401 });
        }

        const user = JSON.parse(userHeader);

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
