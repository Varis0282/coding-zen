import connectToDatabase from '@/mongoDb/connection';
import { User } from '@/mongoDb/schema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { successObj, errorObj } from '@/utils/response';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const { email, password } = await request.json();

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return NextResponse.json({ message: "Invalid credentials", ...errorObj }, { status: 401 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "Invalid credentials", ...errorObj }, { status: 401 });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { _id: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );


        return NextResponse.json({ message: "Login successful", data: { _id: existingUser._id, token }, ...successObj }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, ...errorObj }, { status: 500 });
    }
}