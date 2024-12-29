import { Request, Response } from "express"
import { MentorServices } from "../services/mentorService"
import { JwtService } from "../integration/jwt"
import bcrypt from 'bcrypt'
import getId from "../integration/getId"
import { verifyToken } from "../integration/mailToken"
import { CourseModel } from "../models/uploadCourse.model"
import { Chapter } from "../models/chapter.model"

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    location: string; // Assuming you're using S3 and have a location property
}

interface MulterFiles {
    [fieldname: string]: MulterFile[]; // Each field can have an array of files
}

export class MentorController {
    private mentorServices: MentorServices
    private jwtService: JwtService

    constructor() {
        this.mentorServices = new MentorServices()
        this.jwtService = new JwtService()
    }


    /* ------------------------------- WEEK 1 ---------------------------*/

    public async mentorSignUp(req: Request, res: Response): Promise<any> {
        try {
            let {
                username,
                email,
                phone,
                password,
                expertise,
                skills
            } = req.body

            const saltRound = 10
            const hashPassword = await bcrypt.hash(password, saltRound)
            password = hashPassword

            const ExistMentor = await this.mentorServices.findByEmail(email)

            if (ExistMentor) {
                return res.status(409).send({ message: 'Mentor Already Exist', success: false })
            }

            const addedMentor = await this.mentorServices.mentorSignUp({
                username, email, phone, password, expertise, skills
            })

            if (addedMentor) {

                const userJwtToken = await this.jwtService.createToken(addedMentor._id, addedMentor.role)
                const userRefreshToken = await this.jwtService.createRefreshToken(addedMentor._id, addedMentor.role)

                return res
                    .status(201)
                    .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                    .send({
                        success: true,
                        message: 'Mentor Added Successfully',
                        user: addedMentor
                    })
            }

            //  return res.status(201).send({user: addedMentor, message: 'Mentor Added Successfully', success: true })

        } catch (error: any) {
            console.log(error.message)
        }
    }


    public async mentorLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body

            const loggedMentor = await this.mentorServices.mentorLogin(email, password)

            if (loggedMentor === null) {
                return res.status(401).send({ message: 'Invalid Credentials', success: false })
            }

            const isBlocked = loggedMentor?.isBlocked

            if (isBlocked) {
                return res.status(403).send({
                    message: 'Mentor Blocked',
                    success: false
                })
            }

            const userJwtToken = await this.jwtService.createToken(loggedMentor._id, String(loggedMentor.role))
            const userRefreshToken = await this.jwtService.createRefreshToken(loggedMentor._id, String(loggedMentor.role))

