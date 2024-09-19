import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  priority: 'High' | 'Medium' | 'Low';
}

const ProjectSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
});

export default mongoose.model<IProject>('Project', ProjectSchema);
