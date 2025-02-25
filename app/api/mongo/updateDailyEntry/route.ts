import connectToDatabase from '@/mongoDb/connection';
import { DiaryEntry } from '@/mongoDb/schema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { successObj, errorObj } from '@/utils/response';
import _ from 'lodash';

export async function PUT(request: Request) {
    try {
        await connectToDatabase();

        const diaryData = await request.json();

        const existingDiary: any = await DiaryEntry.findById(diaryData._id);
        if (!existingDiary) {
            return NextResponse.json({ message: "Diary not found", ...errorObj }, { status: 404 });
        }

        _.each(diaryData, (value: any, key: string | number) => {
            existingDiary[key] = value;
        });

        await existingDiary.save();

        return NextResponse.json({ message: "Diary added successfully", data: existingDiary, ...successObj }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, ...errorObj }, { status: 500 });
    }
}