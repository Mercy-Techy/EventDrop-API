import { config } from "dotenv";
import { createTransport } from "nodemailer";

config();

let transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.MAIL_PASSKEY,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  body: any;
}

const htmlText = (body: {
  heading: string;
  content: string;
  name: string;
}) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Template</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f5f5f5;
        color: #333;
        margin: 0;
        padding: 0;
        line-height: 1.6;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #000;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 120px;
      }
      .heading {
        font-size: 28px;
        color: #000;
        text-align: center;
        margin: 20px 0;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        font-size: 16px;
        color: #555;
        line-height: 1.8;
      }
      .content p {
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="${process.env.LOGO_URL}" alt="Logo" />
      </div>

      <div class="heading">${body.heading}</div>

      <div class="content">
        <p>Hi ${body.name},</p>
        <p>${body.content}</p>
      </div>
    </div>
  </body>
</html>
`;

export default async (options: EmailOptions) => {
  try {
    await transporter.sendMail({
      ...options,
      from: process.env.GMAIL || "",
      html: htmlText(options.body),
    });
  } catch (error: any) {
    console.error("Error sending email: ", error);
  }
};
