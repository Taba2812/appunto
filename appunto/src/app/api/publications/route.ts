import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { Publication } from '@/lib/Publication';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
    try{
        const userHeader = request.headers.get('x-user-payload');
        if(!userHeader) {
            return NextResponse.json( { error: 'Permission denied' }, { status: 401 } );
        }

        const user = JSON.parse(userHeader);

        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');
        const publications = db.collection('publications');

        const { title, content } = await request.json();
        const newPublication = new Publication(title, content, new ObjectId(user.payload.userId));

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

export async function GET(request: Request) {
    try {
        const userHeader = request.headers.get('x-user-payload');
        if (!userHeader) {
            return NextResponse.json({ error: 'Permission denied' }, { status: 401 });
        }

        const user = JSON.parse(userHeader);

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