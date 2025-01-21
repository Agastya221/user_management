import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    dateOfBirth: Date;
    email: string;
    password: string;
    refreshToken: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

enum Role {
    Admin = 'Admin',
    User = 'User',
    Moderator = 'Moderator',
}


const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.User },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    refreshToken: { type: String },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
