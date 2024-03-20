const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.post('/contact', (req, res) => {
    const { name, email, phoneNumber, message } = req.body;

    // Send email
    sendEmail(name, email, phoneNumber, message)
        .then(() => {
            res.status(200).json({ message: 'Thank you for your inquiry! We will get back to you soon.' });
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'An error occurred while sending the email.' });
        });
});

// Function to send email
async function sendEmail(name, email, phoneNumber, message) {
    try {
        const transporter = nodemailer.createTransport({
            // SMTP configuration
            // Example with Gmail SMTP
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECIPIENT,
            subject: 'New Inquiry from Contact Form',
            html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Phone Number: ${phoneNumber}</p><p>Message: ${message}</p>`
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
}

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
