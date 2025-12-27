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
      <tr>
        <td style="padding:10px; border-bottom:1px solid #eeeeee; font-size:14px;">${
          i + 1
        }</td>
        <td style="padding:10px; border-bottom:1px solid #eeeeee; font-size:14px;"><strong>${
          m.name
        }</strong></td>
        <td style="padding:10px; border-bottom:1px solid #eeeeee; font-size:14px; color:#555555;">${
          m.phone
        }</td>
      </tr>`
    )
    .join("");

  const isTrainJourney = transport === "train";

  const journeyInfoHTML = isTrainJourney
    ? `<p style="margin: 5px 0;"><strong>🚆 Train Number:</strong> ${trainNumber}</p>`
    : `<p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${journeyTime}</p>`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #2b6cb0; padding: 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">Group Formed! 🚕</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">Great news! Your travel group has been successfully formed.</p>
          <div style="background: #edf2f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📍 Direction:</strong> ${journeyDirection}</p>
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${journeyDate}</p>
            ${journeyInfoHTML}
          </div>

          <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">Group Contact Details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; background-color: #f8fafc;">
                <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">#</th>
                <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Name</th>
                <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Phone</th>
              </tr>
            </thead>
            <tbody>
              ${memberListHTML}
            </tbody>
          </table>

          <p style="
  margin-top: 24px;
  font-size: 15px;
  line-height: 1.6;
  color: #444444;
  background-color: #f8fafc;
  padding: 14px 16px;
  border-radius: 8px;
  border-left: 4px solid #2b6cb0;
">
  You can now connect with your group members using the contact details above
  to coordinate your travel plans smoothly and ensure a hassle-free journey.
</p>

          <p style="margin-top: 30px; font-size: 14px; color: #777; text-align: center;">
            Safe travels!<br/><strong>The ShareLift Team</strong>
          </p>
        </div>
      </div>
    </div>`;

  return sendMailHelper({
    from: { name: "ShareLift", address: process.env.EMAIL_USERNAME },
    to: recipientEmail,
    subject: "Your Group is Formed",
    html,
    text: `Hi ${userName}, your group for ${journeyDirection} on ${journeyDate} is formed! Members: ${groupMembers
      .map((m) => m.name)
      .join(", ")}`,
  });
}

export default transporter;
