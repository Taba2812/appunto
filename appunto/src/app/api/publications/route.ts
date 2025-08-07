import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Publication } from '@/lib/Publication';
import { ObjectId } from 'mongodb';
import { getUserFromCookies } from '@/middleware';

export async function POST(request: NextRequest) {
    try{
        const { user, errorResponse } = await getUserFromCookies(request);
        if(errorResponse){ return errorResponse; }

        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');
        const publications = db.collection('publications');

        const { title, content } = await request.json();
        const userId = user.payload.userId as string;
        const newPublication = new Publication(title, content, new ObjectId(userId));

        const insertedPublication = await publications.insertOne(({
            ...newPublication,
            timestamp: new Date(),
        }))

        const publicationId = new ObjectId(insertedPublication.insertedId);
        
        const updatedUser = await users.updateOne(
            { _id: new ObjectId(userId) }, { $addToSet: { publications: publicationId } }
        );

        return new Response(JSON.stringify({ _id: insertedPublication.insertedId, ...newPublication }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { user, errorResponse } = await getUserFromCookies(request);
        if(errorResponse){ return errorResponse; }

        const client = await clientPromise;
        const db = client.db('appunto');
        const publications = db.collection('publications');

        const userId = user.payload.userId as string;
        const userPublications = await publications.find(
            { publisher: new ObjectId(userId) },
            { projection: { title: 1} }
        ).toArray();

        const formattedPublications = userPublications.map(c => ({
            id: c._id.toString(),
            title: c.title,
        }));

        return NextResponse.json(formattedPublications, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}