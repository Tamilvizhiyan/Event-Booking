const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

/** 
 * Email Configuration
 * Note: Use environment variables in production
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

/**
 * 1. Cloud Function: Send Booking Confirmation Email
 * Triggered on new booking in Firestore
 */
exports.sendBookingConfirmation = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const mailOptions = {
      from: '"EventifyHub" <no-reply@eventifyhub.com>',
      to: booking.userEmail || 'registered-user@email.com',
      subject: `Confirmation: You're going to ${booking.eventTitle}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #4f46e5;">Ticket Confirmation Received</h2>
          <p>Hi ${booking.userName},</p>
          <p>Your tickets for <strong>${booking.eventTitle}</strong> are confirmed!</p>
          <hr />
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Seats Reserved:</strong> ${booking.seatsBooked}</p>
          <p><strong>Total Paid:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Event Date:</strong> ${booking.eventDate}</p>
          <p><strong>Location:</strong> ${booking.eventLocation}</p>
          <hr />
          <p>Present your digital pass QR code at the entrance for quick entry.</p>
          <p>See you there!</p>
          <p>Team EventifyHub</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Confirmation email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });

/**
 * 2. Cloud Function: Event Reminders (Scheduled)
 * Runs daily to notify users about events happening within 24 hours
 */
exports.scheduledEventReminders = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Logic to fetch events and related bookings would go here
    // And send reminder emails similarly
    console.log('Scanning for upcoming events...');
    return null;
  });
