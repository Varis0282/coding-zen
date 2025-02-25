import connectToDatabase from '@/mongoDb/connection';
import { User } from '@/mongoDb/schema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { successObj, errorObj } from '@/utils/response';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const { name, email, password } = await request.json();

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();
        return NextResponse.json({ message: "User added successfully", data: user, ...successObj }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, ...errorObj }, { status: 500 });
    }
}