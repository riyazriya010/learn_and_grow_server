import { Request, Response } from "express";
import { JwtService } from "../../../integration/jwt"
import StudentAuthServices, { authServices } from "../../../services/business/studentServices/auth.services"
import getId from "../../../integration/getId";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { StudentAuthResponse } from "../../../interface/students/student.types";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StringDecoder } from "string_decoder";
import BlacklistedToken from "../../../models/tokenBlackList.model";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || "",
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    },
});


export default class StudentAuthController {
    private studentAuthServices: StudentAuthServices
    private jwtService: JwtService

    constructor(studentAuthServices: StudentAuthServices) {
        this.studentAuthServices = studentAuthServices
        this.jwtService = new JwtService()
    }

    async studentLogin(req: Request, res: Response): Promise<StudentAuthResponse | any> {
        try {
            const { email, password } = req.body
            const loginUser = await this.studentAuthServices.studentLogin(email, password)

            const accessToken = await this.jwtService.createToken(loginUser?._id, String(loginUser?.role))
            const refreshToken = await this.jwtService.createRefreshToken(loginUser?._id, String(loginUser?.role))

            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                .send({
                    success: true,
                    message: 'User Logged Successfully',
                    result: loginUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'PasswordInvalid' || error.name === 'EmailNotFound') {
                    ErrorResponse(res, 401, "Invalid Credentials")
                    return
                }
                if (error.name === 'StudentBlocked') {
                    ErrorResponse(res, 403, "Student Blocked")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentSignUp(req: Request, res: Response): Promise<StudentAuthResponse | any> {
        try {
            const { username, email, phone, password } = req.body

            const addUser = await this.studentAuthServices.studentSignUp({ email, username, phone, password })
            // const { addUser, createdOtp } = userData
            const accessToken = await this.jwtService.createToken(addUser?._id, String(addUser?.role))
            const refreshToken = await this.jwtService.createRefreshToken(addUser?._id, String(addUser?.role))

            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                .send({
                    success: true,
                    message: 'User signup Successfully',
                    result: addUser
                })
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserExist') {
                    ErrorResponse(res, 409, 'User Already Exists')
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentGoogleSignUp(req: Request, res: Response): Promise<StudentAuthResponse | any> {
        try {
            const { email, displayName } = req.body
            const addStudent = await this.studentAuthServices.studentGoogleSignUp(email, displayName)

            const accessToken = await this.jwtService.createToken(addStudent?._id, String(addStudent?.role))
            const refreshToken = await this.jwtService.createRefreshToken(addStudent?._id, String(addStudent?.role))

            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                .send({
                    success: true,
                    message: 'User Google Signup Successfully',
                    result: addStudent
                })
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserExist') {
                    ErrorResponse(res, 409, 'User Already Exists')
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentGoogleLogin(req: Request, res: Response): Promise<StudentAuthResponse | any> {
        try {
            const { email } = req.body
            const logUser = await this.studentAuthServices.studentGoogleLogin(email)

            const accessToken = await this.jwtService.createToken(logUser?._id, String(logUser?.role))
            const refreshToken = await this.jwtService.createRefreshToken(logUser?._id, String(logUser?.role))

            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                .send({
                    success: true,
                    message: 'User Logged Successfully',
                    result: logUser
                })
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound') {
                    ErrorResponse(res, 404, "User Not Found Please SignUp")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentForgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const updatePassword = await this.studentAuthServices.studentForgetPassword(email, password)
            SuccessResponse(res, 200, "Password Updated Successfully")
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound') {
                    ErrorResponse(res, 404, "Email Not Found Please try another Email")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentVerify(req: Request, res: Response): Promise<void> {
        try {
            const token = req.query.token as string
            // const otp = req.query.otp as string
            // const {otp, email} = req.query
            // const verifySudent = await this.studentAuthServices.studentVerify(String(otp), String(email))
            const verifySudent = await this.studentAuthServices.studentVerify(token)
            SuccessResponse(res, 200, "Student Verified", verifySudent)
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'tokenExpired') {
                    ErrorResponse(res, 401, "Token Expired Please GoTo Profile")
                    return
                }
                if (error.name === 'OtpNotFound') {
                    ErrorResponse(res, 404, "Otp Not Found")
                    return
                }
                if (error.name === 'Invalidtokenpayload') {
                    ErrorResponse(res, 401, "Invalid Token Payload")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentProfleUpdate(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as any
            const { username, phone, profilePicUrl } = req.body
            const data: any = {
                username,
                phone,
            };

            // Only add profilePicUrl if it's provided
            if (profilePicUrl) {
                data.profilePicUrl = profilePicUrl;
            }
            const studentId = await getId('accessToken', req)
            const updateUser = await this.studentAuthServices.studentProfleUpdate(String(studentId), data)
            SuccessResponse(res, 200, "Student Profile Updated", updateUser)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentReVerify(req: Request, res: Response): Promise<any> {
        try {
            const email = req.query.email
            const verifiedUesr = await this.studentAuthServices.studentReVerify(String(email))
            const { findUser, createdOtp } = verifiedUesr
            return res.send({
                success: true,
                message: "Student Verify Otp Send",
                result: findUser,
                otp: createdOtp
            })
            // SuccessResponse(res, 200, "Student Verified", verifiedUesr)
            // return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound') {
                    ErrorResponse(res, 404, "Email Not Found Please try another Email")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCheck(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.query.userId
            const checkStudent = await this.studentAuthServices.studentCheck(String(studentId))
            SuccessResponse(res, 200, "Uesr Got It", checkStudent)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async getSignedUrl(req: Request, res: Response): Promise<any> {
        try {
            const { files } = req.body;
            if (!Array.isArray(files) || files.length === 0) {
                return res.status(400).json({ message: "No files provided" });
            }

            const urls = await Promise.all(
                files.map(async (file) => {
                    const fileKey = `courses/${Date.now()}-${file.fileName}`;

                    const command = new PutObjectCommand({
                        Bucket: process.env.BUCKET_NAME,
                        Key: fileKey,
                        ContentType: file.fileType,
                    });

                    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

                    return { fileKey, presignedUrl };
                })
            );

            res.status(200).json({ urls });
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentLogout(req: Request, res: Response): Promise<any> {
        try {

            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;

            const addToken = await this.studentAuthServices.addTokens(accessToken, refreshToken)

            console.log('tokens Added ::: ', addToken)


            return res
                .status(200)
                .clearCookie("accessToken", {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: ".learngrow.live",
                })
                .clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: ".learngrow.live",
                })
                .send({ success: true, message: "Logged out successfully" });

        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

}


export const studentAuthController = new StudentAuthController(authServices)