const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { AUTH } = require('../utils/constants');

// Create reusable transporter
let transporter;

// Initialize email transporter
const initTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    return transporter;
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<boolean>} True if email sent successfully
 */
exports.sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transport = initTransporter();

        await transport.sendMail({
            from: process.env.EMAIL_FROM || '"Ride Admin" <no-reply@rideadmin.com>',
            to,
            subject,
            text,
            html,
        });

        logger.info(`Email sent to ${to}: ${subject}`);
        return true;
    } catch (error) {
        logger.error('Error sending email:', error);

        // Don't fail the request if email sending fails in production
        if (process.env.NODE_ENV === 'production') {
            return false;
        }

        throw error;
    }
};

/**
 * Send an OTP email for registration or password reset
 * @param {string} email - Recipient email
 * @param {string} otpCode - OTP code to send
 * @param {string} purpose - Purpose of OTP (registration or password_reset)
 * @returns {Promise<boolean>} True if email sent successfully
 */
exports.sendOtpEmail = async (email, otpCode, purpose) => {
    const subject = purpose === AUTH.OTP_PURPOSE.PASSWORD_RESET
        ? 'Reset Your Password'
        : 'Verify Your Email';

    const text = purpose === AUTH.OTP_PURPOSE.PASSWORD_RESET
        ? `Your password reset code is: ${otpCode}. This code will expire in ${AUTH.OTP_EXPIRATION_MINUTES} minutes.`
        : `Your verification code is: ${otpCode}. This code will expire in ${AUTH.OTP_EXPIRATION_MINUTES} minutes.`;

    const html = purpose === AUTH.OTP_PURPOSE.PASSWORD_RESET
        ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You have requested to reset your password. Use the following code to complete the process:</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otpCode}</strong>
        </div>
        <p>This code will expire in ${AUTH.OTP_EXPIRATION_MINUTES} minutes.</p>
        <p>If you did not request a password reset, please ignore this email or contact support.</p>
      </div>
    `
        : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email</h2>
        <p>Thank you for registering. Please use the following code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otpCode}</strong>
        </div>
        <p>This code will expire in ${AUTH.OTP_EXPIRATION_MINUTES} minutes.</p>
        <p>If you did not create an account, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, text, html });
};