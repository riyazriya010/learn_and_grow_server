import mongoose from "mongoose";
import { BadgeManagementModel, IBadgeManagement } from "../../../models/adminBadge.model";
import { BadgeModel, IBadge } from "../../../models/studentBadges.model";
import { IUserWallet, UserWalletModel } from "../../../models/userWallet.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";
import { IPurchasedCourse, PurchasedCourseModel } from "../../../models/purchased.model";
import { CourseModel, ICourse } from "../../../models/uploadCourse.model";
import { ChapterModel, IChapter } from "../../../models/chapter.model";



export default class StudentRewardRepository extends CommonBaseRepository<{
    Badge: IBadge;
    UserWallet: IUserWallet;
    BadgeManagement: IBadgeManagement;
    Course: ICourse;
    Purchase: IPurchasedCourse;
    Chapters: IChapter;
}> {

    constructor() {
        super({
            Badge: BadgeModel,
            UserWallet: UserWalletModel,
            BadgeManagement: BadgeManagementModel,
            Course: CourseModel,
            Purchase: PurchasedCourseModel,
            Chapters: ChapterModel
        })
    }

    async studentRewardConvert(badgeId: string, studentId: string): Promise<any> {
        try {
            const findBadge = await this.findById('Badge', badgeId);

            if (findBadge) {
                const badge = await this.findById('BadgeManagement', String(findBadge?.badgeId))
                const badgeName = badge?.badgeName
                // Fetch badge value directly from the Badge collection
                const value = Number(badge?.value);

                if (isNaN(value)) {
                    throw new Error("Invalid badge value");
                }

                // Find the user's wallet
                let userWallet = await this.findOne('UserWallet', { userId: studentId });

                if (userWallet) {
                    // Add value to the wallet balance
                    userWallet.balance += value;

                    // Add transaction record
                    userWallet.transactions.push({
                        type: "credit",
                        amount: value,
                        date: new Date(),
                        description: `${badgeName} Reward`,
                    });

                    // Save wallet update
                    await userWallet.save();
                } else {
                    // Create a new wallet if it doesn't exist
                    userWallet = await this.createData('UserWallet', {
                        userId: new mongoose.Types.ObjectId(studentId),
                        balance: value,
                        transactions: [
                            {
                                type: "credit",
                                amount: value,
                                date: new Date(),
                                description: `${badgeName} Reward`,
                            },
                        ],
                    } as unknown as Partial<IUserWallet>);
                }

                console.log("Updated Wallet:", userWallet);

                const deleteBadge = await this.deleteById('Badge', badgeId)
                return deleteBadge
            }

        } catch (error: unknown) {
            throw error
        }
    }

    async studentWallet(studentId: string, page: number, limit: number): Promise<any> {
        try {
            const pageNumber = Number(page) || 1;
            const limitNumber = Number(limit) || 10;

            const studentWallet = await UserWalletModel.findOne(
                { userId: new mongoose.Types.ObjectId(studentId) },
                {
                    balance: 1,
                    transactions: { $slice: [(pageNumber - 1) * limitNumber, limitNumber] }
                }
            );

            if (!studentWallet) {
                throw new Error("Wallet not found");
            }

            const totalTransactions = await UserWalletModel.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(studentId) } },
                { $project: { total: { $size: "$transactions" } } }
            ]);

            const totalWallets = totalTransactions[0]?.total || 0;
            const totalPages = Math.ceil(totalWallets / limitNumber);

            return {
                wallets: {
                    balance: studentWallet.balance,
                    transactions: studentWallet.transactions,
                },
                currentPage: pageNumber,
                totalPages,
                totalWallets,
            };
        } catch (error: unknown) {
            throw error
        }
    }

    async studentWalletBalance(studentId: string): Promise<any> {
        try {
            const getBalance = await this.findOne('UserWallet', { userId: studentId })
            return getBalance?.balance
        } catch (error: unknown) {
            throw error
        }
    }

    async studentwalletBuyCourse(studentId: string, price: string, courseId: string): Promise<any> {
        try {
            const findCourse = await this.findById('Course', courseId)
            const mentorId = findCourse?.mentorId

            const findChapters = await this.findAll('Chapters', { courseId: courseId })

            if (findChapters.length === 0) {
                const error = new Error('Chapters Not Found')
                error.name = "Chapters Not Found"
                throw error
            }

            const completedChapters = findChapters.map((chapter: any) => ({
                chapterId: chapter._id,
                isCompleted: false,
            }));

            const purchasedCourse = {
                userId: new mongoose.Types.ObjectId(studentId), // ✅ Correct
                courseId: new mongoose.Types.ObjectId(courseId), // ✅ Correct
                mentorId: mentorId ? new mongoose.Types.ObjectId(String(mentorId)) : undefined,// Convert if not undefined
                transactionId: `Wallet Buyed`,
                completedChapters,
                isCourseCompleted: false,
                price: Number(price),
            };

            const createdCourse = await this.createData('Purchase', purchasedCourse as unknown as Partial<IPurchasedCourse>)

            //dedection from user wallet
            const findWallet = await this.findOne('UserWallet', { userId: studentId });

            if (!findWallet) {
                throw new Error("Wallet not found");
            }

            // Deduct balance correctly
            findWallet.balance -= Number(price);

            // Add transaction entry
            findWallet.transactions.push({
                type: 'debit',
                amount: Number(price),
                date: new Date(),
                description: 'Course Purchased',
            });

            // Save updated wallet
            await findWallet.save();

            return createdCourse
        } catch (error: unknown) {
            throw error
        }
    }

}

