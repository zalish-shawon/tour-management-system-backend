/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async(req: Request, res: Response, next: NextFunction) => {
    try {

        // throw new AppError("fake message", httpStatus.BAD_REQUEST, "");
        const user = await UserServices.createUser(req.body);

        res.status(httpStatus.CREATED).json({
            message: "User created successfully",
            user,
        })
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error);
        next(error);
       
    }
}

export const userControllers = {
    createUser,
}

