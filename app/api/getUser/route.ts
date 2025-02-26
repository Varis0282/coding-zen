import connectToDatabase from '@/mongoDb/connection';
import { User } from '@/mongoDb/schema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { successObj, errorObj } from '@/utils/response';
import jwt from 'jsonwebtoken';
import privateRoute from '@/utils/privateRoute';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const user = await privateRoute(request);
        console.log("🚀 => user:", user);

        if (user instanceof NextResponse) {
            return user;
        }
        console.log(user);

        return NextResponse.json({ message: "Login successful", data: user, ...successObj }, { status: 200 });
    } catch (error: any) {
        console.log("🚀 => error:", error);
        return NextResponse.json({ message: error.message, ...errorObj }, { status: 500 });
    }
}