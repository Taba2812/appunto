import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserFromCookies } from '@/middleware';

export async function GET(request: NextRequest) {
    try {
        const { user, errorResponse } = await getUserFromCookies(request);
        if(errorResponse){ return errorResponse; }

        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');

        const userId = user.payload.userId as string;
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
        }
        const currentUser = await users.findOne(
            { _id: new ObjectId(userId) },
            { projection: { correspondents: 1} }
        );

        if (!currentUser || !currentUser.correspondents || currentUser.correspondents.length === 0) {
            return NextResponse.json({ correspondents: [] }, { status: 200 });
        }

        const correspondents = await users.find(
            { _id: { $in: currentUser.correspondents } },
            { projection: { username: 1 } }
        ).toArray();

        const formattedCorrespondents = correspondents.map(c => ({
            id: c._id.toString(),
            username: c.username,
        }));

        return NextResponse.json(formattedCorrespondents, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}