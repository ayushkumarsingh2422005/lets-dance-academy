
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendanceRecord {
    student: mongoose.Types.ObjectId;
    studentName: string;
    status: 'present' | 'absent';
}

export interface IAttendance extends Document {
    batch: mongoose.Types.ObjectId;
    branch: string;
    date: Date;
    records: IAttendanceRecord[];
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true }
});

const AttendanceSchema = new Schema<IAttendance>({
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    branch: { type: String, required: true },
    date: { type: Date, required: true },
    records: [AttendanceRecordSchema]
}, { timestamps: true });

// Compound index to ensure uniqueness for Batch + Branch + Date
AttendanceSchema.index({ batch: 1, branch: 1, date: 1 }, { unique: true });

const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
