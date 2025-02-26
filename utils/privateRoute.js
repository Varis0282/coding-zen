import { NextResponse } from 'next/server';
import { User } from '../mongoDb/schema';
import jwt from 'jsonwebtoken';

export default async function privateRoute(req) {
    try {
        const authorization = req.headers.get('authorization');
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authorization.split(' ')[1]; // Extract token after 'Bearer '
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(_id);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        user.password = undefined;
        req.user = user;
        return user;
    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
};