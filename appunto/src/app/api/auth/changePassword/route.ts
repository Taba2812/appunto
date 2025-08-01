import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserFromCookies } from '@/middleware';

export async function POST(request: NextRequest) {
    try {
        const { user, errorResponse } = await getUserFromCookies(request);
        if(errorResponse){ return errorResponse; }
        
        const client = await clientPromise;
        const db = client.db('appunto');
        const users = db.collection('users');

        const { username, oldPassword, newPassword, confirmNewPassword } = await request.json();
        const _user = await users.findOne({ username: username.toUpperCase() });

        if(!_user){
            return new Response(
                JSON.stringify({ message: 'Username does not exist' }),
                { status: 404, headers: {'Content-Type': 'application/json'} }
            )
        }

        const isConfirmPasswordCorrect = newPassword === confirmNewPassword;
        if(!isConfirmPasswordCorrect){
            return new Response(
                JSON.stringify({ message: 'New password fields do not coincide. Try again' }),
                { status: 401, headers: {'Content-Type': 'application/json'} }
            )            
        }

        const isnewPasswordDifferent = oldPassword === newPassword;
        if(isnewPasswordDifferent){
            return new Response(
                JSON.stringify({ message: 'New password cannot be the same as old password' }),
                { status: 401, headers: {'Content-Type': 'application/json'} }
            )
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, _user.password);
        if(!isPasswordCorrect){
            return new Response(
                JSON.stringify({ message: 'Password is incorrect' }),
                { status: 401, headers: {'Content-Type': 'application/json'} }
            )
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await users.updateOne(
            { _id: _user._id },
            { $set: { password: hashedNewPassword } }
        );

        return new Response(
            JSON.stringify({ message: 'Password changed successfully' }),
            { status: 201, headers: {'Content-Type': 'application/json'} }
        );

    } catch(error) {
        return NextResponse.json(
            { message: 'Database error', error },
            { status: 500 }
        );
    }
}