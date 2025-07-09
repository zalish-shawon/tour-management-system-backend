import { model, Schema } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, { _id: false, versionKey: false });


const userSchema = new Schema<IUser> ({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
        
    },
    phone: {
        type: String,
        required: false,
    },
    picture: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: String,
        default: false,
    },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
    },
    isVerified: {
        type: String,
        default: false,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER,
    },
    auths: [authProviderSchema],
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking',
    }],
    guides: [{
        type: Schema.Types.ObjectId,
        ref: 'Guide',
    }],
}, {
    timestamps: true,
    versionKey: false,
})

export const User = model<IUser>("User", userSchema);
