import clientPromise from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserFromRequest } from '@/middleware';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> },){
    try {
        const { user, errorResponse } = getUserFromRequest(request);
        if(errorResponse){ return errorResponse; }

        const id = (await params).id;
        if (!ObjectId.isValid(id)) { return NextResponse.json( { message: 'Invalid user ID format' }, { status: 400 } ); }

        const client = await clientPromise;
        const db = client.db('appunto');
        const publications = db.collection('publications');

        const publication = await publications.findOne({ _id: new ObjectId(id) })
        if (!publication) { return NextResponse.json( { message: 'Publication not found' }, { status: 404 }); }

        const isPublisher = user.payload.userId.toString() === publication.publisher.toString();
        const hasAccess = publication.accessList.some((id: ObjectId) => id.toString() === user.payload.userId.toString() )

        if(!isPublisher && !hasAccess){
            return NextResponse.json( { error: 'Permission denied' }, { status: 403 } );
        }

        const allowedFields: Record<string, 'scalar' | 'array'> = {
            title: 'scalar',
            visibility: 'scalar',
            accessList: 'array',
            circles: 'array',
        }

        const body = await request.json();
        const updateSet: Record<string, any> = {};
        const updateAddToSet: Record<string, any> = {};

        for(const key in body){
            if(!allowedFields[key]) continue;
            const value = body[key];
            const fieldType = allowedFields[key];

            if(fieldType === 'scalar'){
                updateSet[key] = value;
            }

            if(fieldType === 'array'){
                updateAddToSet[key] = { $each: value.map((id: string) => new ObjectId(id)) };
            }

            const updateQuery: any = {};
            if (Object.keys(updateSet).length > 0) {
            updateQuery.$set = updateSet;
            }
            if (Object.keys(updateAddToSet).length > 0) {
            updateQuery.$addToSet = updateAddToSet;
            }

            if (Object.keys(updateQuery).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
            }

            const result = await db.collection('publications').updateOne(
                { _id: new ObjectId(id) },
                updateQuery
            );

            if (result.matchedCount === 0) {
                return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
            }

        }

        return NextResponse.json({ message: 'Publication updated successfully' });

    } catch(error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}

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
        if (!publication) { return NextResponse.json( { message: 'Publication not found' }, { status: 404 }); }

        const isPublisher = user.payload.userId.toString() === publication.publisher.toString();
        const hasAccess = publication.accessList.some((id: ObjectId) => id.toString() === user.payload.userId.toString() )

        if(!isPublisher && !hasAccess){
            return NextResponse.json( { error: 'Permission denied' }, { status: 403 } );
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
            return NextResponse.json( { error: 'Permission denied' }, { status: 403 } );
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