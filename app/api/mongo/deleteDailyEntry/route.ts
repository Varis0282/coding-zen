import connectToDatabase from '@/mongoDb/connection';
import { DiaryEntry } from '@/mongoDb/schema';
import { NextResponse } from 'next/server';
import { successObj, errorObj } from '@/utils/response';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const diaryData = await request.json();
        const existingDiary = await DiaryEntry.findById(diaryData._id);
        if (!existingDiary) {
            return NextResponse.json(
                { message: "Diary not found", ...errorObj },
                { status: 404 }
            );
        }

        await (existingDiary as any).delete();

        return NextResponse.json(
            { message: "Diary deleted successfully", data: existingDiary, ...successObj },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message, ...errorObj },
            { status: 500 }
        );
    }
}
