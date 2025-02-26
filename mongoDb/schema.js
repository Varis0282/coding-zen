import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const diaryEntrySchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        entryDate: { type: Date, required: true, unique: true },
        summary: [{ type: String, required: true }],
        mood: {
            type: String,
            enum: ['cheerful', 'inspiring', 'happy', 'sad', 'neutral', 'anxious'],
            required: true,
        },
        deleted: { type: Boolean, default: false },
    }, { timestamps: true }
);

diaryEntrySchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: ['find', 'findOne', 'count', 'update', 'findById']
});

const DiaryEntry = mongoose.models.DiaryEntry || mongoose.model('DiaryEntry', diaryEntrySchema);

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    }, { timestamps: true }
);
const User = mongoose.models.User || mongoose.model('User', userSchema);

export { DiaryEntry, User };