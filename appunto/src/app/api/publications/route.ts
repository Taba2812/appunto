import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Publication } from '@/lib/Publication';
import { ObjectId } from 'mongodb';
import { getUserFromRequest } from '@/middleware';

export async function POST(request: NextRequest) {
    try{
        const { user, errorResponse } = getUserFromRequest(request);
        if(errorResponse){ return errorResponse; }

        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');
        const publications = db.collection('publications');

        const { title, content, visibility } = await request.json();
        const newPublication = new Publication(title, content, visibility, new ObjectId(user.payload.userId));

        const insertedPublication = await publications.insertOne(({
            ...newPublication,
            timestamp: new Date(),
        }))

        const publicationId = new ObjectId(insertedPublication.insertedId);
        
        const updatedUser = await users.updateOne(
            { _id: new ObjectId(user.payload.userId) }, { $addToSet: { publications: publicationId } }
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
        const { user, errorResponse } = getUserFromRequest(request);
        if(errorResponse){ return errorResponse; }

        const client = await clientPromise;
        const db = client.db('appunto');
        const publications = db.collection('publications');

        const userPublicationIds = await publications.find(
            { publisher: new ObjectId(user.payload.userId) },
            { projection: { title: 1} }
        ).toArray();

        console.log(userPublicationIds);

        return NextResponse.json(userPublicationIds, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}