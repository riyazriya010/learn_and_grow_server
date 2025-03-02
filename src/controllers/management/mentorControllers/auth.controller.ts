import { JwtService } from "../../../integration/jwt"
import MentorAuthServices from "../../../services/business/mentorServices/auth.services"
import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { verifyToken } from "../../../integration/mailToken";
import getId from "../../../integration/getId";
import { mentorAuthServices } from "../../../services/business/mentorServices/auth.services";


import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || "",
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    },
});



export default class MentorAuthController {
    private mentorAuthServices: MentorAuthServices
    private jwtService: JwtService

    constructor(mentorAuthServices: MentorAuthServices) {
        this.mentorAuthServices = mentorAuthServices
        this.jwtService = new JwtService()
    }

    async MentorLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body
            const logUser = await this.mentorAuthServices.mentorLogin(email, password)

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

            // SuccessResponse(res, 200, "Mentor Logged", logUser, String(accessToken), String(refreshToken))
            // return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'PasswordInvalid' || error.name === 'EmailNotFound') {
                    ErrorResponse(res, 401, "Invalid Credentials")
                    return
                }
                if (error.name === 'MentorBlocked') {
                    ErrorResponse(res, 403, "Mentor Blocked")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorSignUp(req: Request, res: Response): Promise<any> {
        try {
            const {
                username,
                email,
                phone,
                password,
                expertise,
                skills
            } = req.body
            const addedMentor = await this.mentorAuthServices.mentorSignUp({
                username,
                email,
                phone,
                password,
                expertise,
                skills
            })

            const accessToken = await this.jwtService.createToken(addedMentor?._id, String(addedMentor?.role))
            const refreshToken = await this.jwtService.createRefreshToken(addedMentor?._id, String(addedMentor?.role))

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
                    message: 'User Signup Successfully',
                    result: addedMentor
                })

            // SuccessResponse(res, 200, "Mentor Added Successfully", addedMentor, String(accessToken), String(refreshToken))
            // return
        } catch (error: unknown) {
            console.info('singup error: ', error)
            if (error instanceof Error) {
                if (error.name === 'MentorExist') {
                    ErrorResponse(res, 409, 'Mentor Already Exists')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGoogleSignUp(req: Request, res: Response): Promise<any> {
        try {
            const { email, displayName } = req.body
            const addedMentor = await this.mentorAuthServices.mentorGoogleSignUp(email, displayName)

            const accessToken = await this.jwtService.createToken(addedMentor?._id, String(addedMentor?.role))
            const refreshToken = await this.jwtService.createRefreshToken(addedMentor?._id, String(addedMentor?.role))

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
                    result: addedMentor
                })

            // SuccessResponse(res, 200, "Mentor Added SucessFully", addedMentor, String(accessToken), String(refreshToken))
            // return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'MentorExist') {
                    ErrorResponse(res, 409, 'Mentor Already Exists')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGoogleLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body
            const logMentor = await this.mentorAuthServices.mentorGoogleLogin(email)

            const accessToken = await this.jwtService.createToken(logMentor?._id, String(logMentor?.role))
            const refreshToken = await this.jwtService.createRefreshToken(logMentor?._id, String(logMentor?.role))

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
                    message: 'User Signup Successfully',
                    result: logMentor
                })

            // SuccessResponse(res, 200, "Mentor Logged", logMentor, String(accessToken), String(refreshToken))
            // return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'EmailNotFound') {
                    ErrorResponse(res, 401, "Invalid Credentials Please Signup")
                    return
                }
                if (error.name === 'MentorBlocked') {
                    ErrorResponse(res, 403, "Mentor Blocked")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorForgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const updateMentor = await this.mentorAuthServices.mentorForgetPassword(email, password)
            SuccessResponse(res, 200, "Mentor Password updated", updateMentor)
            return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === "MentorNotFound") {
                    ErrorResponse(res, 404, "Mentor Not Found")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorProfileUpdate(req: Request, res: Response): Promise<void> {
        try {

            const file = req.file as any;
            const { username, phone } = req.body
            const data = {
                username,
                phone,
                profilePicUrl: file?.location
            }

            const mentorId = await getId('accessToken', req)
            const updatedProfile = await this.mentorAuthServices.mentorProfileUpdate(String(mentorId), data)
            SuccessResponse(res, 200, "Mentor Profile Updated", updatedProfile)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorCheck(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.query
            const checkMentor = await this.mentorAuthServices.mentorCheck(String(userId))
            SuccessResponse(res, 200, "Mentor Got It", checkMentor)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async mentorVerify(req: Request, res: Response): Promise<void> {
        try {
            const token = req.query.token as string

            // Verify the token
            const verifiedToken = await verifyToken(token);

            console.log('Verified token:', verifiedToken);

            if (!verifiedToken.status) {
                const error = new Error('Token Expired')
                error.name = 'TokenExpired'
                throw error
            }

            const payload = verifiedToken.payload;

            // Ensure payload is valid
            if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                const error = new Error('Invalid token payload')
                error.name = 'InvalidTokenPayload'
                throw error
            }

            const { email } = payload;

            const verifyUser = await this.mentorAuthServices.mentorVerify(String(email))

            SuccessResponse(res, 200, "User Verified", verifyUser)
            return
        } catch (error: unknown) {
            console.info('mentor verify error: ', error)
            if (error instanceof Error) {
                if (error.name === 'TokenExpired') {
                    ErrorResponse(res, 401, "Token Expired")
                    return
                }
                if (error.name === 'InvalidTokenPayload') {
                    ErrorResponse(res, 401, 'Invalid token payload')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorReVerify(req: Request, res: Response): Promise<void> {
        try {
            const email = req.query.email
            const verifiyed = await this.mentorAuthServices.mentorReVerify(String(email))
            SuccessResponse(res, 200, "User Verified", verifiyed)
            return;
        } catch (error: unknown) {
            console.info('mentor verify error: ', error)
            ErrorResponse(res, 500, 'Internal Server Error')
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


    async mentorLogout(req: Request, res: Response): Promise<any> {
        try {

            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;

            const addToken = await this.mentorAuthServices.addTokens(accessToken, refreshToken)

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

export const mentorAuthController = new MentorAuthController(mentorAuthServices)
