import clientPromise from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserFromRequest } from '@/middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> },) {
    try {
        const { user, errorResponse } = getUserFromRequest(request);
        if(errorResponse){ return errorResponse; }

        const id = (await params).id;
        if (!ObjectId.isValid(id)) { return NextResponse.json( { message: 'Invalid user ID format' }, { status: 400 } ); }

        const client = await clientPromise;
        const db = client.db('appunto');
        const publications = db.collection('publications');

        const publication = await publications.findOne({ _id: new ObjectId(id) })
        if (!publication) { return NextResponse.json( { message: 'User not found' }, { status: 404 }); }

        if(publication.publisher.toString() != user.payload.userId){
            return NextResponse.json( { error: 'Permission denied' }, { status: 401 } );
        }

        return new Response(JSON.stringify(publication), {
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> },){
    try {
        const { user, errorResponse } = getUserFromRequest(request);
        if(errorResponse){ return errorResponse; }

        const id = (await params).id;
        if (!ObjectId.isValid(id)) { return NextResponse.json( { message: 'Invalid user ID format' }, { status: 400 } ); }

        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');
        const publications = db.collection('publications');

        const publication = await publications.findOne({ _id: new ObjectId(id) });

        if (!publication) { return NextResponse.json( { message: 'User not found' }, { status: 404 }); }

        if(publication.publisher.toString() != user.payload.userId){
            return NextResponse.json( { error: 'Permission denied' }, { status: 401 } );
        }

        const updatedUser = await users.updateOne(
            { _id: new ObjectId(user.payload.userId) },
            { $pull: { publications: publication._id as any } }
        );

        const deletedPublication = await publications.deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ message: 'Publication deleted successfully' }, { status: 200 });

    } catch(error){
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}