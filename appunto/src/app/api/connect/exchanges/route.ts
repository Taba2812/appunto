import clientPromise from "@/lib/mongodb";
import { getUserFromRequest } from "@/middleware";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const { user, errorResponse } = getUserFromRequest(request);
    if (errorResponse) { return errorResponse; }

    const client = await clientPromise;
    const db = client.db('appunto');
    const exchanges = db.collection('exchanges');

    const userExchanges = await exchanges.find({ receiverId: new ObjectId(user.payload.userId), status: 'pending' }).toArray();

    return NextResponse.json(userExchanges);
}