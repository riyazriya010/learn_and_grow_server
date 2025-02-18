// import cron from 'node-cron';
// import userService from '../services/userService';
// // import sendEmail from '../utils/emailSender';

// // Cron job to run every day at midnight
// cron.schedule('0 0 * * *', async () => {
//   const inactiveUsers = await userService.getInactiveUsers();

// //   if (inactiveUsers.length > 0) {
// //     inactiveUsers.forEach(async (user) => {
// //       await sendEmail(
// //         user.email,
// //         'We Miss You!',
// //         'It looks like you haven\'t logged in for a while. Come back and check out what\'s new!'
// //       );
// //     });
//   } else {
//     console.log('No users need to be reminded.');
//   }
// });



import cron from 'node-cron';
import UserModel from '../models/user.model';
import Mail from './nodemailer';

cron.schedule('* * * * *', async () => {
  console.log("Checking users with 0 studied hours...");

  try {
    // Fetch users whose studiedHours is 0
    const inactiveUsers = await UserModel.find({ studiedHours: 0 });

    if (inactiveUsers.length > 0) {
      inactiveUsers.forEach((user: any) => {
        console.log(`User ${user.username} has studied 0 hours.`);
        const mail = new Mail()
        mail.sendRemainderMail(String(user?.email), String(user?.username))
          .then(info => {
            console.log('Verification email sent successfully: ');
          })
          .catch(error => {
            console.error('Failed to send verification email:', error);
          });
      });
    } else {
      console.log('No users with 0 studied hours.');
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});