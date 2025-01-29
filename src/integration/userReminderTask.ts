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

// Simulating an array of users with their last login dates
const users = [
  { email: 'user1@example.com', lastLogin: new Date('2025-01-07') },
  { email: 'user2@example.com', lastLogin: new Date('2025-01-08') },
  { email: 'user3@example.com', lastLogin: new Date('2025-01-05') },
  { email: 'user4@example.com', lastLogin: new Date('2025-01-08') },
];

console.log("User Reminder Task is loaded and running...");

// Cron job to run every day at midnight
cron.schedule('* * * * *', () => {
    console.log("Entered Task is loaded and running...");
  // Get the date 2 days ago
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // Filter out the users who haven't logged in for more than 2 days
  const inactiveUsers = users.filter(user => user.lastLogin <= twoDaysAgo);

  // Check if there are any inactive users
  if (inactiveUsers.length > 0) {
    // Loop through the inactive users and log them
    inactiveUsers.forEach(user => {
      console.log(`User ${user.email} hasn't logged in for more than 2 days.`);
    });
  } else {
    console.log('No users need to be reminded.');
  }
  
});
