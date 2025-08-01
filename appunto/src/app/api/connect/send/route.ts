import clientPromise from "@/lib/mongodb";
import { getUserFromRequest } from "@/middleware";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { user, errorResponse } = getUserFromRequest(request);
    if (errorResponse) { return errorResponse; }

    const client = await clientPromise;
    const db = client.db('appunto');
    const exchanges = db.collection('exchanges');

    const { senderId, receiverId } = await request.json();
    if (senderId === receiverId) { return NextResponse.json({ message: 'You cannot send a request to yourself' }, { status: 400 }); }
    if (user.payload.userId != senderId) { return NextResponse.json({ message: 'Permission denied' }, { status: 403 }); }

    const existingExchange = await exchanges.findOne({
        senderId: new ObjectId(senderId),
        receiverId: new ObjectId(receiverId),
    });

    const existingOppositeExchange = await exchanges.findOne({
        senderId: new ObjectId(receiverId),
        receiverId: new ObjectId(senderId),
    });
    
    if (existingExchange || existingOppositeExchange) return NextResponse.json({ message: 'Exchange already exists' }, { status: 409 });

    const newExchange = await exchanges.insertOne({
        senderId: new ObjectId(senderId),
        receiverId: new ObjectId(receiverId),
        status: 'pending',
        timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Request sent' });
}