import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password,...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, 10)

    // console.log(hashedPassword);

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user

}

const updateUser = async(userId: string, payload: Partial<IUser>, decodedTOken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if(!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // if (ifUserExist.isDeleted || ifUserExist.isActive === IsActive.BLOCKED) {
    //     throw new AppError(httpStatus.FORBIDDEN, "This user cannot be updated");
    // }


    if(payload.role){
        if(decodedTOken.role === Role.USER || decodedTOken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized");
        }

        if(payload.role === Role.SUPER_ADMIN && decodedTOken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized");

        }
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified) {
        if(decodedTOken.role === Role.USER || decodedTOken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized");
        }

    }

    if(payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUNDS as string);
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true});

    return newUpdateUser;

} 

const getAllUsers = async () => {
    const users =  await User.find({});
    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers,
        }
    }
}

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
}