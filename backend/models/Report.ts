import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  id: string; // User-facing ID (e.g. ALRT-1234)
  email: string;
  type: string;
  severity: string;
  status: 'ACTIVE' | 'RESOLVED';
  location: string;
  time: string;
  pulse: boolean;
  description: string;
  riskLevel: number;
  confidence: number;
  actions: string[];
  createdAt: Date;
}

const ReportSchema: Schema = new Schema({
  id: { type: String, required: true }, // Store the custom ID
  email: { type: String, required: true, lowercase: true, trim: true },
  type: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE' },
  location: { type: String, required: true },
  time: { type: String, required: true },
  pulse: { type: Boolean, default: false },
  description: { type: String },
  riskLevel: { type: Number },
  confidence: { type: Number },
  actions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
