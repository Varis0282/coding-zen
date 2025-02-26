import connectToDatabase from '@/mongoDb/connection';
import { DiaryEntry } from '@/mongoDb/schema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { successObj, errorObj } from '@/utils/response';
import privateRoute from '@/utils/privateRoute';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const { _id: user } = await privateRoute(request);

        const { entryDate, summary, mood } = await request.json();

        const diary = new DiaryEntry({
            user: user,
            entryDate: entryDate,
            summary: summary,
            mood: mood,
        });

        await diary.save();
        return NextResponse.json({ message: "Diary added successfully", data: diary, ...successObj }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, ...errorObj }, { status: 500 });
    }
}