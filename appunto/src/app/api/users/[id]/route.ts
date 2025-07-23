import clientPromise from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> },) {
    try {
        const id = (await params).id;

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('appunto');
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) })

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(user), {
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> },) {
    try {
        const id = (await params).id;

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('appunto');
        const user = await db.collection('users').deleteOne({ _id: new ObjectId(id) })

        if (user.deletedCount == 0) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 204 }
            );
        }

        return NextResponse.json(
            { message: 'User deleted' },
            { status: 200 }
        );


    } catch(error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}