import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { User } from '@/lib/User';

export async function POST(request: Request) {
    try{
        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');

        const { username, password, email } = await request.json();
        const newUser = new User(username, password, email);

        const existingUser = await users.findOne({ $or: [ { email: newUser.email }, { username: newUser.username } ] });

        if(existingUser){
            return new Response(
                JSON.stringify({ message: 'User with that email or username already exists.' }),
                { status: 409, headers: {'Content-Type': 'application/json'} }
            );
        }

        const result = await users.insertOne(({ ...newUser, timestamp: new Date(), }))

        return new Response(JSON.stringify({ _id: result.insertedId, ...newUser }), {
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