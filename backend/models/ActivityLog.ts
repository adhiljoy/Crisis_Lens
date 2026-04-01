import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  email: string;
  action: 'LOGIN' | 'LOGOUT' | 'REPORT' | 'ANALYSIS';
  timestamp: Date;
  data?: any;
}

const ActivityLogSchema: Schema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  action: { type: String, enum: ['LOGIN', 'LOGOUT', 'REPORT', 'ANALYSIS'], required: true },
  timestamp: { type: Date, default: Date.now },
  data: { type: Schema.Types.Mixed }
});

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