            return res
                .status(200)
                .cookie('accessToken', userJwtToken, {
                    httpOnly: false
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'User Logged Successfully',
                    user: loggedMentor
                })

        } catch (error) {
            console.error(error)
        }
    }


    public async forgetPassword(req: Request, res: Response): Promise<any> {
        try {
            const data = req.body
            const response = await this.mentorServices.forgetPassword(data)

            if (!response) {
                return res
                    .status(401)
                    .send({
                        message: 'Invalid Email',
                        success: true
                    })
            }

            return res
                .status(200)
                .send({
                    message: 'Password Updated',
                    success: true,
                    user: response
                })

        } catch (error) {
            console.log(error)
        }
    }



    public async mentorGoogleLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body

            const addMentor = await this.mentorServices.mentorGoogleLogin(email)

            if (!addMentor) {
                return res.status(403).send({
                    message: 'Google User Not Found Please Go to Signup Page',
                    success: false
                })
            }


            if (addMentor?.isBlocked === true) {
                return res.status(403).send({
                    message: 'You Are Blocked',
                    success: false
                })
            }

            if (addMentor && addMentor.role) {
                const userJwtToken = await this.jwtService.createToken(addMentor._id, addMentor.role)
                const userRefreshToken = await this.jwtService.createRefreshToken(addMentor._id, addMentor.role)

                return res
                    .status(201)
                    .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                    .send({
                        success: true,
                        message: 'Google Logined Successfully',
                        user: addMentor
                    })
            }

        } catch (error: any) {
            console.error(error.message)
        }

    }

    public async mentorGoogleSignUp(req: Request, res: Response): Promise<any> {
        try {
            const { email, displayName } = req.body

            const ExistUser = await this.mentorServices.findByEmail(email)

            if (ExistUser) {
                return res.status(409).send({ message: 'User Already Exist', success: false })
            }

            const addMentor = await this.mentorServices.mentorGoogleSignUp(email, displayName)

            if (addMentor && addMentor.role) {
                const userJwtToken = await this.jwtService.createToken(addMentor._id, addMentor.role)
                const userRefreshToken = await this.jwtService.createRefreshToken(addMentor._id, addMentor.role)

                return res
                    .status(201)
                    .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                    .send({
                        success: true,
                        message: 'Google Account Added Successfully',
                        user: addMentor
                    })
            }

        } catch (error: any) {
            console.error(error.message)
        }
    }

    public async profileUpdate(req: Request, res: Response): Promise<any> {
        try {
            const { username, phone } = req.body
            const data = {
                username,
                phone
            }

            const userId = await getId('accessToken', req)
            const response = await this.mentorServices.profileUpdate(String(userId), data)
            if (response) {
                return res.status(201).send({
                    message: 'Mentor Updated',
                    success: true,
                    user: response
                })
            }
        } catch (error: any) {
            console.log(error)
        }
    }


    public async checkMentor(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.userId
            const response = await this.mentorServices.checkMentor(String(id))
            // if(response){
            //     const isBlocked = await this.mentorServices.isUserBlocked(String(response.email))
            //     if(isBlocked){
            //         return res.status(403).send({
            //             message: 'User is Blocked',
            //             success: true
            //         })
            //     }
            // }
            return res.status(200).send({
                message: 'User Got It',
                success: true,
                user: response
            })
        } catch (error) {
            console.log(error)
        }
    }


    public async verifyMentor(req: Request, res: Response): Promise<any> {
        try {
            const token = req.query.token as string

            // Verify the token
            const verifiedToken = await verifyToken(token);

            console.log('Verified token:', verifiedToken);

            if (!verifiedToken.status) {
                console.log('token expired')
                // throw new Error(verifiedToken.message || 'Token verification failed');
                return res.status(401).send({
                    message: 'Token Expired',
                    status: false
                })
            }

            const payload = verifiedToken.payload;

            // Ensure payload is valid
            if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                throw new Error('Invalid token payload');
            }

            const { email } = payload;

            // Verify user using the email
            const response = await this.mentorServices.verifyMentor(email);
            if (!response) {
                throw new Error('User not found or verification failed');
            }

            return res.status(201).send({ success: true, message: 'Mentor verified successfully' });

        } catch (error: any) {
            console.log("Verify Token Error:", error);

            if (error.message === "Verification Token Expired") {
                return res.status(401).send({
                    message: "Token Expired Please Goto Profile To Verify",
                    status: false,
                });
            }

            return res.status(500).send({
                message: "Internal server error",
                status: false,
            });
        }
    }


    public async mentorReVerify(req: Request, res: Response): Promise<any> {
        try {
            const email = req.query.email
            const response = await this.mentorServices.mentorReVerify(String(email))
            return res.status(200).send({
                message: 'Verification Mail sent Successfully',
                success: true,
                user: response
            })
        } catch (error) {
            console.log(error)
        }
    }



    /* ------------------------------- WEEK 2 ---------------------------*/

    public async addCourse(req: Request, res: Response): Promise<any> {
        try {
            console.log('Request files: ', req.files);
            console.log('Request body: ', req.body);
      
            // Extract files
            const files = req.files as any;
            const mediaFiles = files?.demoVideo || [];
            const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : null;
      
            // Map demo videos
            const demoVideo = mediaFiles.map((file: any) => ({
              type: 'video',
              url: file.location,
            }));
      
            // Extract thumbnail URL
            const thumbnailUrl = thumbnailFile ? thumbnailFile.location : null;
      
            // Append processed fields to request body
            req.body.demoVideo = demoVideo;
            req.body.thumbnailUrl = thumbnailUrl;
      
            // Create and save the course
            const result = await CourseModel.create(req.body);
      
            // Respond with success
            return res.status(200).send({
              message: 'Course uploaded successfully',
              success: true,
              result,
            });
          } catch (error: any) {
            console.error('Error in addCourse:', error);
            return res.status(500).send({
              message: 'An error occurred while uploading the course',
              success: false,
              error: error.message,
            });
          }
    }


    
    public async addChapter(req: Request, res: Response): Promise<any> {
        try {
            console.log('req file: ', req.file);
            console.log('req body: ', req.body);
      
            const { courseId } = req.query; // Extract courseId from the query
            const { title, description } = req.body;
      
            // Validate courseId
            if (!courseId) {
              return res.status(400).send({
                message: 'Course ID is required',
                success: false,
              });
            }
      
            // Validate the file
            const file = req.file as any;
            if (!file || !file.location) {
              return res.status(400).send({
                message: 'Chapter video file is required',
                success: false,
              });
            }
      
            // Create a new chapter
            const newChapter = await Chapter.create({
              chapterTitle: title,
              courseId,
              description,
              videoUrl: file.location,
            });
      
            // Update the course to include this chapter's ID in the fullVideo array
            await CourseModel.findByIdAndUpdate(
              courseId,
              {
                $push: {
                  fullVideo: { chapterId: newChapter._id },
                },
              },
              { new: true } // Return the updated document
            );
      
            // Respond with success
            return res.status(201).send({
              message: 'Chapter added successfully',
              success: true,
              chapter: newChapter,
            });
          } catch (error: any) {
            console.error('Error in addChapter:', error);
            return res.status(500).send({
              message: 'An error occurred while adding the chapter',
              success: false,
              error: error.message,
            });
          }
    }


}