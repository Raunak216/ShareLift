import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendMailHelper = async (params) => {
  try {
    return await transporter.sendMail(params);
  } catch (e) {
    console.error("Nodemailer Error:", e);
    throw e;
  }
};

// 1. Send Group Formed Mail
export async function sendGroupFormedMail({
  recipientEmail,
  userName,
  journeyDirection,
  journeyDate,
  journeyTime,
  groupMembers,
}) {
  const memberListHTML = groupMembers
    .map(
      (m, i) => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #eee;">${i + 1}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.name}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.email}</td>
        <td style="padding:8px; border-bottom:1px solid #eee;">${m.phone}</td>
      </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Arial, sans-serif; color:#333; background:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#2b6cb0;">Your Group is Formed!</h2>
      <p>Hi ${userName},</p>
      <p>Your travel group has been successfully formed! Here are the details:</p>

      <div style="margin:16px 0; padding:12px; background:#edf2f7; border-radius:6px;">
        <strong>Direction:</strong> ${journeyDirection}<br/>
        <strong>Date:</strong> ${journeyDate}<br/>
        <strong>Time:</strong> ${journeyTime}
      </div>

      <p><strong>Group Members:</strong></p>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="text-align:left; padding:8px;">#</th>
            <th style="text-align:left; padding:8px;">Name</th>
            <th style="text-align:left; padding:8px;">Email</th>
            <th style="text-align:left; padding:8px;">Phone</th>
          </tr>
        </thead>
        <tbody>${memberListHTML}</tbody>
      </table>

      <p style="margin-top:20px;">You can now contact your group members to coordinate your trip.</p>
      <p style="font-size:13px; color:#555;">- The ShareLift Team</p>
    </div>
  </div>`;

  const text = `Hi ${userName},
Your travel group has been successfully formed!

Direction: ${journeyDirection}
Date: ${journeyDate}
Time: ${journeyTime}

- The ShareLift Team`;

  return sendMailHelper({
    from: { name: "ShareLift", address: process.env.EMAIL_USERNAME },
    to: recipientEmail,
    subject: "Group formed success",
    html,
    text,
  });
}

export default transporter;
