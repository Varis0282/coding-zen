import connectToDatabase from '@/mongoDb/connection';
import { DiaryEntry } from '@/mongoDb/schema';
import { NextResponse } from 'next/server';
import { successObj, errorObj } from '@/utils/response';
import privateRoute from '@/utils/privateRoute';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const { _id: userId } = await privateRoute(request);

        const diaryData = await request.json();

        const query: { user: any; entryDate?: Date } = { user: userId };

        if (diaryData && diaryData.entryDate) {
            query.entryDate = new Date(diaryData.entryDate);
        }

        const entries = await DiaryEntry.find(query);

        return NextResponse.json(
            { message: "Diary entries retrieved successfully", data: entries, ...successObj },
            { status: 200 }
        );
    } catch (error: any) {
        console.log("error:", error);
        return NextResponse.json(
            { message: error.message, ...errorObj },
            { status: 500 }
        );
    }
}
