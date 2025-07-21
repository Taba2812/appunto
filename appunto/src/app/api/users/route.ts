import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('appunto');
    const users = await db.collection('users').find({}, { projection: {_id: 1, username: 1}} ).toArray();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Database error', error },
      { status: 500 }
    );
  }
}
