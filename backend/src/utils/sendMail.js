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
    const info = await transporter.sendMail(params);
    return info;
  } catch (e) {
    console.error("Nodemailer Error:", e);
    throw e;
  }
};

// ==========================================
// 1. Send Group Formed Mail
// ==========================================
async function sendGroupFormedMail({
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

  const htmlBody = `
  <div style="font-family:Arial, sans-serif; color:#333; background:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#2b6cb0;"> Your ShareLift Group is Confirmed!</h2>
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

  const textBody = `Hi ${userName},\n\nYour travel group has been successfully formed!\n\nDirection: ${journeyDirection}\nDate: ${journeyDate}\nTime: ${journeyTime}\n\nCheck the app for member details.\n\n– The ShareLift Team`;

  const params = {
    from: {
      name: "ShareLift No-reply",
      address: process.env.EMAIL_USERNAME,
    },
    to: recipientEmail,
    subject: "Your ShareLift Group is Confirmed",
    html: htmlBody,
    text: textBody,
  };

  try {
    const info = await sendMailHelper(params);
    console.log("Group Formed Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending confirmation email:", err);
    throw new Error("Failed to send confirmation email");
  }
}
export { sendGroupFormedMail };

//
export async function sendMailFromQueue(job) {
  const { emailType, recipientEmail, payload } = job;

  let html, subject;

  if (emailType === "GROUP_FORMED") {
    subject = "Your ShareLift Group is Confirmed";
    html = groupFormedTemplate(payload);
  } else if (emailType === "PARTIAL") {
    subject = "Partial Group Formed";
    html = partialTemplate(payload);
  } else if (emailType === "REGRET") {
    subject = "No Group Could Be Formed";
    html = regretTemplate(payload);
  }

  return transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: recipientEmail,
    subject,
    html,
  });
}
