import mongoose, { Schema, Document } from 'mongoose';

// 1. 와인 모임 데이터의 타입(모양)을 정의합니다. (TypeScript)
export interface IMeeting extends Document {
    name: string;
    wine: string;
    location: string;
    date: Date;
}

// 2. Mongoose 스키마를 생성합니다. (MongoDB)
const MeetingSchema: Schema = new Schema({
    name: { type: String, required: true },
    wine: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
});

// 3. 스키마를 기반으로 모델을 만들고 내보냅니다.
export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
