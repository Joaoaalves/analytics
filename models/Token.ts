import mongoose, { Schema } from 'mongoose';
import { IToken } from '@/types/models';

const TokenSchema: Schema = new Schema({
  accessToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Token || mongoose.model<IToken>('Token', TokenSchema);