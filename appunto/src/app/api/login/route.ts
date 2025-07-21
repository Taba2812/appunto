import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');

        const { username, password } = await request.json();
        const user = await users.findOne({
            username: username.toUpperCase()
        });

        if(!user){
            return new Response(
                JSON.stringify({ message: 'Username does not exist' }),
                { status: 404, headers: {'Content-Type': 'application/json'} }
            )
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return new Response(
                JSON.stringify({ message: 'Password is incorrect' }),
                { status: 401, headers: {'Content-Type': 'application/json'} }
            )
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return new Response(
            JSON.stringify( { message: "Login successful", token } ),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch(error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        )
    }
}