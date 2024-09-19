import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  project: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  status: 'To Do' | 'In Progress' | 'Completed';
}

const TaskSchema: Schema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
});

export default mongoose.model<ITask>('Task', TaskSchema);
