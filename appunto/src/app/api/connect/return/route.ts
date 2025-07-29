import clientPromise from "@/lib/mongodb";
import { getUserFromRequest } from "@/middleware";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const { user, errorResponse } = getUserFromRequest(request);
    if (errorResponse) { return errorResponse; }

    const client = await clientPromise;
    const db = client.db('appunto');
    const exchanges = db.collection('exchanges');
    const users = db.collection('users');

    const { exchangeId } = await request.json();
    const exchange = await exchanges.findOne({ _id: new ObjectId(exchangeId) });

    if(!exchange || exchange.status !== 'pending'){
        return NextResponse.json({ message: 'Invalid or already processed' }, { status: 404 });
    }

    if(user.payload.userId != exchange.receiverId.toString()){
        return NextResponse.json({ message: 'Permission denied' }, { status: 403 });
    }

    const acceptedExchange = await exchanges.updateOne(
        { _id: new ObjectId(exchangeId) },
        { $set: { status: 'accepted'} }
    );

    const updateSender = await users.updateOne(
        { _id: new ObjectId(exchange.senderId) },
        { $addToSet: { correspondents: new ObjectId(exchange.receiverId) } }
    )

    const updateReceiver = await users.updateOne(
        { _id: new ObjectId(exchange.receiverId) },
        { $addToSet: { correspondents: new ObjectId(exchange.senderId) } }
    )

    return NextResponse.json({ message: 'Exchange complete'});
}