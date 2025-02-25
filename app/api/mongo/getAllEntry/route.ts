import connectToDatabase from '@/mongoDb/connection';
import { DiaryEntry } from '@/mongoDb/schema';
import { NextResponse } from 'next/server';
import { successObj, errorObj } from '@/utils/response';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const diaryData = await request.json();

        const userId = "";

        const entries = await DiaryEntry.find({ user: userId });


        return NextResponse.json(
            { message: "Diary deleted successfully", data: entries, ...successObj },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message, ...errorObj },
            { status: 500 }
        );
    }
}
