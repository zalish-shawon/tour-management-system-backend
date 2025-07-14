/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { User } from "../user/user.model"
import { AuthService } from "./auth.service"
import AppError from "../../errorHelpers/AppError"
import { setAuthCookie } from "../../utils/setCookie"
import { createUserToken } from "../../utils/userToken"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"

const credentialsLogin =  catchAsync(async(req: Request, res: Response, next: NextFunction)=> {

        const loginInfo = await AuthService.credentialsLogin(req.body);


        setAuthCookie(res, loginInfo)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged in successfully",
            data: loginInfo,
        })
})

const getNewAccessToken =  catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            throw new AppError( httpStatus.BAD_REQUEST, "No refresh token received from token" )
        }
        const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);

        setAuthCookie(res, tokenInfo);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "New access token retrived successfully",
            data: tokenInfo,
        })
})

const logout =  catchAsync(async(req: Request, res: Response, next: NextFunction)=> {

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged out successfully",
            data: null,
        })
})

const resetPassword =  catchAsync(async(req: Request, res: Response, next: NextFunction)=> {


        const newPassword = req.body.newPassword;

        const oldPassword = req.body.oldPassword;

        const decodedToken = req.user;

        const newUpdatedPassword = await AuthService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Password changed successfully",
            data: null,
        })
})


const googleCallBackController = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const user = req.user

   let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    if(!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)


})


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallBackController
    
}