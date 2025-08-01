import clientPromise from "@/lib/mongodb";
import { getUserFromCookies } from "@/middleware";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const { user, errorResponse } = await getUserFromCookies(request);
    if (errorResponse) { return errorResponse; }

    const client = await clientPromise;
    const db = client.db('appunto');
    const exchanges = db.collection('exchanges');

    const userId = user.payload.userId as string;
    const userExchanges = await exchanges.find({ receiverId: new ObjectId(userId), status: 'pending' }).toArray();

    const userExchangesWithSender = await exchanges.aggregate([
        {
            $match: {
                receiverId: new ObjectId(userId),
                status: 'pending'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'senderId',
                foreignField: '_id',
                as: 'senderInfo'
            }
        },
        {
            $unwind: '$senderInfo'
        },
        {
            $project: {
                _id: 1,
                senderId: 1,
                receiverId: 1,
                status: 1,
                // Include fields from exchange
                // Include username from sender
                senderUsername: '$senderInfo.username'
            }
        }
    ]).toArray();

    return NextResponse.json(userExchangesWithSender);
}