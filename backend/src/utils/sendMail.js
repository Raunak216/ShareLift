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

async function sendAdminAlert(subject, text) {
  try {
    await transporter.sendMail({
      from: { name: "ShareLift System", address: process.env.EMAIL_USERNAME },
      to: process.env.ADMIN_EMAIL,
      subject: ` ${subject}`,
      text: `${text}\n\nTimestamp: ${new Date().toLocaleString("en-IN")}`,
    });
    console.log("Admin alert sent successfully.");
  } catch (err) {
    console.error(
      "CRITICAL: SMTP is likely blocked. Could not send Admin Alert:",
      err.message
    );
  }
}

const sendMailHelper = async (params) => {
  try {
    return await transporter.sendMail(params);
  } catch (err) {
    const msg = err.message || "";
    const isQuotaError = /quota|Daily sending|4\.7\.0|5\.4\.5/i.test(msg);

    if (isQuotaError) {
      console.error("Gmail Quota Exceeded. Triggering Admin Alert...");
      await sendAdminAlert(
        "Gmail Quota Exceeded",
        "The daily sending limit for Gmail has been reached. The email worker will pause operations until the next reset."
      );
    } else {
      await sendAdminAlert(
        "Email Delivery Failed",
        `An email to ${params.to} failed.\nError: ${msg}`
      );
    }

    throw err;
  }
};

// CONFIRMED GROUP MAIL

export async function sendGroupFormedMail({
  recipientEmail,
  userName,
  journeyDirection,
  journeyDate,
  journeyTime,
  transport,
  trainNumber,
  groupMembers,
}) {
  const memberListHTML = groupMembers
    .map(
      (m, i) => `
    <div style="border-bottom: 1px solid #eeeeee; padding: 12px 0;">
      <div style="font-weight: bold; color: #333; font-size: 16px;">
        ${i + 1}. ${m.name}
      </div>
      <div style="margin-top: 4px; color: #555; font-size: 14px;">
        📞 ${m.phone}
      </div>
      <div style="margin-top: 2px;">
        ✉️ <a href="mailto:${
          m.email
        }" style="color: #2b6cb0; text-decoration: none; font-size: 14px; word-break: break-all;">
          ${m.email}
        </a>
      </div>
    </div>`
    )
    .join("");

  const isTrainJourney = transport === "train";

  const journeyInfoHTML = isTrainJourney
    ? `<p style="margin: 5px 0;"><strong>🚆 Train Number:</strong> ${trainNumber}</p>`
    : `<p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${journeyTime}</p>`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f4;">
  <div style="padding:20px 0;">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
      <div style="background:#2b6cb0;padding:25px;text-align:center;color:#fff;">
        <h1 style="margin:0;font-size:24px;">Group Formed! 🚕</h1>
      </div>
      <div style="padding:25px;">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your travel group has been successfully formed.</p>

        <div style="background:#f8fafc;padding:15px;border-radius:8px;margin:20px 0;">
          <p><strong>📍 Direction:</strong> ${journeyDirection}</p>
          <p><strong>📅 Date:</strong> ${journeyDate}</p>
          ${journeyInfoHTML}
        </div>

        <p style="font-weight:bold;">Group Contact Details:</p>
        ${memberListHTML}

        <p style="margin-top:24px;background:#ebf8ff;padding:15px;border-left:4px solid #2b6cb0;">
          You can now connect with your group members using the contact details above.
        </p>

        <p style="text-align:center;color:#888;margin-top:30px;">
          Safe travels!<br/><strong>The ShareLift Team</strong>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;

  return sendMailHelper({
    from: { name: "ShareLift", address: process.env.EMAIL_USERNAME },
    to: recipientEmail,
    subject: "Your Group is Formed",
    html,
    text: `Hi ${userName}, your group for ${journeyDirection} on ${journeyDate} is formed!`,
  });
}

//PARTIAL GROUP MAIL

export async function sendPartialMail({
  recipientEmail,
  userName,
  journeyDirection,
  journeyDate,
  groupMembers,
}) {
  const html = `
  <p>Hi <strong>${userName}</strong>,</p>
  <p>Your group for <strong>${journeyDirection}</strong> on <strong>${journeyDate}</strong> is still forming.</p>
  <p>Current members:</p>
  ${groupMembers
    .map(
      (m, i) => `<p>${i + 1}. ${m.name}<br/>📞 ${m.phone}<br/>✉️ ${m.email}</p>`
    )
    .join("")}
  <p>We’ll notify you if more members join.</p>
  `;

  return sendMailHelper({
    from: { name: "ShareLift", address: process.env.EMAIL_USERNAME },
    to: recipientEmail,
    subject: "Group Update – Still Forming",
    html,
    text: `Hi ${userName}, your group for ${journeyDirection} on ${journeyDate} is still forming.`,
  });
}

// export async function sendRegretMail({
//   recipientEmail,
//   userName,
//   journeyDirection,
//   journeyDate,
// }) {
//   const html = `
//   <p>Hi <strong>${userName}</strong>,</p>
//   <p>Unfortunately, we couldn’t form a group for <strong>${journeyDirection}</strong> on <strong>${journeyDate}</strong>.</p>
//   <p>Sorry we cant serve you well.</p>
//   `;

//   return sendMailHelper({
//     from: { name: "ShareLift", address: process.env.EMAIL_USERNAME },
//     to: recipientEmail,
//     subject: "Group Not Formed",
//     html,
//     text: `Hi ${userName}, we couldn’t form a group for ${journeyDirection} on ${journeyDate}.`,
//   });
// }

export default transporter;
