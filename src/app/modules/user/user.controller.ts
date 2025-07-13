/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
        const user = await UserServices.createUser(req.body);

        // res.status(httpStatus.CREATED).json({
        //     message: "User created successfully",
        //     user,
        // })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User created successfully",
            data: user,
        });
});


const updateUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
        const userId = req.params.id;
        const payload = req.body;
        // const token = req.headers.authorization
        // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_KEY as string) as JwtPayload;
        const verifiedToken = req.user;
        const user = await UserServices.updateUser(userId, payload, verifiedToken);


        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User updated successfully",
            data: user,
        });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
   
        const result = await UserServices.getAllUsers();

        // res.status(httpStatus.OK).json({
        //     success: true,
        //     message: "Users fetched successfully",
        //     date: users,
        // })
        
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Users fetched successfully",
            data: result.data,
            meta: result.meta
        })
})

export const userControllers = {
    createUser,
    getAllUsers,
    updateUser,
}

